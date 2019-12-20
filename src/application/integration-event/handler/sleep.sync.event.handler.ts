import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { ILogger } from '../../../utils/custom.logger'
import { SleepSyncEvent } from '../event/sleep.sync.event'
import { Sleep } from '../../domain/model/sleep'
import { CreateSleepValidator } from '../../domain/validator/create.sleep.validator'
import { ISleepRepository } from '../../port/sleep.repository.interface'

export class SleepSyncEventHandler implements IIntegrationEventHandler<SleepSyncEvent> {
    constructor(
        @inject(Identifier.SLEEP_REPOSITORY) private readonly _sleepRepo: ISleepRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: SleepSyncEvent): Promise<void> {
        try {
            if (!event.sleep) return
            if (event.sleep instanceof Array) {
                for (const item of event.sleep) {
                    await this.updateOrCreate(event, item)
                }
            }
            else await this.updateOrCreate(event, event.sleep)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }

    public async updateOrCreate(event: SleepSyncEvent, item: Sleep): Promise<void> {
        const sleep: Sleep = new Sleep().fromJSON(item)
        let patientId: string = ''
        if (item.patient_id) {
            patientId = item.patient_id
            sleep.patient_id = patientId
        }

        // 1. Validate Sleep object
        CreateSleepValidator.validate(sleep)

        // 2. Update (or create if doesn't exist) a Sleep
        await this._sleepRepo.updateOrCreate(sleep)

        this._logger.info(
            `Action for event ${event.event_name} associated with patient with ID: ${patientId} successfully performed!`)
    }
}
