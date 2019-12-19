import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { WeightSyncEvent } from '../event/weight.sync.event'
import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IMeasurementRepository } from '../../port/measurement.repository.interface'
import { ILogger } from '../../../utils/custom.logger'
import { Weight } from '../../domain/model/weight'
import { CreateWeightValidator } from '../../domain/validator/create.weight.validator'

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
                    const weight: Weight = new Weight().fromJSON(item)
                    let patientId: string = ''
                    if (item.patient_id) {
                        patientId = item.patient_id
                        weight.patient_id = patientId
                    }

                    // 1. Validate Weight object
                    CreateWeightValidator.validate(weight)

                    this._logger.info(
                        `Prepare to update (or create if doesn't exist) weight measurement from user: ${patientId}...`)

                    // 2. Update (or create if doesn't exist) a Weight Measurement
                    await this._measurementRepo.updateMeasurement(weight)

                    this._logger.info(
                        `Action for event ${event.event_name} associated with patient with ID: ${patientId} successfully performed!`)
                }
            }
            else {
                const weight: Weight = new Weight().fromJSON(event.weight)
                let patientId: string = ''
                if (event.weight.patient_id) {
                    patientId = event.weight.patient_id
                    weight.patient_id = patientId
                }

                // 1. Validate Weight object
                CreateWeightValidator.validate(weight)

                this._logger.info(
                    `Prepare to update (or create if doesn't exist) weight measurement from user: ${patientId}...`)

                // 2. Update (or create if doesn't exist) a Weight Measurement
                await this._measurementRepo.updateMeasurement(weight)

                this._logger.info(
                    `Action for event ${event.event_name} associated with patient with ID: ${patientId} successfully performed!`)
            }
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
