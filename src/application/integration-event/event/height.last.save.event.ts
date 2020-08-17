import { EventType, IntegrationEvent } from './integration.event'
import { Height } from '../../domain/model/height'

export class HeightLastSaveEvent extends IntegrationEvent<Height> {
    public static readonly ROUTING_KEY: string = 'heights.last-save'
    public static readonly NAME: string = 'HeightLastSaveEvent'

    constructor(public timestamp?: Date, public height?: Height) {
        super(HeightLastSaveEvent.NAME, EventType.MEASUREMENT, timestamp)
    }

    public toJSON(): any {
        if (!this.height) return {}
        return {
            ...super.toJSON(),
            ...{
                height: this.height.toJSON()
            }
        }
    }
}
