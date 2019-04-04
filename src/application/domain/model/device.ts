import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class Device extends Entity implements IJSONSerializable, IJSONDeserializable<Device> {
    private _name?: string
    private _address?: string
    private _type?: string
    private _model_number?: number
    private _manufacturer?: string
    private _user_id?: string

    public constructor() {
        super()
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value
    }

    get address(): string | undefined {
        return this._address
    }

    set address(value: string | undefined) {
        this._address = value
    }

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    get model_number(): number | undefined {
        return this._model_number
    }

    set model_number(value: number | undefined) {
        this._model_number = value
    }

    get manufacturer(): string | undefined {
        return this._manufacturer
    }

    set manufacturer(value: string | undefined) {
        this._manufacturer = value
    }

    get user_id(): string | undefined {
        return this._user_id
    }

    set user_id(value: string | undefined) {
        this._user_id = value
    }

    public fromJSON(json: any): Device {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.name !== undefined) this.name = json.name
        if (json.address !== undefined) this.address = json.address
        if (json.type !== undefined) this.type = json.type
        if (json.model_number !== undefined) this.model_number = json.model_number
        if (json.manufacturer !== undefined) this.manufacturer = json.manufacturer
        if (json.user_id !== undefined) this.user_id = json.user_id
        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            name: this.name,
            address: this.address,
            type: this.type,
            model_number: this.model_number,
            manufacturer: this.manufacturer,
            user_id: this.user_id
        }
    }
}
