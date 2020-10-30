import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

/**
 * The implementation of the SleepDurationSummary.
 *
 * @implements {IJSONSerializable, IJSONDeserializable<SleepDurationSummary>}
 */
export class SleepDurationSummary implements IJSONSerializable, IJSONDeserializable<SleepDurationSummary> {
    private _total!: number // Total value of all durations.

    get total(): number {
        return this._total
    }

    set total(value: number) {
        this._total = value
    }

    public fromJSON(json: any): SleepDurationSummary {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.total !== undefined) this.total = json.total

        return this
    }

    public toJSON(): any {
        return {
            total: this.total
        }
    }
}
