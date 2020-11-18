import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Entity } from './entity'
import { SleepDurationSummary } from './sleep.duration.summary'
import { SleepDurationItem } from './sleep.duration.item'

/**
 * The implementation of the SleepDuration.
 *
 * @implements {IJSONSerializable, IJSONDeserializable<SleepDuration>}
 */
export class SleepDuration extends Entity implements IJSONSerializable, IJSONDeserializable<SleepDuration> {
    private _summary!: SleepDurationSummary // Summary with the sum of all durations contained in data_set property.
    private _data_set!: Array<SleepDurationItem> // Array with a patient's total sleep duration per day.

    constructor() {
        super()
    }

    get summary(): SleepDurationSummary {
        return this._summary
    }

    set summary(value: SleepDurationSummary) {
        this._summary = value
    }

    get data_set(): Array<SleepDurationItem> {
        return this._data_set
    }

    set data_set(value: Array<SleepDurationItem>) {
        this._data_set = value
    }

    public fromJSON(json: any): SleepDuration {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.summary !== undefined) this.summary = new SleepDurationSummary().fromJSON(json.summary)
        if (json.data_set instanceof Array) {
            this.data_set = json.data_set.map(sleepDurationItem => new SleepDurationItem().fromJSON(sleepDurationItem))
        }

        return this
    }

    public toJSON(): any {
        return {
            summary: this.summary?.toJSON(),
            data_set: this.data_set?.map(item => item.toJSON())
        }
    }
}
