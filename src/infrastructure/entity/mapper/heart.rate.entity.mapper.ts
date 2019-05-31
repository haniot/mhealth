import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { HeartRate } from '../../../application/domain/model/heart.rate'
import { HeartRateEntity } from '../heart.rate.entity'
import { DataSetItem } from '../../../application/domain/model/data.set.item'

@injectable()
export class HeartRateEntityMapper implements IEntityMapper<HeartRate, HeartRateEntity> {
    public jsonToModel(json: any): HeartRate {
        const result: HeartRate = new HeartRate()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.dataset !== undefined && json.dataset.length) {
            result.dataset = json.dataset.map(item => new DataSetItem().fromJSON(item))
        }
        if (json.unit !== undefined) result.unit = json.unit
        if (json.type !== undefined) result.type = json.type
        if (json.device_id !== undefined) result.device_id = json.device_id
        if (json.user_id !== undefined) result.user_id = json.user_id
        return result
    }

    public modelEntityToModel(item: HeartRateEntity): HeartRate {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: HeartRate): HeartRateEntity {
        const result: HeartRateEntity = new HeartRateEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.dataset !== undefined && item.dataset.length) {
            result.dataset = item.dataset.map(object => object.toJSON())
            result.timestamp = item.dataset.sort()[0].timestamp
        }
        if (item.unit !== undefined) result.unit = item.unit
        if (item.type !== undefined) result.type = item.type
        if (item.device_id !== undefined) result.device_id = item.device_id
        if (item.user_id !== undefined) result.user_id = item.user_id
        return result
    }

    public transform(item: any): any {
        if (item instanceof HeartRate) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }
}
