import { inject, injectable } from 'inversify'
import { IMeasurementService } from '../port/measurement.service.interface'
import { Identifier } from '../../di/identifiers'
import { IMeasurementRepository } from '../port/measurement.repository.interface'
import { Measurement } from '../domain/model/measurement'
import { IQuery } from '../port/query.interface'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { CreateMeasurementValidator } from '../domain/validator/create.measurement.validator'
import { UpdateMeasurementValidator } from '../domain/validator/update.measurement.validator'
import { IDeviceRepository } from '../port/device.repository.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { Strings } from '../../utils/strings'

@injectable()
export class MeasurementService implements IMeasurementService {
    constructor(
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _repository: IMeasurementRepository,
        @inject(Identifier.DEVICE_REPOSITORY) private readonly _deviceRepository: IDeviceRepository
    ) {
    }

    public async add(item: Measurement): Promise<Measurement> {
        try {
            CreateMeasurementValidator.validate(item)
            if (item.device_id) {
                const result = await this._deviceRepository.checkExists(item.device_id)
                if (!result) {
                    return Promise.reject(new ValidationException(Strings.DEVICE.NOT_FOUND, Strings.DEVICE.NOT_FOUND_DESC))
                }
            }
        } catch (err) {
            return Promise.reject(err)
        }

        if (item.measurements && item.measurements.length) {
            for (const measurement of item.measurements) {
                const result = await this._repository.create(measurement)
                measurement.id = result.id
            }
        }
        return await this._repository.create(item)
    }

    public async getAll(query: IQuery): Promise<Array<Measurement>> {
        try {
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.find(query)
    }

    public async getById(id: string, query: IQuery): Promise<Measurement> {
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

    public async removeMeasurement(measurementId: string, userId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(measurementId)
            ObjectIdValidator.validate(userId)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.delete(measurementId)
    }

    public async remove(id: string): Promise<boolean> {
        throw Error('Not implemented!')
    }

    public async update(item: Measurement): Promise<Measurement> {
        try {
            if (item.user_id) ObjectIdValidator.validate(item.user_id)
            item.user_id = undefined
            UpdateMeasurementValidator.validate(item)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.update(item)
    }
}
