import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { Device } from '../../../application/domain/model/device'
import { DeviceEntity } from '../device.entity'

@injectable()
export class DeviceEntityMapper implements IEntityMapper<Device, DeviceEntity> {
    public transform(item: any): any {
        if (item instanceof Device) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

    public jsonToModel(json: any): Device {
        const result: Device = new Device()

        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.name !== undefined) result.name = json.name
        if (json.address !== undefined) result.address = json.address
        if (json.type !== undefined) result.type = json.type
        if (json.model_number !== undefined) result.model_number = json.model_number
        if (json.manufacturer !== undefined) result.manufacturer = json.manufacturer
        if (json.patient_id !== undefined) result.patient_id = json.patient_id
        return result
    }

    public modelEntityToModel(item: DeviceEntity): Device {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: Device): DeviceEntity {
        const result: DeviceEntity = new DeviceEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.name !== undefined) result.name = item.name
        if (item.address !== undefined) result.address = item.address
        if (item.type !== undefined) result.type = item.type
        if (item.model_number !== undefined) result.model_number = item.model_number
        if (item.manufacturer !== undefined) result.manufacturer = item.manufacturer
        if (item.patient_id !== undefined) result.patient_id = item.patient_id
        return result
    }
}
