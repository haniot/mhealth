import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { CalfCircumference } from '../../../application/domain/model/calf.circumference'
import { CalfCircumferenceEntity } from '../calf.circumference.entity'

@injectable()
export class CalfCircumferenceEntityMapper implements IEntityMapper<CalfCircumference, CalfCircumferenceEntity> {
    public jsonToModel(json: any): CalfCircumference {
        const result: CalfCircumference = new CalfCircumference()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.value !== undefined) result.value = json.value
        if (json.unit !== undefined) result.unit = json.unit
        if (json.type !== undefined) result.type = json.type
        if (json.timestamp !== undefined) result.timestamp = json.timestamp
        if (json.device_id !== undefined) result.device_id = json.device_id
        if (json.patient_id !== undefined) result.patient_id = json.patient_id
        if (json.leg !== undefined) result.leg = json.leg
        return result
    }

    public modelEntityToModel(item: CalfCircumferenceEntity): CalfCircumference {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: CalfCircumference): CalfCircumferenceEntity {
        const result: CalfCircumferenceEntity = new CalfCircumferenceEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.value !== undefined) result.value = item.value
        if (item.unit !== undefined) result.unit = item.unit
        if (item.type !== undefined) result.type = item.type
        if (item.timestamp !== undefined) result.timestamp = item.timestamp
        if (item.device_id !== undefined) result.device_id = item.device_id
        if (item.patient_id !== undefined) result.patient_id = item.patient_id
        if (item.leg !== undefined) result.leg = item.leg
        return result
    }

    public transform(item: any): any {
        if (item instanceof CalfCircumference) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }
}
