import HttpStatus from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { IMeasurementService } from '../port/measurement.service.interface'
import { Identifier } from '../../di/identifiers'
import { IMeasurementRepository } from '../port/measurement.repository.interface'
import { Measurement } from '../domain/model/measurement'
import { IQuery } from '../port/query.interface'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IDeviceRepository } from '../port/device.repository.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { StatusSuccess } from '../domain/model/status.success'
import { ConflictException } from '../domain/exception/conflict.exception'
import { MultiStatus } from '../domain/model/multi.status'
import { StatusError } from '../domain/model/status.error'
import { Strings } from '../../utils/strings'
import { MeasurementTypes } from '../domain/utils/measurement.types'
import { CreateBloodGlucoseValidator } from '../domain/validator/create.blood.glucose.validator'
import { CreateBloodPressureValidator } from '../domain/validator/create.blood.pressure.validator'
import { CreateBodyTemperatureValidator } from '../domain/validator/create.body.temperature.validator'
import { CreateHeightValidator } from '../domain/validator/create.height.validator'
import { CreateWaistCircumferenceValidator } from '../domain/validator/create.waist.circumference.validator'
import { CreateWeightValidator } from '../domain/validator/create.weight.validator'
import { Query } from '../../infrastructure/repository/query/query'
import { CreateBodyFatValidator } from '../domain/validator/create.body.fat.validator'
import { Device } from '../domain/model/device'
import { LastMeasurements } from '../domain/model/last.measurements'

@injectable()
export class MeasurementService implements IMeasurementService {
    constructor(
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _repository: IMeasurementRepository,
        @inject(Identifier.DEVICE_REPOSITORY) private readonly _deviceRepository: IDeviceRepository
    ) {
    }

    public async addMeasurement(item: any | Array<any>): Promise<any> {
        if (item instanceof Array) return await this.addMultipleMeasurements(item)
        return await this.add(item)
    }

    public async getAll(query: Query): Promise<Array<any>> {
        try {
            const patient_id = query.toJSON().filters.patient_id
            if (patient_id) ObjectIdValidator.validate(patient_id)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._repository.find(query)
    }

    public async getById(id: string, query: IQuery): Promise<any> {
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

    public async add(item: any): Promise<any> {
        try {

            if (item.device_id) {
                const device: Device = new Device().fromJSON({ id: item.device_id })
                const result = await this._deviceRepository.checkExists(device)
                if (!result) throw new ValidationException(Strings.DEVICE.NOT_FOUND, Strings.DEVICE.NOT_FOUND_DESC)
                if (item.patient_id && item.timestamp) {
                    const measurementExists = await this._repository.checkExists(item)
                    if (measurementExists) {
                        throw new ConflictException(
                            'Measurement already registered!',
                            `A ${item.type} measurement with value ${item.value}${item.unit} from ` +
                            ` ${item.patient_id} collected by device ${item.device_id} at ${item.timestamp} already ` +
                            `exists.`)
                    }
                }
            }
            switch (item.type) {
                case(MeasurementTypes.BLOOD_GLUCOSE):
                    CreateBloodGlucoseValidator.validate(item)
                    break
                case(MeasurementTypes.BLOOD_PRESSURE):
                    CreateBloodPressureValidator.validate(item)
                    break
                case(MeasurementTypes.BODY_TEMPERATURE):
                    CreateBodyTemperatureValidator.validate(item)
                    break
                case(MeasurementTypes.HEIGHT):
                    CreateHeightValidator.validate(item)
                    break
                case(MeasurementTypes.WAIST_CIRCUMFERENCE):
                    CreateWaistCircumferenceValidator.validate(item)
                    break
                case(MeasurementTypes.WEIGHT):
                    CreateWeightValidator.validate(item)
                    break
                case(MeasurementTypes.BODY_FAT):
                    CreateBodyFatValidator.validate(item)
                    break
                default:
                    throw new ValidationException(
                        Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`type: ${item.type}`),
                        Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                            .concat(Object.values(MeasurementTypes).join(', ').concat('.')))
            }
            return await this._repository.create(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(query: IQuery): Promise<number> {
        return this._repository.count(query)
    }

    public async getLastMeasurements(patientId: string): Promise<LastMeasurements> {
        const result: LastMeasurements = new LastMeasurements()
        try {
            result.blood_glucose = await this._repository.getLastMeasurement(patientId, MeasurementTypes.BLOOD_GLUCOSE)
            result.blood_pressure = await this._repository.getLastMeasurement(patientId, MeasurementTypes.BLOOD_PRESSURE)
            result.body_fat = await this._repository.getLastMeasurement(patientId, MeasurementTypes.BODY_FAT)
            result.body_temperature =
                await this._repository.getLastMeasurement(patientId, MeasurementTypes.BODY_TEMPERATURE)
            result.height = await this._repository.getLastMeasurement(patientId, MeasurementTypes.HEIGHT)
            result.waist_circumference =
                await this._repository.getLastMeasurement(patientId, MeasurementTypes.WAIST_CIRCUMFERENCE)
            result.weight = await this._repository.getLastMeasurement(patientId, MeasurementTypes.WEIGHT)
        } catch (err) {
            return Promise.reject(err)
        }
        return Promise.resolve(result)
    }

    private async addMultipleMeasurements(measurements: Array<any>): Promise<MultiStatus<any>> {
        const multiStatus: MultiStatus<any> = new MultiStatus<any>()
        const statusSuccessArr: Array<StatusSuccess<any>> = new Array<StatusSuccess<any>>()
        const statusErrorArr: Array<StatusError<any>> = new Array<StatusError<any>>()

        for (const elem of measurements) {
            try {
                const measurement: any = await this.add(elem)
                if (measurement) {
                    const statusSuccess: StatusSuccess<any> = new StatusSuccess<any>(HttpStatus.CREATED, elem)
                    statusSuccessArr.push(statusSuccess)
                }
            } catch (err) {
                let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
                if (err instanceof ValidationException) statusCode = HttpStatus.BAD_REQUEST
                if (err instanceof ConflictException) statusCode = HttpStatus.CONFLICT

                const statusError: StatusError<any> = new StatusError<any>(statusCode, err.message,
                    err.description, elem)
                statusErrorArr.push(statusError)
            }
        }
        multiStatus.success = statusSuccessArr
        multiStatus.error = statusErrorArr

        return Promise.resolve(multiStatus)
    }
}
