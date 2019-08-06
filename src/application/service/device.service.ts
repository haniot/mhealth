import { inject, injectable } from 'inversify'
import { IDeviceService } from '../port/device.service.interface'
import { Identifier } from '../../di/identifiers'
import { IDeviceRepository } from '../port/device.repository.interface'
import { IQuery } from '../port/query.interface'
import { Device } from '../domain/model/device'
import { CreateDeviceValidator } from '../domain/validator/create.device.validator'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { UpdateDeviceValidator } from '../domain/validator/update.device.validator'
import { ConflictException } from '../domain/exception/conflict.exception'

@injectable()
export class DeviceService implements IDeviceService {
    constructor(
        @inject(Identifier.DEVICE_REPOSITORY) private readonly _repository: IDeviceRepository
    ) {
    }

    public async add(item: Device): Promise<Device> {
        try {
            CreateDeviceValidator.validate(item)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.create(item)
    }

    public async addDevice(item: Device, userId: string): Promise<Device> {
        try {
            ObjectIdValidator.validate(userId)
            item.patient_id = userId
            const exists = await this._repository.checkExists(item)
            if (exists) throw new ConflictException('The user already has association with this device.')
        } catch (err) {
            return Promise.reject(err)
        }
        return this.add(item)
    }

    public async getAll(query: IQuery): Promise<Array<Device>> {
        try {
            const patient_id = query.toJSON().filters.patient_id
            if (patient_id) ObjectIdValidator.validate(patient_id)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.find(query)
    }

    public async getById(id: string, query: IQuery): Promise<Device> {
        try {
            ObjectIdValidator.validate(id)
            const patient_id = query.toJSON().filters.patient_id
            if (patient_id) ObjectIdValidator.validate(patient_id)
        } catch (err) {
            return Promise.reject(err)
        }
        query.addFilter({ _id: id })
        return this._repository.findOne(query)
    }

    public async removeDevice(deviceId: string, userId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(deviceId)
            ObjectIdValidator.validate(userId)
        } catch (err) {
            return Promise.reject(err)
        }
        return this.remove(deviceId)
    }

    public async remove(id: string): Promise<boolean> {
        return this._repository.delete(id)
    }

    public async update(item: Device): Promise<Device> {
        try {
            UpdateDeviceValidator.validate(item)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.update(item)
    }

    public async updateDevice(item: Device, userId: string): Promise<Device> {
        try {
            ObjectIdValidator.validate(userId)
            UpdateDeviceValidator.validate(item)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.update(item)
    }

    public count(query: IQuery): Promise<number> {
        return this._repository.count(query)
    }
}
