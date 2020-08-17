import { SleepPatternSummaryData } from './sleep.pattern.summary.data'
import { IJSONSerializable } from '../utils/json.serializable.interface'

/**
 * The implementation of the summary entity of sleep pattern from 'classic' type.
 *
 * @implements {IJSONSerializable}
 */
export class SleepPatternPhaseSummary implements IJSONSerializable {
    private _awake!: SleepPatternSummaryData
    private _asleep!: SleepPatternSummaryData
    private _restless!: SleepPatternSummaryData

    constructor(awake?: SleepPatternSummaryData, asleep?: SleepPatternSummaryData, restless?: SleepPatternSummaryData) {
        if (awake) this.awake = awake
        if (asleep) this.asleep = asleep
        if (restless) this.restless = restless
    }

    get awake(): SleepPatternSummaryData {
        return this._awake
    }

    set awake(value: SleepPatternSummaryData) {
        this._awake = value
    }

    get asleep(): SleepPatternSummaryData {
        return this._asleep
    }

    set asleep(value: SleepPatternSummaryData) {
        this._asleep = value
    }

    get restless(): SleepPatternSummaryData {
        return this._restless
    }

    set restless(value: SleepPatternSummaryData) {
        this._restless = value
    }

    public toJSON(): any {
        return {
            awake: this.awake ? this.awake.toJSON() : this.awake,
            asleep: this.asleep ? this.asleep.toJSON() : this.asleep,
            restless: this.restless ? this.restless.toJSON() : this.restless
        }
    }
}
