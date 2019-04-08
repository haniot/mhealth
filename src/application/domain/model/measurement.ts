import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { Context } from './context'
import { JsonUtils } from '../utils/json.utils'

export class Measurement extends Entity implements IJSONSerializable, IJSONDeserializable<Measurement> {
    private _value?: number
    private _unit?: string
    private _type?: string
    private _measurements?: Array<Measurement>
    private _contexts?: Array<Context>
    private _timestamp?: string
    private _device_id?: string
    private _user_id?: string

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

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    get measurements(): Array<Measurement> | undefined {
        return this._measurements
    }

    set measurements(value: Array<Measurement> | undefined) {
        this._measurements = value
    }

    get contexts(): Array<Context> | undefined {
        return this._contexts
    }

    set contexts(value: Array<Context> | undefined) {
        this._contexts = value
    }

    get timestamp(): string | undefined {
        return this._timestamp
    }

    set timestamp(value: string | undefined) {
        this._timestamp = value
    }

    get device_id(): string | undefined {
        return this._device_id
    }

    set device_id(value: string | undefined) {
        this._device_id = value
    }

    get user_id(): string | undefined {
        return this._user_id
    }

    set user_id(value: string | undefined) {
        this._user_id = value
    }

    public fromJSON(json: any): Measurement {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.value !== undefined) this.value = json.value
        if (json.unit !== undefined) this.unit = json.unit
        if (json.type !== undefined) this.type = json.type
        if (json.measurements !== undefined && json.measurements.length) {
            this.measurements = json.measurements.map(item => new Measurement().fromJSON(item))
        }
        if (json.contexts !== undefined && json.contexts.length) {
            this.contexts = json.contexts.map(item => new Context().fromJSON(item))
        }
        if (json.timestamp !== undefined) this.timestamp = json.timestamp
        if (json.device_id !== undefined) this.device_id = json.device_id
        if (json.user_id !== undefined) this.user_id = json.user_id

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            value: this.value,
            unit: this.unit,
            type: this.type,
            measurements: this.measurements && this.measurements.length ?
                this.measurements.map(measurement => {
                    measurement.user_id = undefined
                    return measurement.toJSON()
                }) : [],
            contexts: this.contexts ? this.contexts : [],
            timestamp: this.timestamp,
            device_id: this.device_id,
            user_id: this.user_id
        }
    }
}
