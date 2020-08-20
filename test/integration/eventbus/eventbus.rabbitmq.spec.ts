import { expect } from 'chai'
import { IntegrationEvent } from '../../../src/application/integration-event/event/integration.event'
import { IIntegrationEventHandler } from '../../../src/application/integration-event/handler/integration.event.handler.interface'
import { EventBusRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { Default } from '../../../src/utils/default'
import { ConnectionRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { ConnectionFactoryRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { User } from '../../../src/application/domain/model/user'
import { GenericUserEventMock } from '../../mocks/generic.user.event.mock'
import { GenericUserEventHandlerMock } from '../../mocks/generic.user.event.handler.mock'

const eventBus: EventBusRabbitMQ = new EventBusRabbitMQ(
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ())
)

describe('EVENT BUS', () => {
    before(() => {
        eventBus.receiveFromYourself = true
    })

    after(async () => {
        try {
            await eventBus.dispose()
        } catch (err) {
            throw new Error('Failure on EventBus test: ' + err.message)
        }
    })

    describe('CONNECTION', () => {
        it('should return throw an error when trying to publish up without connection.', async () => {
            return eventBus
                .publish(new GenericUserEventMock(new Date(), new User()), GenericUserEventMock.ROUTING_KEY)
                .catch(err => {
                    expect(err).to.have.property('message', 'No connection open!')
                })
        })

        it('should return throw an error when trying to subscribe up without connection.', () => {
            return eventBus
                .subscribe(
                    new GenericUserEventMock(),
                    new GenericUserEventHandlerMock(),
                    GenericUserEventMock.ROUTING_KEY
                )
                .catch(err => {
                    expect(err).to.have.property('message', 'No connection open!')
                })
        })

        it('should connect successfully to publish.', async () => {
            try {
                await eventBus.connectionPub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })
                expect(eventBus.connectionPub.isOpen).to.eql(true)
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }

        })

        it('should connect successfully to subscribe.', async () => {
            try {
                await eventBus.connectionSub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })
                expect(eventBus.connectionSub.isOpen).to.eql(true)
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })
    })

    describe('SUBSCRIBE', () => {
        it('should return true to subscribe in TestOneEvent', async () => {
            try {
                await eventBus.connectionSub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus
                    .subscribe(createEventFake('TestOneEvent'), createHandlerEventFake(),
                        'tests.one')
                    .then(result => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })

        it('should return true to subscribe in TestTwoEvent', async () => {
            try {
                await eventBus.connectionSub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus
                    .subscribe(createEventFake('TestTwoEvent'), createHandlerEventFake(),
                        'tests.two')
                    .then(result => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })
    })

    describe('PUBLISH', () => {
        it('should return true for published TestOneEvent.', async () => {
            try {
                await eventBus.connectionPub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus.publish(
                    createEventFake('TestOneEvent'),
                    'test.save')
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })

        it('should return true for published TestTwoEvent.', async () => {
            try {
                await eventBus.connectionPub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus.publish(
                    createEventFake('TestTwoEvent'),
                    'test.two')
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })
    })

    describe('RPC', () => {
        it('should return true when initializing a resource provider.', async () => {
            try {
                await eventBus.connectionRpcServer.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus
                    .provideResource('resource.get', (query: string) => {
                        return { content: '123', original_query: query }
                    })
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })
    })
})

class TestEvent extends IntegrationEvent<any> {
    constructor(public event_name: string, public timestamp?: Date, public test?: any) {
        super(event_name, 'test', timestamp)
    }

    public toJSON(): any {
        if (!this.test) return {}
        return {
            ...super.toJSON(),
            ...{ test: this.test }
        }
    }
}

function createEventFake(name: string, item?: any): IntegrationEvent<any> {
    return new TestEvent(name, new Date(), item)
}

function createHandlerEventFake(): IIntegrationEventHandler<any> {
    return {
        handle(event: any): void {
            // not implemented
        }
    }
}
