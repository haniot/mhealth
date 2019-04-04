import { inject, injectable } from 'inversify'
import { IDeviceService } from '../port/device.service.interface'
import { Identifier } from '../../di/identifiers'
import { IDeviceRepository } from '../port/device.repository.interface'
import { IQuery } from '../port/query.interface'
import { Device } from '../domain/model/device'

@injectable()
export class DeviceService implements IDeviceService {
    constructor(
        @inject(Identifier.DEVICE_REPOSITORY) private readonly _repository: IDeviceRepository
    ) {
    }

    public add(item: Device): Promise<Device> {
        return this._repository.create(item)
    }

    public getAll(query: IQuery): Promise<Array<Device>> {
        return this._repository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<Device> {
        query.addFilter({ _id: id })
        return this._repository.findOne(query)
    }

    public remove(id: string): Promise<boolean> {
        return this._repository.delete(id)
    }

    public update(item: Device): Promise<Device> {
        return this._repository.update(item)
    }
}
