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
        try {
            if (!event.physical_activity) return
            if (event.physical_activity instanceof Array) {
                for (const item of event.physical_activity) {
                    await this.updateOrCreate(event, item)
                }
            }
            else await this.updateOrCreate(event, event.physical_activity)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }

    public async updateOrCreate(event: PhysicalActivitySyncEvent, item: PhysicalActivity): Promise<void> {
        const physicalActivity: PhysicalActivity = new PhysicalActivity().fromJSON(item)
        let patientId: string = ''
        if (item.patient_id) {
            patientId = item.patient_id
            physicalActivity.patient_id = patientId
        }

        // 1. Validate PhysicalActivity object
        CreatePhysicalActivityValidator.validate(physicalActivity)

        // 2. Update (or create if doesn't exist) a PhysicalActivity
        await this._activityRepo.updateOrCreate(physicalActivity)

        this._logger.info(
            `Action for event ${event.event_name} associated with patient with ID: ${patientId} successfully performed!`)
    }
}
