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
        let countSuccess = 0
        let countError = 0
        if (!event.sleep) return
        if (event.sleep instanceof Array) {
            for (const item of event.sleep) {
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
                await this.updateOrCreate(event, event.sleep)
                this._logger.info(
                    `Action for event ${event.event_name} associated with patient with ID: ${event.sleep.patient_id}`
                        .concat('successfully performed!'))
            } catch (err) {
                this._logger.warn(`An error occurred while attempting `
                    .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                    .concat(err.description ? ' ' + err.description : ''))
            }
        }
    }

    public async updateOrCreate(event: SleepSyncEvent, item: Sleep): Promise<any> {
        const sleep: Sleep = new Sleep().fromJSON(item)
        try {
            let patientId: string = ''
            if (item.patient_id) {
                patientId = item.patient_id
                sleep.patient_id = patientId
            }

            // 1. Validate Sleep object
            CreateSleepValidator.validate(sleep)
        } catch (err) {
            throw err
        }
        // 2. Update (or create if doesn't exist) a Sleep
        return this._sleepRepo.updateOrCreate(sleep)
    }
}
