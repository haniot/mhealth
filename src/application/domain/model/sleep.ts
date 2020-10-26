import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Activity } from './activity'
import { SleepPattern } from './sleep.pattern'
import { SleepType } from '../utils/sleep.type'
import { SleepNightAwakening } from './sleep.night.awakening'

/**
 * Implementation of the sleep entity.
 *
 * @extends {Activity}
 * @implements {IJSONSerializable, IJSONDeserializable<Sleep>}
 */
export class Sleep extends Activity implements IJSONSerializable, IJSONDeserializable<Sleep> {
    private _pattern?: SleepPattern // Sleep Pattern tracking.
    private _night_awakening?: Array<SleepNightAwakening> // Sleep night awakenings set.
    private _type?: SleepType // Sleep Pattern type

    constructor() {
        super()
    }

    get pattern(): SleepPattern | undefined {
        return this._pattern
    }

    set pattern(value: SleepPattern | undefined) {
        this._pattern = value
    }

    get night_awakening(): Array<SleepNightAwakening> | undefined {
        return this._night_awakening
    }

    set night_awakening(value: Array<SleepNightAwakening> | undefined) {
        this._night_awakening = value
    }

    get type(): SleepType | undefined {
        return this._type
    }

    set type(value: SleepType | undefined) {
        this._type = value
    }

    public fromJSON(json: any): Sleep {
        if (!json) return this
        super.fromJSON(json)

        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.pattern !== undefined) this.pattern = new SleepPattern().fromJSON(json.pattern)
        if (json.type !== undefined) this.type = json.type

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                type: this.type,
                pattern: this.pattern ? this.pattern.toJSON() : this.pattern,
                night_awakening: this.night_awakening?.map(item => item.toJSON())
            }
        }
    }
}
