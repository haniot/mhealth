import { SleepPatternDataSet } from './sleep.pattern.data.set'
import { SleepPatternPhaseSummary } from './sleep.pattern.phase.summary'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { SleepPatternStageSummary } from './sleep.pattern.stage.summary'

/**
 * Implementation of the entity of the pattern of sleep.
 *
 * @implements {IJSONSerializable, IJSONDeserializable<SleepPattern>}
 */
export class SleepPattern implements IJSONSerializable, IJSONDeserializable<SleepPattern> {
    private _data_set!: Array<SleepPatternDataSet> // Sleep pattern tracking.
    private _summary!: SleepPatternPhaseSummary | SleepPatternStageSummary // Summary of sleep pattern.

    get data_set(): Array<SleepPatternDataSet> {
        return this._data_set
    }

    set data_set(value: Array<SleepPatternDataSet>) {
        this._data_set = value
    }

    get summary(): SleepPatternPhaseSummary | SleepPatternStageSummary {
        return this._summary
    }

    set summary(value: SleepPatternPhaseSummary | SleepPatternStageSummary) {
        this._summary = value
    }

    public fromJSON(json: any): SleepPattern {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.data_set !== undefined && json.data_set instanceof Array) {
            this.data_set = json.data_set.map(patternDataSet => new SleepPatternDataSet().fromJSON(patternDataSet))
        }

        return this
    }

    public toJSON(): any {
        return {
            data_set: this.data_set ? this.data_set.map(item => item.toJSON()) : this.data_set,
            summary: this.summary ? this.summary.toJSON() : this.summary
        }
    }
}
