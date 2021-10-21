import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { IIntegrationEventRepository } from '../../application/port/integration.event.repository.interface'
import { IntegrationEvent } from '../../application/integration-event/event/integration.event'
import { WeightLastSaveEvent } from '../../application/integration-event/event/weight.last.save.event'
import { Weight } from '../../application/domain/model/weight'
import { HeightLastSaveEvent } from '../../application/integration-event/event/height.last.save.event'
import { Height } from '../../application/domain/model/height'

@injectable()
export class PublishEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY)
        private readonly _integrationEventRepository: IIntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.internalPublishSavedEvents().then()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping PublishEventBusTask! ${err.message}`))
        }
    }

    private async internalPublishSavedEvents(): Promise<void> {
        if (!this._eventBus.connectionPub.isOpen) return

        try {
            const result: Array<any> = await this._integrationEventRepository.find(new Query())
            result.forEach((item: IntegrationEvent<any>) => {
                const event: any = item.toJSON()

                this._publishEvent(event)
                    .then(success => {
                        if (success) {
                            this._logger.info(`Event with name ${event.event_name}, which was saved, `
                                .concat('was successfully published to the event bus.'))
                            this._integrationEventRepository
                                .delete(event.id)
                                .catch(err => {
                                    this._logger.error(`Error trying to remove saved event: ${err.message}`)
                                })
                        }
                    })
                    .catch(() => {
                        this._logger.error('An error occurred while attempting to post the'
                            .concat(`saved event by name ${event.event_name} and ID: ${event.id}`))
                    })
            })
        } catch (err: any) {
            this._logger.error(`Error retrieving saved events: ${err.message}`)
        }
    }

    private _publishEvent(event: any): Promise<boolean> {
        if (event.event_name === WeightLastSaveEvent.NAME) {
            const weightLastSaveEvent: WeightLastSaveEvent = new WeightLastSaveEvent(
                event.timestamp,
                new Weight().fromJSON(event.weight)
            )
            return this._eventBus.publish(weightLastSaveEvent, event.__routing_key)
        }
        if (event.event_name === HeightLastSaveEvent.NAME) {
            const heightLastSaveEvent: HeightLastSaveEvent = new HeightLastSaveEvent(
                event.timestamp,
                new Height().fromJSON(event.height)
            )
            return this._eventBus.publish(heightLastSaveEvent, event.__routing_key)
        }
        return Promise.resolve(false)
    }
}
