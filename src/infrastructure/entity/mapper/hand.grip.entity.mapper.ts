import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { HandGrip } from '../../../application/domain/model/hand.grip'
import { HandGripEntity } from '../hand.grip.entity'

@injectable()
export class HandGripEntityMapper implements IEntityMapper<HandGrip, HandGripEntity> {
    public jsonToModel(json: any): HandGrip {
        const result: HandGrip = new HandGrip()
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

    public modelEntityToModel(item: HandGripEntity): HandGrip {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: HandGrip): HandGripEntity {
        const result: HandGripEntity = new HandGripEntity()

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
        if (item instanceof HandGrip) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }
}
