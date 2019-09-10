import { Measurement } from './measurement'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { MeasurementTypes } from '../utils/measurement.types'
import { MealTypes } from '../utils/meal.types'

export class BloodGlucose extends Measurement implements IJSONSerializable, IJSONDeserializable<BloodGlucose> {
    private _value?: number
    private _timestamp?: string
    private _meal?: MealTypes

    constructor() {
        super()
        super.type = MeasurementTypes.BLOOD_GLUCOSE
    }

    get timestamp(): string | undefined {
        return this._timestamp
    }

    set timestamp(value: string | undefined) {
        this._timestamp = value
    }

    get value(): number | undefined {
        return this._value
    }

    set value(value: number | undefined) {
        this._value = value
    }

    get meal(): MealTypes | undefined {
        return this._meal
    }

    set meal(value: MealTypes | undefined) {
        this._meal = value
    }

    public fromJSON(json: any): BloodGlucose {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        super.fromJSON(json)
        if (json.value !== undefined) this.value = json.value
        if (json.timestamp !== undefined) this.timestamp = json.timestamp
        if (json.meal !== undefined) this.meal = json.meal
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                meal: this.meal,
                value: this.value,
                timestamp: this.timestamp
            }
        }
    }
}
