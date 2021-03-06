import { Measurement } from './measurement'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { MeasurementTypes } from '../utils/measurement.types'
import { JsonUtils } from '../utils/json.utils'

export class BloodPressure extends Measurement implements IJSONSerializable, IJSONDeserializable<BloodPressure> {
    private _systolic?: number
    private _diastolic?: number
    private _pulse?: number

    constructor() {
        super()
        super.type = MeasurementTypes.BLOOD_PRESSURE
    }

    get systolic(): number | undefined {
        return this._systolic
    }

    set systolic(value: number | undefined) {
        this._systolic = value
    }

    get diastolic(): number | undefined {
        return this._diastolic
    }

    set diastolic(value: number | undefined) {
        this._diastolic = value
    }

    get pulse(): number | undefined {
        return this._pulse
    }

    set pulse(value: number | undefined) {
        this._pulse = value
    }

    public fromJSON(json: any): BloodPressure {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        super.fromJSON(json)
        if (this.value) this.value = undefined
        if (json.systolic !== undefined) this.systolic = json.systolic
        if (json.diastolic !== undefined) this.diastolic = json.diastolic
        if (json.pulse !== undefined) this.pulse = json.pulse

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                systolic: this.systolic,
                diastolic: this.diastolic,
                pulse: this.pulse,
            }
        }
    }
}
