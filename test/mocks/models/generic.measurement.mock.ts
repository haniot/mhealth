import { IJSONSerializable } from '../../../src/application/domain/utils/json.serializable.interface'
import { IJSONDeserializable } from '../../../src/application/domain/utils/json.deserializable.interface'
import { BodyFat } from '../../../src/application/domain/model/body.fat'
import { JsonUtils } from '../../../src/application/domain/utils/json.utils'
import { Measurement } from '../../../src/application/domain/model/measurement'

export class GenericMeasurementMock extends Measurement implements IJSONSerializable, IJSONDeserializable<GenericMeasurementMock> {
    private _value?: number
    private _timestamp?: string
    private _meal?: string
    private _systolic?: number
    private _diastolic?: number
    private _pulse?: number
    private _body_fat?: BodyFat

    constructor() {
        super()
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

    get meal(): string | undefined {
        return this._meal
    }

    set meal(value: string | undefined) {
        this._meal = value
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

    get body_fat(): BodyFat | undefined {
        return this._body_fat
    }

    set body_fat(value: BodyFat | undefined) {
        this._body_fat = value
    }

    public fromJSON(json: any): GenericMeasurementMock {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        super.fromJSON(json)
        if (json.value !== undefined) this.value = json.value
        if (json.systolic !== undefined) this.systolic = json.systolic
        if (json.diastolic !== undefined) this.diastolic = json.diastolic
        if (json.pulse !== undefined) this.pulse = json.pulse
        if (json.meal !== undefined) this.meal = json.meal
        if (json.timestamp !== undefined) this.timestamp = json.timestamp
        if (json.body_fat !== undefined) this.body_fat = new BodyFat().fromJSON(json.body_fat)
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            value: this.value,
            systolic: this.systolic,
            diastolic: this.diastolic,
            pulse: this.pulse,
            meal: this.meal,
            timestamp: this.timestamp,
            body_fat: this.body_fat
        }
    }

}
