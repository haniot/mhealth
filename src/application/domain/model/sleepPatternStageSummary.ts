import { SleepPatternSummaryData } from './sleep.pattern.summary.data'
import { IJSONSerializable } from '../utils/json.serializable.interface'

/**
 * The implementation of the summary entity of sleep pattern from 'stages' type.
 *
 * @implements {IJSONSerializable}
 */
export class SleepPatternStageSummary implements IJSONSerializable {
    private _deep!: SleepPatternSummaryData
    private _light!: SleepPatternSummaryData
    private _rem!: SleepPatternSummaryData
    private _awake!: SleepPatternSummaryData

    constructor(deep?: SleepPatternSummaryData, light?: SleepPatternSummaryData, rem?: SleepPatternSummaryData,
                awake?: SleepPatternSummaryData) {
        if (deep) this.deep = deep
        if (light) this.light = light
        if (rem) this.rem = rem
        if (awake) this.awake = awake
    }

    get deep(): SleepPatternSummaryData {
        return this._deep
    }

    set deep(value: SleepPatternSummaryData) {
        this._deep = value
    }

    get light(): SleepPatternSummaryData {
        return this._light
    }

    set light(value: SleepPatternSummaryData) {
        this._light = value
    }

    get rem(): SleepPatternSummaryData {
        return this._rem
    }

    set rem(value: SleepPatternSummaryData) {
        this._rem = value
    }

    get awake(): SleepPatternSummaryData {
        return this._awake
    }

    set awake(value: SleepPatternSummaryData) {
        this._awake = value
    }

    public toJSON(): any {
        return {
            deep: this.deep ? this.deep.toJSON() : this.deep,
            light: this.light ? this.light.toJSON() : this.light,
            rem: this.rem ? this.rem.toJSON() : this.rem,
            awake: this.awake ? this.awake.toJSON() : this.awake
        }
    }
}
