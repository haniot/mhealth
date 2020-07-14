import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { ActivityLevel } from './activityLevel'
import { Activity } from './activity'
import { HeartRateZone } from './heart.rate.zone'

/**
 * Implementation of the physical physicalactivity entity.
 *
 * @extends {Entity}
 * @implements { IJSONSerializable, IJSONDeserializable<Activity>
 */
export class PhysicalActivity extends Activity implements IJSONSerializable, IJSONDeserializable<PhysicalActivity> {
    private _name?: string // Name of physical activity.
    private _calories?: number // Calories spent during physical activity.
    private _steps?: number // Number of steps taken during the physical activity.
    private _distance?: number // Distance traveled during the physical activity.
    private _levels?: Array<ActivityLevel> // PhysicalActivity levels (sedentary, light, fair or very).
    private _heart_rate_average?: number // Average heart rate
    private _heart_rate_zones?: HeartRateZone // PhysicalActivity heart rate zones

    constructor() {
        super()
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value && typeof value === 'string' ? value.trim() : value
    }

    get calories(): number | undefined {
        return this._calories
    }

    set calories(value: number | undefined) {
        this._calories = value
    }

    get steps(): number | undefined {
        return this._steps
    }

    set steps(value: number | undefined) {
        this._steps = value
    }

    get distance(): number | undefined {
        return this._distance
    }

    set distance(value: number | undefined) {
        this._distance = value
    }

    get levels(): Array<ActivityLevel> | undefined {
        return this._levels
    }

    set levels(value: Array<ActivityLevel> | undefined) {
        this._levels = value
    }

    get heart_rate_average(): number | undefined{
        return this._heart_rate_average
    }

    set heart_rate_average(value: number | undefined) {
        this._heart_rate_average = value
    }

    get heart_rate_zones(): HeartRateZone | undefined {
        return this._heart_rate_zones
    }

    set heart_rate_zones(value: HeartRateZone | undefined) {
        this._heart_rate_zones = value
    }

    public fromJSON(json: any): PhysicalActivity {
        if (!json) return this
        super.fromJSON(json)

        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.name !== undefined) this.name = json.name
        if (json.calories !== undefined) this.calories = json.calories
        if (json.steps !== undefined) this.steps = json.steps
        if (json.distance !== undefined) this.distance = json.distance
        if (json.levels !== undefined && json.levels instanceof Array) {
            this.levels = json.levels.map(level => new ActivityLevel().fromJSON(level))
        }
        if (json.heart_rate_average !== undefined) this.heart_rate_average = json.heart_rate_average
        if (json.heart_rate_zones !== undefined) this.heart_rate_zones = new HeartRateZone().fromJSON(json.heart_rate_zones)

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                name: this.name,
                calories: this.calories,
                steps: this.steps,
                distance: this.distance,
                levels: this.levels ? this.levels.map(item => item.toJSON()) : this.levels,
                heart_rate_average: this.heart_rate_average,
                heart_rate_zones: this.heart_rate_average && this.heart_rate_zones ? this.heart_rate_zones.toJSON()
                    : undefined,
            }
        }
    }
}
