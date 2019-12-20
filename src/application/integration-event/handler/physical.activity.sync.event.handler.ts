import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { ILogger } from '../../../utils/custom.logger'
import { PhysicalActivitySyncEvent } from '../event/physical.activity.sync.event'
import { IPhysicalActivityRepository } from '../../port/physical.activity.repository.interface'
import { PhysicalActivity } from '../../domain/model/physical.activity'
import { CreatePhysicalActivityValidator } from '../../domain/validator/create.physical.activity.validator'

export class PhysicalActivitySyncEventHandler implements IIntegrationEventHandler<PhysicalActivitySyncEvent> {
    constructor(
        @inject(Identifier.ACTIVITY_REPOSITORY) private readonly _activityRepo: IPhysicalActivityRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: PhysicalActivitySyncEvent): Promise<void> {
        let countSuccess = 0
        let countError = 0
        if (!event.physical_activity) return
        if (event.physical_activity instanceof Array) {
            for (const item of event.physical_activity) {
                try {
                    await this.updateOrCreate(event, item)
                    countSuccess++
                } catch (err) {
                    this._logger.warn(`An error occurred while attempting `
                        .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                        .concat(err.description ? ' ' + err.description : ''))
                    countError++
                }
            }
            this._logger.info(`Action for event ${event.event_name} successfully held! Total successful items: `
                .concat(`${countSuccess} / Total items with error: ${countError}`))
        } else {
            try {
                await this.updateOrCreate(event, event.physical_activity)
                this._logger.info(
                    `Action for event ${event.event_name} associated with patient with ID: ${event.physical_activity.patient_id}`
                        .concat('successfully performed!'))
            } catch (err) {
                this._logger.warn(`An error occurred while attempting `
                    .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                    .concat(err.description ? ' ' + err.description : ''))
            }
        }
    }

    public async updateOrCreate(event: PhysicalActivitySyncEvent, item: PhysicalActivity): Promise<any> {
        const physicalActivity: PhysicalActivity = new PhysicalActivity().fromJSON(item)
        try {
            let patientId: string = ''
            if (item.patient_id) {
                patientId = item.patient_id
                physicalActivity.patient_id = patientId
            }

            // 1. Validate PhysicalActivity object
            CreatePhysicalActivityValidator.validate(physicalActivity)
        } catch (err) {
            throw err
        }
        // 2. Update (or create if doesn't exist) a PhysicalActivity
        return this._activityRepo.updateOrCreate(physicalActivity)
    }
}