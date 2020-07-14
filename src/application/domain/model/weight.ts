import { Measurement } from './measurement'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { MeasurementTypes } from '../utils/measurement.types'

export class Weight extends Measurement implements IJSONSerializable, IJSONDeserializable<Weight> {
    private _body_fat?: number
    private _bmi?: number

    constructor() {
        super()
        super.type = MeasurementTypes.WEIGHT
    }

    get body_fat(): number | undefined {
        return this._body_fat
    }

    set body_fat(value: number | undefined) {
        this._body_fat = value
    }

    get bmi(): number | undefined {
        return this._bmi
    }

    set bmi(value: number | undefined) {
        this._bmi = value
    }

    public fromJSON(json: any): Weight {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        super.fromJSON(json)
        if (json.body_fat !== undefined) this.body_fat = json.body_fat
        if (json.bmi !== undefined) this.bmi = json.bmi
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                body_fat: this.body_fat,
                bmi: this.bmi
            }
        }
    }
}
