import { IIntegrationEventHandler } from '../../src/application/integration-event/handler/integration.event.handler.interface'
import { GenericUserEventMock } from './generic.user.event.mock'

export class GenericUserEventHandlerMock implements IIntegrationEventHandler<GenericUserEventMock> {
    public handle(event: GenericUserEventMock) {
        return
    }
}
