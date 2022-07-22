import { inject, injectable } from 'inversify'
import { EventBusException } from '../../application/domain/exception/eventbus.exception'
import { SleepDuration } from '../../application/domain/model/sleep.duration'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { ISleepDurationService } from '../../application/port/sleep.duration.service.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.SLEEP_DURATION_SERVICE) private readonly _sleepDurationService: ISleepDurationService,
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
        // Providing sleepdurations.aggregatebypatient.
        this._eventBus
            .provideResource('sleepdurations.aggregatebypatient', async (patientId: string, startDate: string,
                endDate: string) => {
                try {
                    const sleepDuration: SleepDuration =
                        await this._sleepDurationService.getDurationByPatient(patientId, startDate, endDate)
                    return sleepDuration.toJSON()
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource sleepdurations.aggregatebypatient successful registered'))
            .catch((err) => this._logger.error(`Error at register resource sleepdurations.aggregatebypatient: ${err.message}`))
    }
}
