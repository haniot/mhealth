import { EventType, IntegrationEvent } from './integration.event'
import { User } from '../../domain/model/user'

export class UserDeleteEvent extends IntegrationEvent<any> {
    public static readonly ROUTING_KEY: string = 'users.delete'

    constructor(public timestamp?: Date, public user?: User) {
        super('UserDeleteEvent', EventType.USER, timestamp)
    }

    public toJSON(): any {
        if (!this.user) return {}
        return {
            ...super.toJSON(),
            user: this.user.toJSON()
        }
    }
}
