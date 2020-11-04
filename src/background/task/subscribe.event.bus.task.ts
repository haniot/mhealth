import { DIContainer } from '../../di/di'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { UserDeleteEvent } from '../../application/integration-event/event/user.delete.event'
import { UserDeleteEventHandler } from '../../application/integration-event/handler/user.delete.event.handler'
import { WeightSyncEvent } from '../../application/integration-event/event/weight.sync.event'
import { IMeasurementRepository } from '../../application/port/measurement.repository.interface'
import { WeightSyncEventHandler } from '../../application/integration-event/handler/weight.sync.event.handler'
import { PhysicalActivitySyncEvent } from '../../application/integration-event/event/physical.activity.sync.event'
import { PhysicalActivitySyncEventHandler } from '../../application/integration-event/handler/physical.activity.sync.event.handler'
import { IPhysicalActivityRepository } from '../../application/port/physical.activity.repository.interface'
import { SleepSyncEvent } from '../../application/integration-event/event/sleep.sync.event'
import { SleepSyncEventHandler } from '../../application/integration-event/handler/sleep.sync.event.handler'
import { ISleepRepository } from '../../application/port/sleep.repository.interface'
import { AwakeningsTask } from './awakenings.task'

@injectable()
export class SubscribeEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.initializeSubscribe()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping SubscribeEventBusTask! ${err.message}`))
        }
    }

    /**
     * Subscribe for all events.
     */
    private initializeSubscribe(): void {
        /**
         * Subscribe in UserDeleteEvent
         */
        this._eventBus
            .subscribe(new UserDeleteEvent(), new UserDeleteEventHandler(
                DIContainer.get(Identifier.MEASUREMENT_REPOSITORY),
                DIContainer.get(Identifier.ACTIVITY_REPOSITORY),
                DIContainer.get(Identifier.SLEEP_REPOSITORY),
                this._logger),
                UserDeleteEvent.ROUTING_KEY
            )
            .then((result: boolean) => {
                if (result) this._logger.info('Subscribe in UserDeleteEvent successful!')
            })
            .catch(err => {
                this._logger.error(`Error in Subscribe UserDeleteEvent! ${err.message}`)
            })

        /**
         * Subscribe in WeightSyncEvent
         */
        this._eventBus
            .subscribe(new WeightSyncEvent(), new WeightSyncEventHandler(
                DIContainer.get<IMeasurementRepository>(Identifier.MEASUREMENT_REPOSITORY),
                DIContainer.get(Identifier.INTEGRATION_EVENT_REPOSITORY),
                DIContainer.get(Identifier.RABBITMQ_EVENT_BUS),
                this._logger),
                WeightSyncEvent.ROUTING_KEY)
            .then((result: boolean) => {
                if (result) this._logger.info('Subscribe in WeightSyncEvent successful!')
            })
            .catch(err => {
                this._logger.error(`Error in Subscribe WeightSyncEvent! ${err.message}`)
            })

        /**
         * Subscribe in PhysicalActivitySyncEvent
         */
        this._eventBus
            .subscribe(new PhysicalActivitySyncEvent(), new PhysicalActivitySyncEventHandler(
                DIContainer.get<IPhysicalActivityRepository>(Identifier.ACTIVITY_REPOSITORY),
                this._logger),
                PhysicalActivitySyncEvent.ROUTING_KEY)
            .then((result: boolean) => {
                if (result) this._logger.info('Subscribe in PhysicalActivitySyncEvent successful!')
            })
            .catch(err => {
                this._logger.error(`Error in Subscribe PhysicalActivitySyncEvent! ${err.message}`)
            })

        /**
         * Subscribe in SleepSyncEvent
         */
        this._eventBus
            .subscribe(new SleepSyncEvent(), new SleepSyncEventHandler(
                DIContainer.get<ISleepRepository>(Identifier.SLEEP_REPOSITORY),
                DIContainer.get<AwakeningsTask>(Identifier.AWAKENINGS_TASK),
                this._logger),
                SleepSyncEvent.ROUTING_KEY)
            .then((result: boolean) => {
                if (result) this._logger.info('Subscribe in SleepSyncEvent successful!')
            })
            .catch(err => {
                this._logger.error(`Error in Subscribe SleepSyncEvent! ${err.message}`)
            })
    }
}
