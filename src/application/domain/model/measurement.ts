import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { MeasurementTypes } from '../utils/measurement.types'

export class Measurement extends Entity implements IJSONSerializable, IJSONDeserializable<Measurement> {
    private _unit?: string
    private _type?: MeasurementTypes
    private _device_id?: string
    private _patient_id?: string

    public constructor() {
        super()
    }

    get unit(): string | undefined {
        return this._unit
    }

    set unit(value: string | undefined) {
        this._unit = value
    }

    get type(): MeasurementTypes | undefined {
        return this._type
    }

    set type(value: MeasurementTypes | undefined) {
        this._type = value
    }

    get device_id(): string | undefined {
        return this._device_id
    }

    set device_id(value: string | undefined) {
        this._device_id = value
    }

    get patient_id(): string | undefined {
        return this._patient_id
    }

    set patient_id(value: string | undefined) {
        this._patient_id = value
    }

    public fromJSON(json: any): Measurement {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id !== undefined) super.id = json.id
        if (json.unit !== undefined) this.unit = json.unit
        if (json.type !== undefined) this.type = json.type
        if (json.device_id !== undefined) this.device_id = json.device_id
        if (json.patient_id !== undefined) this.patient_id = json.patient_id

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            unit: this.unit,
            type: this.type,
            device_id: this.device_id,
            patient_id: this.patient_id
        }
    }
}
