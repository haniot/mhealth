import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { BloodGlucose } from './blood.glucose'
import { BloodPressure } from './blood.pressure'
import { BodyFat } from './body.fat'
import { WaistCircumference } from './waist.circumference'
import { Weight } from './weight'
import { BodyTemperature } from './body.temperature'
import { Height } from './height'
import { HandGrip } from './hand.grip'
import { CalfCircumference } from './calf.circumference'

export class LastMeasurements extends Entity implements IJSONSerializable, IJSONDeserializable<LastMeasurements> {

    private _blood_glucose?: BloodGlucose
    private _blood_pressure?: BloodPressure
    private _body_fat?: BodyFat
    private _body_temperature?: BodyTemperature
    private _height?: Height
    private _waist_circumference?: WaistCircumference
    private _weight?: Weight
    private _hand_grip?: HandGrip
    private _calf_circumference?: CalfCircumference

    constructor() {
        super()
    }

    get blood_glucose(): BloodGlucose | undefined {
        return this._blood_glucose
    }

    set blood_glucose(value: BloodGlucose | undefined) {
        this._blood_glucose = value
    }

    get blood_pressure(): BloodPressure | undefined {
        return this._blood_pressure
    }

    set blood_pressure(value: BloodPressure | undefined) {
        this._blood_pressure = value
    }

    get body_fat(): BodyFat | undefined {
        return this._body_fat
    }

    set body_fat(value: BodyFat | undefined) {
        this._body_fat = value
    }

    get body_temperature(): BodyTemperature | undefined {
        return this._body_temperature
    }

    set body_temperature(value: BodyTemperature | undefined) {
        this._body_temperature = value
    }

    get height(): Height | undefined {
        return this._height
    }

    set height(value: Height | undefined) {
        this._height = value
    }

    get waist_circumference(): WaistCircumference | undefined {
        return this._waist_circumference
    }

    set waist_circumference(value: WaistCircumference | undefined) {
        this._waist_circumference = value
    }

    get weight(): Weight | undefined {
        return this._weight
    }

    set weight(value: Weight | undefined) {
        this._weight = value
    }

    get hand_grip(): HandGrip | undefined {
        return this._hand_grip
    }

    set hand_grip(value: HandGrip | undefined) {
        this._hand_grip = value
    }

    get calf_circumference(): CalfCircumference | undefined {
        return this._calf_circumference
    }

    set calf_circumference(value: CalfCircumference | undefined) {
        this._calf_circumference = value
    }

    public fromJSON(json: any): LastMeasurements {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        if (json.blood_glucose !== undefined) this.blood_glucose = new BloodGlucose().fromJSON(json.blood_glucose)
        if (json.blood_pressure !== undefined) this.blood_pressure = new BloodPressure().fromJSON(json.blood_pressure)
        if (json.body_fat !== undefined) this.body_fat = new BodyFat().fromJSON(json.body_fat)
        if (json.body_temperature !== undefined) this.body_temperature = new BodyTemperature().fromJSON(json.body_temperature)
        if (json.height !== undefined) this.height = new Height().fromJSON(json.height)
        if (json.waist_circumference !== undefined)
            this.waist_circumference = new WaistCircumference().fromJSON(json.waist_circumference)
        if (json.weight !== undefined) this.weight = new Weight().fromJSON(json.weight)
        if (json.hand_grip !== undefined) this.hand_grip = new HandGrip().fromJSON(json.hand_grip)
        if (json.calf_circumference !== undefined)
            this.calf_circumference = new CalfCircumference().fromJSON(json.calf_circumference)
        return this
    }

    public toJSON(): any {
        return {
            blood_glucose: this.blood_glucose ? this.blood_glucose.toJSON() : {},
            blood_pressure: this.blood_pressure ? this.blood_pressure.toJSON() : {},
            body_fat: this.body_fat ? this.body_fat.toJSON() : {},
            body_temperature: this.body_temperature ? this.body_temperature.toJSON() : {},
            height: this.height ? this.height.toJSON() : {},
            waist_circumference: this.waist_circumference ? this.waist_circumference.toJSON() : {},
            weight: this.weight ? this.weight.toJSON() : {},
            hand_grip: this.hand_grip ? this.hand_grip.toJSON() : {},
            calf_circumference: this.calf_circumference ? this.calf_circumference.toJSON() : {}
        }
    }
}
