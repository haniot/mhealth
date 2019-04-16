import { Measurement } from './measurement'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { MeasurementTypes } from '../utils/measurement.types'

export class Weight extends Measurement implements IJSONSerializable, IJSONDeserializable<Weight> {
    private _value?: number
    private _timestamp?: string

    constructor() {
        super()
        super.type = MeasurementTypes.WEIGHT
    }

    get value(): number | undefined {
        return this._value
    }

    set value(value: number | undefined) {
        this._value = value
    }

    get timestamp(): string | undefined {
        return this._timestamp
    }

    set timestamp(value: string | undefined) {
        this._timestamp = value
    }

    public fromJSON(json: any): Weight {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        super.fromJSON(json)
        if (json.value !== undefined) this.value = json.value
        if (json.timestamp !== undefined) this.timestamp = json.timestamp
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                value: this.value,
                timestamp: this.timestamp
            }
        }
    }
}
