import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

/**
 * Implementation of a class to represent the 'error' item of a MultiStatus
 *
 * @implements {IJSONSerializable, IJSONDeserializable}
 * @template T
 */
export class StatusError<T> implements IJSONSerializable, IJSONDeserializable<StatusError<T>> {
    private _code!: number
    private _message!: string
    private _description!: string
    private _item!: T

    constructor(code?: number, message?: string, description?: string, item?: T) {
        if (code) this.code = code
        if (message) this.message = message
        if (description) this.description = description
        if (item) this.item = item
    }

    get code(): number {
        return this._code
    }

    set code(value: number) {
        this._code = value
    }

    get message(): string {
        return this._message
    }

    set message(value: string) {
        this._message = value
    }

    get description(): string {
        return this._description
    }

    set description(value: string) {
        this._description = value
    }

    get item(): T {
        return this._item
    }

    set item(value: T) {
        this._item = value
    }

    public fromJSON(json: any): StatusError<T> {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.code !== undefined) this.code = json.code
        if (json.message !== undefined) this.message = json.message
        if (json.description !== undefined) this.description = json.description
        if (json.item !== undefined) this.item = json.item

        return this
    }

    public toJSON(): any {
        return {
            code: this.code,
            message: this.message,
            description: this.description,
            item: this.item
        }
    }

}
