import { EventType, IntegrationEvent } from './integration.event'
import { PhysicalActivity } from '../../domain/model/physical.activity'

export class PhysicalActivitySyncEvent extends IntegrationEvent<any> {
    public static readonly ROUTING_KEY: string = 'physicalactivities.sync'

    constructor(public timestamp?: Date, public physical_activity?: PhysicalActivity | Array<PhysicalActivity>) {
        super('PhysicalActivitySyncEvent', EventType.ACTIVITY, timestamp)
    }

    public toJSON(): any {
        if (!this.physical_activity) return {}
        return {
            ...super.toJSON(),
            physical_activity:
                this.physical_activity instanceof Array ? [ ...this.physical_activity.map(item => item.toJSON()) ]
                    : { ...this.physical_activity.toJSON() }
        }
    }
}
