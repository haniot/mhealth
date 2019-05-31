import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

/**
 * Implementation of a class to represent the 'success' item of a MultiStatus
 *
 * @implements {IJSONSerializable, IJSONDeserializable}
 * @template T
 */
export class StatusSuccess<T> implements IJSONSerializable, IJSONDeserializable<StatusSuccess<T>> {
    private _code!: number
    private _item!: T

    constructor(code?: number, item?: T) {
        if (code) this.code = code
        if (item) this.item = item
    }

    get code(): number {
        return this._code
    }

    set code(value: number) {
        this._code = value
    }

    get item(): T {
        return this._item
    }

    set item(value: T) {
        this._item = value
    }

    public fromJSON(json: any): StatusSuccess<T> {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.code !== undefined) this.code = json.code
        if (json.item !== undefined) this.item = json.item

        return this
    }

    public toJSON(): any {
        return {
            code: this.code,
            item: this.item
        }
    }

}
