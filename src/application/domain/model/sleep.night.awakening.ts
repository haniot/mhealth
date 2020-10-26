import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

/**
 * The implementation of the night awakening set entity present in the sleep.
 *
 * @implements {IJSONSerializable, IJSONDeserializable<SleepNightAwakening>}
 */
export class SleepNightAwakening implements IJSONSerializable, IJSONDeserializable<SleepNightAwakening> {
    private _start_time!: string // Night awakening start time.
    private _end_time!: string // Night awakening end time.
    private _steps!: number // Total night awakening steps.

    get start_time(): string {
        return this._start_time
    }

    set start_time(value: string) {
        this._start_time = value
    }

    get end_time(): string {
        return this._end_time
    }

    set end_time(value: string) {
        this._end_time = value
    }

    get steps(): number {
        return this._steps
    }

    set steps(value: number) {
        this._steps = value
    }

    public fromJSON(json: any): SleepNightAwakening {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.start_time !== undefined) this.start_time = json.start_time
        if (json.end_time !== undefined) this.end_time = json.end_time
        if (json.steps !== undefined) this.steps = json.steps

        return this
    }

    public toJSON(): any {
        return {
            start_time: this.start_time,
            end_time: this.end_time,
            steps: this.steps
        }
    }
}
