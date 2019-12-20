import { IDeviceRepository } from '../../../src/application/port/device.repository.interface'
import { IQuery } from '../../../src/application/port/query.interface'
import { Device } from '../../../src/application/domain/model/device'
import { DefaultEntityMock } from '../models/default.entity.mock'

const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)
device.patient_id = DefaultEntityMock.DEVICE.patient_id

export class DeviceRepositoryMock implements IDeviceRepository {
    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: Device): Promise<Device> {
        return Promise.resolve(device)
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: IQuery): Promise<Array<Device>> {
        return Promise.resolve([device])
    }

    public findOne(query: IQuery): Promise<Device> {
        return Promise.resolve(device)
    }

    public update(item: Device): Promise<Device> {
        return Promise.resolve(device)
    }

    public checkExists(item: Device): Promise<boolean> {
        if (item.address === 'D4:36:39:91:75:72' || item.address === 'invalid' || item.id !== DefaultEntityMock.DEVICE.id)
            return Promise.resolve(false)
        return Promise.resolve(true)
    }
}
