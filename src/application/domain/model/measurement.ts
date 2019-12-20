import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class Measurement extends Entity implements IJSONSerializable, IJSONDeserializable<Measurement> {
    private _value?: number
    private _unit?: string
    private _timestamp?: string
    private _type?: string
    private _device_id?: string
    private _patient_id?: string

    public constructor() {
        super()
    }

    get value(): number | undefined {
        return this._value
    }

    set value(value: number | undefined) {
        this._value = value
    }

    get unit(): string | undefined {
        return this._unit
    }

    set unit(value: string | undefined) {
        this._unit = value
    }

    get timestamp(): string | undefined {
        return this._timestamp
    }

    set timestamp(value: string | undefined) {
        this._timestamp = value
    }

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
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
        if (json.value !== undefined) this.value = json.value
        if (json.unit !== undefined) this.unit = json.unit
        if (json.timestamp !== undefined) this.timestamp = json.timestamp
        if (json.type !== undefined) this.type = json.type
        if (json.device_id !== undefined) this.device_id = json.device_id

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            value: this.value,
            unit: this.unit,
            timestamp: this.timestamp,
            type: this.type,
            device_id: this.device_id,
            patient_id: this.patient_id
        }
    }
}
