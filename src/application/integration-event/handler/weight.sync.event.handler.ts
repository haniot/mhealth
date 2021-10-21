import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { WeightSyncEvent } from '../event/weight.sync.event'
import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IMeasurementRepository } from '../../port/measurement.repository.interface'
import { ILogger } from '../../../utils/custom.logger'
import { Weight } from '../../domain/model/weight'
import { CreateWeightValidator } from '../../domain/validator/create.weight.validator'
import { BodyFat } from '../../domain/model/body.fat'
import { MeasurementTypes } from '../../domain/utils/measurement.types'
import { ValidationException } from '../../domain/exception/validation.exception'
import { IntegrationEvent } from '../event/integration.event'
import { WeightLastSaveEvent } from '../event/weight.last.save.event'
import { IIntegrationEventRepository } from '../../port/integration.event.repository.interface'
import { IEventBus } from '../../../infrastructure/port/event.bus.interface'
import moment from 'moment'

export class WeightSyncEventHandler implements IIntegrationEventHandler<WeightSyncEvent> {
    constructor(
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _measurementRepo: IMeasurementRepository,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepo: IIntegrationEventRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: any): Promise<void> {
        if (!event.weight) {
            throw new ValidationException('Event is not in the expected format!', JSON.stringify(event))
        }

        const success: Array<any> = []
        let countSuccess = 0
        let countError = 0
        if (event.weight instanceof Array) {
            for (const item of event.weight) {
                try {
                    const result: any = await this.updateOrCreate(event, item)
                    success.push(result)
                    countSuccess++
                } catch (err: any) {
                    this._logger.warn(`An error occurred while attempting `
                        .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                        .concat(err.description ? ' ' + err.description : ''))
                    countError++
                }
            }
            if (success.length) this.publishLastMeasurement(success)

            this._logger.info(`Action for event ${event.event_name} successfully held! Total successful items: `
                .concat(`${countSuccess} / Total items with error: ${countError}`))
        } else {
            try {
                const result: any = await this.updateOrCreate(event, event.weight)
                this.publishLastMeasurement(result)
                this._logger.info(
                    `Action for event ${event.event_name} associated with patient with ID: ${event.weight.user_id}`
                        .concat('successfully performed!'))
            } catch (err: any) {
                this._logger.error(`An error occurred while attempting `
                    .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                    .concat(err.description ? ' ' + err.description : ''))
            }
        }
    }

    public async updateOrCreate(event: WeightSyncEvent, item: any): Promise<any> {
        const weight: Weight = new Weight().fromJSON(item)
        if (item.user_id) weight.patient_id = item.user_id
        try {
            // 1. Validate Weight object
            CreateWeightValidator.validate(weight)

            // 2a. Update (or create if doesn't exist) a BodyFat Measurement if the Weight has the body_fat attribute populated.
            if (weight.body_fat) {
                const bodyFat = new BodyFat().fromJSON({
                    ...weight.toJSON(), type: MeasurementTypes.BODY_FAT,
                    value: weight.body_fat, unit: '%'
                })
                bodyFat.patient_id = item.user_id

                await this._measurementRepo.updateOrCreate(bodyFat)
            }
        } catch (err) {
            throw err
        }
        // 2b. Update (or create if doesn't exist) a Weight Measurement
        return this._measurementRepo.updateOrCreate(weight)
    }

    private publishLastMeasurement(data: any | Array<any>): void {
        if (data instanceof Array) {
            // Descent sort by timestamp
            const sort_data: Array<any> =
                data.sort((prev, next) => moment(prev.timestamp).diff(moment(next.timestamp)) > 0 ? -1 : 1)

            const weight: Weight = sort_data.filter(measurement => measurement.type === MeasurementTypes.WEIGHT)[0]
            if (weight !== undefined) this.publishLastMeasurement(weight)
        }

        if (data.type === MeasurementTypes.WEIGHT) {
            this.publishEvent(new WeightLastSaveEvent(new Date(), data), data.patient_id).then()
        }
    }

    private async publishEvent(event: IntegrationEvent<Weight>, userId: string): Promise<void> {
        try {
            const successPublish = await this._eventBus.publish(event, WeightLastSaveEvent.ROUTING_KEY)
            if (!successPublish) throw new Error('')
            this._logger.info(`Last weight from ${userId} successful published!`)
        } catch (err) {
            const saveEvent: any = event.toJSON()
            this._integrationEventRepo.create({
                ...saveEvent,
                __routing_key: WeightLastSaveEvent.ROUTING_KEY,
                __operation: 'publish'
            })
                .then(() => {
                    this._logger.warn(`Could not publish the event named ${event.event_name}.`
                        .concat(` The event was saved in the database for a possible recovery.`))
                })
                .catch(err => {
                    this._logger.error(`There was an error trying to save the name event: ${event.event_name}.`
                        .concat(`Error: ${err.message}. Event: ${JSON.stringify(saveEvent)}`))
                })
        }
    }
}
