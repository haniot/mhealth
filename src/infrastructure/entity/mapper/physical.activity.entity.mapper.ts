import { injectable } from 'inversify'
import { PhysicalActivity } from '../../../application/domain/model/physical.activity'
import { PhysicalActivityEntity } from '../physical.activity.entity'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { ActivityLevel } from '../../../application/domain/model/activityLevel'
import { HeartRateZone } from '../../../application/domain/model/heart.rate.zone'

@injectable()
export class PhysicalActivityEntityMapper implements IEntityMapper<PhysicalActivity, PhysicalActivityEntity> {

    public transform(item: any): any {
        if (item instanceof PhysicalActivity) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert JSON for PhysicalActivity.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): PhysicalActivity {
        const result: PhysicalActivity = new PhysicalActivity()

        if (!json) return result
        if (json.id !== undefined) result.id = json.id
        if (json.start_time !== undefined) result.start_time = json.start_time
        if (json.end_time !== undefined) result.end_time = json.end_time
        if (json.duration !== undefined) result.duration = json.duration
        if (json.name !== undefined) result.name = json.name
        if (json.calories !== undefined) result.calories = json.calories
        if (json.steps !== undefined) result.steps = json.steps
        if (json.distance !== undefined) result.distance = json.distance
        if (json.patient_id !== undefined) result.patient_id = json.patient_id
        if (json.levels !== undefined && json.levels.length > 0) {
            result.levels = json.levels.map(elem => new ActivityLevel().fromJSON(elem))
        }
        if (json.calories_link !== undefined) result.calories_link = json.calories_link
        if (json.heart_rate_link !== undefined) result.heart_rate_link = json.heart_rate_link
        if (json.heart_rate_average !== undefined) result.heart_rate_average = json.heart_rate_average
        if (json.heart_rate_zones !== undefined) result.heart_rate_zones = new HeartRateZone().fromJSON(json.heart_rate_zones)

        return result
    }

    public modelEntityToModel(item: PhysicalActivityEntity): PhysicalActivity {
        throw Error('Not implemented!')
    }

    /**
     * Convert {PhysicalActivity} for {PhysicalActivityEntity}.
     *
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: PhysicalActivity): PhysicalActivityEntity {
        const result: PhysicalActivityEntity = new PhysicalActivityEntity()

        if (item.id) result.id = item.id
        if (item.start_time) result.start_time = item.start_time
        if (item.end_time) result.end_time = item.end_time
        if (item.duration) result.duration = item.duration
        if (item.patient_id) result.patient_id = item.patient_id
        if (item.name) result.name = item.name
        if (item.calories !== undefined) result.calories = item.calories
        if (item.steps !== undefined) result.steps = item.steps
        if (item.distance !== undefined) result.distance = item.distance
        if (item.levels !== undefined && item.levels.length > 0) {
            result.levels = item.levels.map((elem: ActivityLevel) => elem.toJSON())
        } else result.levels = []
        if (item.calories_link !== undefined) result.calories_link = item.calories_link
        if (item.heart_rate_link !== undefined) result.heart_rate_link = item.heart_rate_link
        if (item.heart_rate_average !== undefined) result.heart_rate_average = item.heart_rate_average
        if (item.heart_rate_zones !== undefined) result.heart_rate_zones = item.heart_rate_zones.toJSON()

        return result
    }
}
