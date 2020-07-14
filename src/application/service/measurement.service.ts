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
import { BodyFat } from '../domain/model/body.fat'
import { Weight } from '../domain/model/weight'
import { Height } from '../domain/model/height'
import { DateValidator } from '../domain/validator/date.validator'

@injectable()
export class MeasurementService implements IMeasurementService {
    constructor(
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _repository: IMeasurementRepository,
        @inject(Identifier.DEVICE_REPOSITORY) private readonly _deviceRepository: IDeviceRepository
    ) {
    }

    public async add(item: any | Array<any>): Promise<any> {
        if (item instanceof Array) return this.addMultipleMeasurements(item)
        return this.addMeasurement(item)
    }

    public async getAll(query: Query): Promise<Array<any>> {
        try {
            const patient_id = query.toJSON().filters.patient_id
            if (patient_id) ObjectIdValidator.validate(patient_id)
            const measurements: Array<any> = await this._repository.find(query)

            for await(let measurement of measurements) {
                if (measurement.type === MeasurementTypes.WEIGHT) {
                    measurement = await this.addBmi(measurement)
                }
            }
            return Promise.resolve(measurements)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(id: string, query: IQuery): Promise<any> {
        try {
            ObjectIdValidator.validate(id)
            const patient_id = query.toJSON().filters.patient_id
            if (patient_id) ObjectIdValidator.validate(patient_id)

            query.addFilter({ _id: id })
            let measurement: any = await this._repository.findOne(query)
            if (measurement && measurement.type === MeasurementTypes.WEIGHT) {
                measurement = await this.addBmi(measurement)
            }
            return Promise.resolve(measurement)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async removeByPatient(measurementId: string, userId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(measurementId)
            ObjectIdValidator.validate(userId)

            return this._repository.delete(measurementId)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        throw Error('Not implemented!')
    }

    public async update(item: Measurement): Promise<Measurement> {
        throw Error('Not implemented!')
    }

    private async addMeasurement(item: any): Promise<any> {
        try {
            if (item.patient_id && item.timestamp) {
                ObjectIdValidator.validate(item.patient_id)
                const measurementExists = await this._repository.checkExists(item)
                if (measurementExists) {
                    throw new ConflictException(Strings.MEASUREMENT.ALREADY_REGISTERED)
                }
            }
            if (item.device_id) {
                ObjectIdValidator.validate(item.device_id)
                const device: Device = new Device().fromJSON({ id: item.device_id })
                const result = await this._deviceRepository.checkExists(device)
                if (!result) throw new ValidationException(Strings.DEVICE.NOT_FOUND, Strings.DEVICE.NOT_FOUND_DESC)
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
            if (item.type === MeasurementTypes.WEIGHT && item.body_fat) {
                const bodyFat = new BodyFat().fromJSON({
                    ...item.toJSON(), type: MeasurementTypes.BODY_FAT,
                    value: item.body_fat, unit: '%'
                })
                bodyFat.patient_id = item.patient_id
                await this.add(bodyFat)
            }
            let measurement: any = await this._repository.create(item)
            if (measurement && measurement.type === MeasurementTypes.WEIGHT) {
                measurement = await this.addBmi(measurement)
            }
            return Promise.resolve(measurement)
        } catch (err) {
            return Promise.reject(err)
        }
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

    public count(query: IQuery): Promise<number> {
        return this._repository.count(query)
    }

    public async getLast(patientId: string): Promise<LastMeasurements> {
        const result: LastMeasurements = new LastMeasurements()
        try {
            ObjectIdValidator.validate(patientId)
            result.blood_glucose = await this._repository.getLast(patientId, MeasurementTypes.BLOOD_GLUCOSE)
            result.blood_pressure = await this._repository.getLast(patientId, MeasurementTypes.BLOOD_PRESSURE)
            result.body_fat = await this._repository.getLast(patientId, MeasurementTypes.BODY_FAT)
            result.body_temperature = await this._repository.getLast(patientId, MeasurementTypes.BODY_TEMPERATURE)
            result.height = await this._repository.getLast(patientId, MeasurementTypes.HEIGHT)
            result.waist_circumference = await this._repository.getLast(patientId, MeasurementTypes.WAIST_CIRCUMFERENCE)
            result.weight = await this._repository.getLast(patientId, MeasurementTypes.WEIGHT)
            if (result.weight) result.weight = await this.addBmi(result.weight)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getLastFromDate(patientId: string, date: string): Promise<LastMeasurements> {
        const result: LastMeasurements = new LastMeasurements()
        try {
            ObjectIdValidator.validate(patientId)
            DateValidator.validate(date)
            result.blood_glucose = await this._repository.getLastFromDate(patientId, MeasurementTypes.BLOOD_GLUCOSE, date)
            result.blood_pressure = await this._repository.getLastFromDate(patientId, MeasurementTypes.BLOOD_PRESSURE, date)
            result.body_fat = await this._repository.getLastFromDate(patientId, MeasurementTypes.BODY_FAT, date)
            result.body_temperature = await this._repository.getLastFromDate(patientId, MeasurementTypes.BODY_TEMPERATURE, date)
            result.height = await this._repository.getLastFromDate(patientId, MeasurementTypes.HEIGHT, date)
            result.waist_circumference =
                await this._repository.getLastFromDate(patientId, MeasurementTypes.WAIST_CIRCUMFERENCE, date)
            result.weight = await this._repository.getLastFromDate(patientId, MeasurementTypes.WEIGHT, date)
            if (result.weight) result.weight = await this.addBmi(result.weight)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async addBmi(weight: Weight): Promise<Weight> {
        try {
            const lastHeight: Height = await this._repository.getLast(weight.patient_id!, MeasurementTypes.HEIGHT)
            if (!lastHeight) return Promise.resolve(weight)
            // Formula for calculating BMI = weight (kg) / ((height (cm) ^ 2) / 100000)
            const bmi: number = (weight.value! / (Math.pow(lastHeight.value!, 2) / 10000))
            // Round number to 2 decimal places
            weight.bmi = Math.round(bmi * 100) / 100
            return Promise.resolve(weight)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
