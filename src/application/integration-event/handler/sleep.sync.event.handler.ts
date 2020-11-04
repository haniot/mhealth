import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { ILogger } from '../../../utils/custom.logger'
import { SleepSyncEvent } from '../event/sleep.sync.event'
import { Sleep } from '../../domain/model/sleep'
import { CreateSleepValidator } from '../../domain/validator/create.sleep.validator'
import { ISleepRepository } from '../../port/sleep.repository.interface'
import { ValidationException } from '../../domain/exception/validation.exception'
import { AwakeningsTask } from '../../../background/task/awakenings.task'

export class SleepSyncEventHandler implements IIntegrationEventHandler<SleepSyncEvent> {
    constructor(
        @inject(Identifier.SLEEP_REPOSITORY) private readonly _sleepRepo: ISleepRepository,
        @inject(Identifier.AWAKENINGS_TASK) private readonly _awakeningsTask: AwakeningsTask,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: SleepSyncEvent): Promise<void> {
        if (!event.sleep) {
            throw new ValidationException('Event is not in the expected format!', JSON.stringify(event))
        }

        let countSuccess = 0
        let countError = 0
        if (event.sleep instanceof Array) {
            for (const item of event.sleep) {
                try {
                    const sleep: Sleep = await this.updateOrCreate(event, item)
                    // Calculates the awakenings for synchronized sleep.
                    this._awakeningsTask.calculateAwakenings(sleep)
                        .then()
                        .catch((err) => {
                            this._logger.error(`An error occurred while attempting calculate awakenings `
                                .concat(`for the sleep with id: ${sleep.id}. ${err.message}`)
                                .concat(err.description ? ' ' + err.description : ''))
                        })
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
                const sleep: Sleep = await this.updateOrCreate(event, event.sleep)
                // Calculates awakenings for synchronized sleep.
                this._awakeningsTask.calculateAwakenings(sleep)
                    .then()
                    .catch((err) => {
                        this._logger.error(`An error occurred while attempting calculate awakenings `
                            .concat(`for the sleep with id: ${sleep.id}. ${err.message}`)
                            .concat(err.description ? ' ' + err.description : ''))
                    })
                this._logger.info(
                    `Action for event ${event.event_name} associated with patient with ID: ${event.sleep.patient_id}`
                        .concat(' successfully performed!'))
            } catch (err) {
                this._logger.error(`An error occurred while attempting `
                    .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                    .concat(err.description ? ' ' + err.description : ''))
            }
        }
    }

    public async updateOrCreate(event: SleepSyncEvent, item: Sleep): Promise<any> {
        const sleep: Sleep = new Sleep().fromJSON(item)
        try {
            if (item.patient_id) sleep.patient_id = item.patient_id

            // 1. Validate Sleep object
            CreateSleepValidator.validate(sleep)
        } catch (err) {
            throw err
        }
        // 2. Update (or create if doesn't exist) a Sleep
        return this._sleepRepo.updateOrCreate(sleep)
    }
}
