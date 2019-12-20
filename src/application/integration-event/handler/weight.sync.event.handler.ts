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

export class WeightSyncEventHandler implements IIntegrationEventHandler<WeightSyncEvent> {
    constructor(
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _measurementRepo: IMeasurementRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: WeightSyncEvent): Promise<void> {
        try {
            if (!event.weight) return
            if (event.weight instanceof Array) {
                for (const item of event.weight) {
                    await this.updateOrCreate(event, item)
                }
            }
            else await this.updateOrCreate(event, event.weight)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }

    public async updateOrCreate(event: WeightSyncEvent, item: Weight): Promise<void> {
        const weight: Weight = new Weight().fromJSON(item)
        let patientId: string = ''
        if (item.patient_id) {
            patientId = item.patient_id
            weight.patient_id = patientId
        }

        // 1. Validate Weight object
        CreateWeightValidator.validate(weight)

        // 2a. Update (or create if doesn't exist) a BodyFat Measurement if the Weight has the body_fat attribute populated.
        if (weight.body_fat) {
            const bodyFat = new BodyFat().fromJSON({ ...weight.toJSON(), type: MeasurementTypes.BODY_FAT,
                value: weight.body_fat, unit: '%' })
            bodyFat.patient_id = item.patient_id

            await this._measurementRepo.updateOrCreate(bodyFat)
        }

        // 2b. Update (or create if doesn't exist) a Weight Measurement
        await this._measurementRepo.updateOrCreate(weight)

        this._logger.info(
            `Action for event ${event.event_name} associated with patient with ID: ${patientId} successfully performed!`)
    }
}
