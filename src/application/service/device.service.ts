import { inject, injectable } from 'inversify'
import { IDeviceService } from '../port/device.service.interface'
import { Identifier } from '../../di/identifiers'
import { IDeviceRepository } from '../port/device.repository.interface'
import { IQuery } from '../port/query.interface'
import { Device } from '../domain/model/device'
import { CreateDeviceValidator } from '../domain/validator/create.device.validator'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { UpdateDeviceValidator } from '../domain/validator/update.device.validator'

@injectable()
export class DeviceService implements IDeviceService {
    constructor(
        @inject(Identifier.DEVICE_REPOSITORY) private readonly _repository: IDeviceRepository
    ) {
    }

    public add(item: Device): Promise<Device> {
        try {
            CreateDeviceValidator.validate(item)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.create(item)
    }

    public getAll(query: IQuery): Promise<Array<Device>> {
        try {
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<Device> {
        try {
            ObjectIdValidator.validate(id)
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
        } catch (err) {
            return Promise.reject(err)
        }
        query.addFilter({ _id: id })
        return this._repository.findOne(query)
    }

    public removeDevice(deviceId: string, userId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(deviceId)
            ObjectIdValidator.validate(userId)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.delete(deviceId)
    }

    public remove(id: string): Promise<boolean> {
        throw Error('Not implemented!')
    }

    public update(item: Device): Promise<Device> {
        UpdateDeviceValidator.validate(item)
        return this._repository.update(item)
    }
}
