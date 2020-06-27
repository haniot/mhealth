import { EventType, IntegrationEvent } from './integration.event'
import { Sleep } from '../../domain/model/sleep'

export class SleepSyncEvent extends IntegrationEvent<any> {
    public static readonly ROUTING_KEY: string = 'sleep.sync'
    public static readonly NAME: string = 'SleepSyncEvent'

    constructor(public timestamp?: Date, public sleep?: Sleep | Array<Sleep>) {
        super(SleepSyncEvent.NAME, EventType.ACTIVITY, timestamp)
    }

    public toJSON(): any {
        if (!this.sleep) return {}
        return {
            ...super.toJSON(),
            sleep: this.sleep instanceof Array ? [...this.sleep.map(item => item.toJSON())] : { ...this.sleep.toJSON() }
        }
    }
}
