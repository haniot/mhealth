import { IntegrationEvent } from '../../src/application/integration-event/event/integration.event'
import { User } from '../../src/application/domain/model/user'

export class GenericUserEventMock extends IntegrationEvent<User> {
    public static readonly ROUTING_KEY: string = 'generic.event'
    public static readonly NAME: string = 'GenericUserEvent'

    constructor(public timestamp?: Date, public user?: User) {
        super(GenericUserEventMock.NAME, 'generic', timestamp)
    }

    public toJSON(): any {
        if (!this.user) return {}
        return { ...super.toJSON(), ...{ user: this.user.toJSON() } }
    }
}
