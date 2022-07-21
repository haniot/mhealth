import { inject, injectable } from 'inversify'
import qs from 'query-strings-parser'
import { EventBusException } from '../../application/domain/exception/eventbus.exception'
import { SleepDuration } from '../../application/domain/model/sleep.duration'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { IQuery } from '../../application/port/query.interface'
import { ISleepDurationRepository } from '../../application/port/sleep.duration.repository.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { ILogger } from '../../utils/custom.logger'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.SLEEP_DURATION_REPOSITORY) private readonly _sleepDurationRepository: ISleepDurationRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.initializeServer()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new EventBusException(`Error stopping RPC Server! ${err.message}`))
        }
    }

    private initializeServer(): void {
        // Providing sleepdurations.find.
        this._eventBus
            .provideResource('sleepdurations.find', async (_query?: string) => {
                try {
                    const query: IQuery = this.buildQS(_query)
                    const sleepDuration: Array<SleepDuration> = await this._sleepDurationRepository.find(query)
                    return sleepDuration.map(item => item.toJSON())
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource sleepdurations.find successful registered'))
            .catch((err) => this._logger.error(`Error at register resource sleepdurations.find: ${err.message}`))
    }

    /**
     * Builds the query string based on defaults parameters and values.
     *
     * @param query
     */
    private buildQS(query?: any): IQuery {
        return new Query().fromJSON(
            qs.parser(query ? query : {}, { pagination: { limit: Number.MAX_SAFE_INTEGER } },
                { use_page: true })
        )
    }
}
