import { Measurement } from './measurement'
import { MeasurementTypes } from '../utils/measurement.types'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'

export class CalfCircumference extends Measurement implements IJSONSerializable, IJSONDeserializable<CalfCircumference> {
    private _leg?: string

    constructor() {
        super()
        super.type = MeasurementTypes.CALF_CIRCUMFERENCE
    }

    get leg(): string | undefined {
        return this._leg
    }

    set leg(value: string | undefined) {
        this._leg = value
    }

    public fromJSON(json: any): CalfCircumference {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        super.fromJSON(json)

        if (json.leg !== undefined) this.leg = json.leg
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                leg: this.leg
            }
        }
    }
}
