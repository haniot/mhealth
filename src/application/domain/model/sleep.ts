import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Activity } from './activity'
import { SleepPattern } from './sleep.pattern'
import { SleepType } from '../utils/sleep.type'
import { SleepAwakening } from './sleep.awakening'

/**
 * Implementation of the sleep entity.
 *
 * @extends {Activity}
 * @implements {IJSONSerializable, IJSONDeserializable<Sleep>}
 */
export class Sleep extends Activity implements IJSONSerializable, IJSONDeserializable<Sleep> {
    private _pattern?: SleepPattern // Sleep Pattern tracking.
    private _awakenings?: Array<SleepAwakening> // Sleep awakenings set.
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

    get awakenings(): Array<SleepAwakening> | undefined {
        return this._awakenings
    }

    set awakenings(value: Array<SleepAwakening> | undefined) {
        this._awakenings = value
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
                awakenings: this.awakenings?.map(item => item.toJSON())
            }
        }
    }
}
