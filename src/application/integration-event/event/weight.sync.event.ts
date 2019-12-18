import { EventType, IntegrationEvent } from './integration.event'
import { Weight } from '../../domain/model/weight'

export class WeightSyncEvent extends IntegrationEvent<any> {
    public static readonly ROUTING_KEY: string = 'weights.sync'

    constructor(public timestamp?: Date, public weight?: Weight) {
        super('WeightSyncEvent', EventType.MEASUREMENT, timestamp)
    }

    public toJSON(): any {
        if (!this.weight) return {}
        return {
            ...super.toJSON(),
            weight: {
                ...this.weight.toJSON()
            }
        }
    }
}
