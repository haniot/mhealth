import HttpStatus from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { IMeasurementService } from '../port/measurement.service.interface'
import { Identifier } from '../../di/identifiers'
import { IMeasurementRepository } from '../port/measurement.repository.interface'
import { Measurement } from '../domain/model/measurement'
import { IQuery } from '../port/query.interface'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { CreateMeasurementValidator } from '../domain/validator/create.measurement.validator'
import { IDeviceRepository } from '../port/device.repository.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { StatusSuccess } from '../domain/model/status.success'
import { ConflictException } from '../domain/exception/conflict.exception'
import { MultiStatus } from '../domain/model/multi.status'
import { StatusError } from '../domain/model/status.error'
import { Strings } from '../../utils/strings'

@injectable()
export class MeasurementService implements IMeasurementService {
    constructor(
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _repository: IMeasurementRepository,
        @inject(Identifier.DEVICE_REPOSITORY) private readonly _deviceRepository: IDeviceRepository
    ) {
    }

    public async add(item: any | Array<any>): Promise<any> {
        if (item instanceof Array) return await this.addMultipleMeasurements(item)
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
        return await this._repository.create(item)
    }

    public async getAll(query: IQuery): Promise<Array<any>> {
        try {
            const user_id = query.toJSON().filters.user_id
            if (user_id) ObjectIdValidator.validate(user_id)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.find(query)
    }

    public async getById(id: string, query: IQuery): Promise<any> {
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
        throw Error('Not implemented!')
    }

    private async addMultipleMeasurements(measurements: Array<Measurement>): Promise<MultiStatus<Measurement>> {
        const multiStatus: MultiStatus<Measurement> = new MultiStatus<Measurement>()
        const statusSuccessArr: Array<StatusSuccess<Measurement>> = new Array<StatusSuccess<Measurement>>()
        const statusErrorArr: Array<StatusError<Measurement>> = new Array<StatusError<Measurement>>()

        for (const elem of measurements) {
            try {
                CreateMeasurementValidator.validate(elem)
                if (elem.device_id) {
                    const result = await this._deviceRepository.checkExists(elem.device_id)
                    if (!result) {
                        return Promise.reject(new ValidationException(Strings.DEVICE.NOT_FOUND, Strings.DEVICE.NOT_FOUND_DESC))
                    }
                }
                const measurement: Measurement = await this._repository.create(elem)
                if (measurement) {
                    const statusSuccess: StatusSuccess<Measurement> = new StatusSuccess<Measurement>(HttpStatus.CREATED, elem)
                    statusSuccessArr.push(statusSuccess)
                }
            } catch (err) {
                let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
                if (err instanceof ValidationException) statusCode = HttpStatus.BAD_REQUEST
                if (err instanceof ConflictException) statusCode = HttpStatus.CONFLICT

                const statusError: StatusError<Measurement> = new StatusError<Measurement>(statusCode, err.message,
                    err.description, elem)
                statusErrorArr.push(statusError)
            }
        }

        multiStatus.success = statusSuccessArr
        multiStatus.error = statusErrorArr

        return Promise.resolve(multiStatus)
    }
}
