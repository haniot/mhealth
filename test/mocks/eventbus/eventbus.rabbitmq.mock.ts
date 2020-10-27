import { IEventBus } from '../../../src/infrastructure/port/event.bus.interface'
import { IntegrationEvent } from '../../../src/application/integration-event/event/integration.event'
import { IIntegrationEventHandler } from '../../../src/application/integration-event/handler/integration.event.handler.interface'
import { IConnectionEventBus } from '../../../src/infrastructure/port/connection.event.bus.interface'
import { TimeseriesMock } from '../models/timeseries.mock'
import { EventBusException } from '../../../src/application/domain/exception/eventbus.exception'

export class EventBusRabbitMQMock implements IEventBus {
    public bus: any

    constructor(
        public connectionPub: IConnectionEventBus,
        public connectionSub: IConnectionEventBus,
        public connectionRpcServer: IConnectionEventBus,
        public connectionRpcClient: IConnectionEventBus
    ) {
    }

    public enableLogger(level?: string): void {
        return
    }

    public publish(event: IntegrationEvent<any>, routingKey: string): Promise<boolean> {
        return Promise.resolve(false)
    }

    public subscribe(event: IntegrationEvent<any>, handler: IIntegrationEventHandler<IntegrationEvent<any>>, routingKey: string):
        Promise<boolean> {
        return Promise.resolve(false)
    }

    public provideResource(name: string, listener: (...any) => any): Promise<boolean> {
        return Promise.resolve(false)
    }

    public executeResource(serviceName: string, resourceName: string, ...params: any[]): Promise<any> {
        if (resourceName === 'intraday.find') {
            if (params[2] === '2020-10-01') throw new EventBusException('rpc timed out')
            return Promise.resolve(new TimeseriesMock().generate())
        }
        return Promise.resolve(undefined)
    }

    public dispose(): Promise<void> {
        return Promise.resolve()
    }
}
