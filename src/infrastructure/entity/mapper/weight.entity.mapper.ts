import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { WeightEntity } from '../weight.entity'
import { Weight } from '../../../application/domain/model/weight'

@injectable()
export class WeightEntityMapper implements IEntityMapper<Weight, WeightEntity> {
    public jsonToModel(json: any): Weight {
        const result: Weight = new Weight()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.value !== undefined) result.value = json.value
        if (json.unit !== undefined) result.unit = json.unit
        if (json.type !== undefined) result.type = json.type
        if (json.timestamp !== undefined) result.timestamp = json.timestamp
        if (json.device_id !== undefined) result.device_id = json.device_id
        if (json.patient_id !== undefined) result.patient_id = json.patient_id
        if (json.body_fat !== undefined) result.body_fat = json.body_fat
        if (json.annual_variation !== undefined) result.annual_variation = json.annual_variation
        return result
    }

    public modelEntityToModel(item: WeightEntity): Weight {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: Weight): WeightEntity {
        const result: WeightEntity = new WeightEntity()
        if (item.id !== undefined) result.id = item.id
        if (item.value !== undefined) result.value = item.value
        if (item.unit !== undefined) result.unit = item.unit
        if (item.type !== undefined) result.type = item.type
        if (item.timestamp !== undefined) result.timestamp = item.timestamp
        if (item.device_id !== undefined) result.device_id = item.device_id
        if (item.patient_id !== undefined) result.patient_id = item.patient_id
        if (item.body_fat !== undefined) result.body_fat = item.body_fat
        if (item.annual_variation !== undefined) result.annual_variation = item.annual_variation
        return result
    }

    public transform(item: any): any {
        if (item instanceof Weight) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }
}
