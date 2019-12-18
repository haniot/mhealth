import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { UserDeleteEvent } from '../../application/integration-event/event/user.delete.event'
import { UserDeleteEventHandler } from '../../application/integration-event/handler/user.delete.event.handler'
import { DIContainer } from '../../di/di'
import { Default } from '../../utils/default'
import fs from 'fs'
import { WeightSyncEvent } from '../../application/integration-event/event/weight.sync.event'
import { IMeasurementRepository } from '../../application/port/measurement.repository.interface'
import { WeightSyncEventHandler } from '../../application/integration-event/handler/weight.sync.event.handler'

@injectable()
export class SubscribeEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        // To use SSL/TLS, simply mount the uri with the amqps protocol and pass the CA.
        const rabbitUri = process.env.RABBITMQ_URI || Default.RABBITMQ_URI
        const rabbitOptions: any = { sslOptions: { ca: [] } }
        if (rabbitUri.indexOf('amqps') === 0) {
            rabbitOptions.sslOptions.ca = [fs.readFileSync(process.env.RABBITMQ_CA_PATH || Default.RABBITMQ_CA_PATH)]
        }
        // Before performing the subscribe is trying to connect to the bus.
        // If there is no connection, infinite attempts will be made until
        // the connection is established successfully. Once you have the
        // connection, event registration is performed.
        this._eventBus
            .connectionSub
            .open(rabbitUri, rabbitOptions)
            .then(() => {
                this._logger.info('Subscribe connection initialized successfully')
                this.initializeSubscribe()
            })
            .catch(err => {
                this._logger.error(`Could not open connection to subscribe to message bus, ${err.message}`)
            })
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
    private async initializeSubscribe(): Promise<void> {
        try {
            /**
             * Subscribe in UserDeleteEvent
             */
            this._eventBus
                .subscribe(
                    new UserDeleteEvent(new Date()),
                    new UserDeleteEventHandler(DIContainer.get(Identifier.MEASUREMENT_REPOSITORY), this._logger),
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
                .subscribe(
                    new WeightSyncEvent(),
                    new WeightSyncEventHandler(
                        DIContainer.get<IMeasurementRepository>(Identifier.MEASUREMENT_REPOSITORY),
                        this._logger),
                    WeightSyncEvent.ROUTING_KEY)
                .then((result: boolean) => {
                    if (result) this._logger.info('Subscribe in WeightSyncEvent successful!')
                })
                .catch(err => {
                    this._logger.error(`Error in Subscribe WeightSyncEvent! ${err.message}`)
                })
        } catch (err) {
            this._logger.error(`An error occurred while subscribing to events. ${err.message}`)
        }
    }
}
