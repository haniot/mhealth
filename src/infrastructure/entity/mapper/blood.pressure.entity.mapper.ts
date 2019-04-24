import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { BloodPressure } from '../../../application/domain/model/blood.pressure'
import { BloodPressureEntity } from '../blood.pressure.entity'

@injectable()
export class BloodPressureEntityMapper implements IEntityMapper<BloodPressure, BloodPressureEntity> {
    public jsonToModel(json: any): BloodPressure {
        const result: BloodPressure = new BloodPressure()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.systolic !== undefined) result.systolic = json.systolic
        if (json.diastolic !== undefined) result.diastolic = json.diastolic
        if (json.pulse !== undefined) result.pulse = json.pulse
        if (json.unit !== undefined) result.unit = json.unit
        if (json.type !== undefined) result.type = json.type
        if (json.timestamp !== undefined) result.timestamp = json.timestamp
        if (json.device_id !== undefined) result.device_id = json.device_id
        if (json.user_id !== undefined) result.user_id = json.user_id
        return result
    }

    public modelEntityToModel(item: BloodPressureEntity): BloodPressure {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: BloodPressure): BloodPressureEntity {
        const result: BloodPressureEntity = new BloodPressureEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.systolic !== undefined) result.systolic = item.systolic
        if (item.diastolic !== undefined) result.diastolic = item.diastolic
        if (item.pulse !== undefined) result.pulse = item.pulse
        if (item.unit !== undefined) result.unit = item.unit
        if (item.type !== undefined) result.type = item.type
        if (item.timestamp !== undefined) result.timestamp = item.timestamp
        if (item.device_id !== undefined) result.device_id = item.device_id
        if (item.user_id !== undefined) result.user_id = item.user_id
        return result
    }

    public transform(item: any): any {
        if (item instanceof BloodPressure) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }
}
