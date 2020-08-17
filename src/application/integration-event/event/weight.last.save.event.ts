import { EventType, IntegrationEvent } from './integration.event'
import { Weight } from '../../domain/model/weight'

export class WeightLastSaveEvent extends IntegrationEvent<Weight> {
    public static readonly ROUTING_KEY: string = 'weights.last-save'
    public static readonly NAME: string = 'WeightLastSaveEvent'

    constructor(public timestamp?: Date, public weight?: Weight) {
        super(WeightLastSaveEvent.NAME, EventType.MEASUREMENT, timestamp)
    }

    public toJSON(): any {
        if (!this.weight) return {}
        return {
            ...super.toJSON(),
            ...{
                weight: this.weight.toJSON()
            }
        }
    }
}
