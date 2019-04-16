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
        if (json.user_id !== undefined) result.user_id = json.user_id
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
        if (item.user_id !== undefined) result.user_id = item.user_id
        return result
    }

    public transform(item: any): any {
        if (item instanceof Weight) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }
}
