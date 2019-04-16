import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { BodyTemperature } from '../../../application/domain/model/body.temperature'
import { BodyTemperatureEntity } from '../body.temperature.entity'

@injectable()
export class BodyTemperatureEntityMapper implements IEntityMapper<BodyTemperature, BodyTemperatureEntity> {
    public jsonToModel(json: any): BodyTemperature {
        const result: BodyTemperature = new BodyTemperature()
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

    public modelEntityToModel(item: BodyTemperatureEntity): BodyTemperature {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: BodyTemperature): BodyTemperatureEntity {
        const result: BodyTemperatureEntity = new BodyTemperatureEntity()

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
        if (item instanceof BodyTemperature) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }
}
