import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { BodyFatEntity } from '../body.fat.entity'
import { BodyFat } from '../../../application/domain/model/body.fat'

@injectable()
export class BodyFatEntityMapper implements IEntityMapper<BodyFat, BodyFatEntity> {
    public jsonToModel(json: any): BodyFat {
        const result: BodyFat = new BodyFat()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.value !== undefined) result.value = json.value
        if (json.unit !== undefined) result.unit = json.unit
        if (json.type !== undefined) result.type = json.type
        if (json.timestamp !== undefined) result.timestamp = json.timestamp
        if (json.device_id !== undefined) result.device_id = json.device_id
        if (json.patient_id !== undefined) result.patient_id = json.patient_id
        return result
    }

    public modelEntityToModel(item: BodyFatEntity): BodyFat {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: BodyFat): BodyFatEntity {
        const result: BodyFatEntity = new BodyFatEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.value !== undefined) result.value = item.value
        if (item.unit !== undefined) result.unit = item.unit
        if (item.type !== undefined) result.type = item.type
        if (item.timestamp !== undefined) result.timestamp = item.timestamp
        if (item.device_id !== undefined) result.device_id = item.device_id
        if (item.patient_id !== undefined) result.patient_id = item.patient_id
        return result
    }

    public transform(item: any): any {
        if (item instanceof BodyFat) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }
}
