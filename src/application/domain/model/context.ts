import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class Context implements IJSONSerializable, IJSONDeserializable<Context> {
    private _value?: number
    private _type?: string

    get value(): number | undefined {
        return this._value
    }

    set value(value: number | undefined) {
        this._value = value
    }

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    public fromJSON(json: any): Context {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.value !== undefined) this.value = json.value
        if (json.type !== undefined) this.type = json.type
        return this
    }

    public toJSON(): any {
        return {
            value: this.value,
            type: this.type
        }
    }
}
