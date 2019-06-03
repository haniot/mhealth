import { Measurement } from './measurement'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { MeasurementTypes } from '../utils/measurement.types'
import { Fat } from './fat'

export class Weight extends Measurement implements IJSONSerializable, IJSONDeserializable<Weight> {
    private _value?: number
    private _timestamp?: string
    private _fat?: Fat

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

    get fat(): Fat | undefined {
        return this._fat
    }

    set fat(value: Fat | undefined) {
        this._fat = value
    }

    public fromJSON(json: any): Weight {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        super.fromJSON(json)
        if (json.value !== undefined) this.value = json.value
        if (json.timestamp !== undefined) this.timestamp = json.timestamp
        if (json.fat !== undefined) this.fat = new Fat().fromJSON(json.fat)
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                value: this.value,
                timestamp: this.timestamp,
                fat: this.fat ? { value: this.fat.value, unit: this.fat.unit } : undefined
            }
        }
    }
}
