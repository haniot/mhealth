import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

/**
 * The implementation of the SleepDurationItem.
 *
 * @implements {IJSONSerializable, IJSONDeserializable<SleepDurationItem>}
 */
export class SleepDurationItem implements IJSONSerializable, IJSONDeserializable<SleepDurationItem> {
    private _date!: number // Date in the format yyyy-MM-dd.
    private _value!: number // Total duration of day's sleep.

    get date(): number {
        return this._date
    }

    set date(value: number) {
        this._date = value
    }

    get value(): number {
        return this._value
    }

    set value(value: number) {
        this._value = value
    }

    public fromJSON(json: any): SleepDurationItem {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.date !== undefined) this.date = json.date
        if (json.value !== undefined) this.value = json.value

        return this
    }

    public toJSON(): any {
        return {
            date: this.date,
            value: this.value
        }
    }
}
