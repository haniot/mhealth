import { Measurement } from './measurement'
import { MeasurementTypes } from '../utils/measurement.types'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class HandGrip extends Measurement implements IJSONSerializable, IJSONDeserializable<HandGrip> {
    private _hand?: string

    constructor() {
        super()
        super.type = MeasurementTypes.HAND_GRIP
    }

    get hand(): string | undefined {
        return this._hand
    }

    set hand(value: string | undefined) {
        this._hand = value
    }

    public fromJSON(json: any): HandGrip {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        super.fromJSON(json)

        if (json.hand !== undefined) this.hand = json.hand
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                hand: this.hand
            }
        }
    }
}
