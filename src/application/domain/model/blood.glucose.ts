import { Measurement } from './measurement'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { MeasurementTypes } from '../utils/measurement.types'

export class BloodGlucose extends Measurement implements IJSONSerializable, IJSONDeserializable<BloodGlucose> {
    private _meal?: string

    constructor() {
        super()
        super.type = MeasurementTypes.BLOOD_GLUCOSE
    }

    get meal(): string | undefined {
        return this._meal
    }

    set meal(value: string | undefined) {
        this._meal = value
    }

    public fromJSON(json: any): BloodGlucose {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        super.fromJSON(json)
        if (json.meal !== undefined) this.meal = json.meal
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                meal: this.meal
            }
        }
    }
}
