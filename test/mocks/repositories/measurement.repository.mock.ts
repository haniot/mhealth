import { IMeasurementRepository } from '../../../src/application/port/measurement.repository.interface'
import { IQuery } from '../../../src/application/port/query.interface'
import { DefaultEntityMock } from '../models/default.entity.mock'
import { Height } from '../../../src/application/domain/model/height'
import { Weight } from '../../../src/application/domain/model/weight'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'
import { BodyFat } from '../../../src/application/domain/model/body.fat'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'

const height: Height = new Height().fromJSON(DefaultEntityMock.HEIGHT)
height.patient_id = DefaultEntityMock.HEIGHT.patient_id
const weight: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
weight.patient_id = DefaultEntityMock.WEIGHT.patient_id
const waist: WaistCircumference = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
waist.patient_id = DefaultEntityMock.WAIST_CIRCUMFERENCE.patient_id
const bodyFat: BodyFat = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
bodyFat.patient_id = DefaultEntityMock.BODY_FAT.patient_id
const bloodPressure: BloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
bloodPressure.patient_id = DefaultEntityMock.BLOOD_PRESSURE.patient_id
const bloodGlucose: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
bloodGlucose.patient_id = DefaultEntityMock.BLOOD_GLUCOSE.patient_id
const bodyTemperature: BodyTemperature = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
bodyTemperature.patient_id = DefaultEntityMock.BODY_TEMPERATURE.patient_id
const listMeasurements = [height, weight, waist, bodyFat, bloodPressure, bloodGlucose, bodyTemperature]

export class MeasurementRepositoryMock implements IMeasurementRepository {
    public removeMeasurementsFromUser(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(7)
    }

    public create(item: any): Promise<any> {
        return Promise.resolve(item)
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: IQuery): Promise<Array<any>> {
        return Promise.resolve(listMeasurements)
    }

    public findOne(query: IQuery): Promise<any> {
        const id = query.toJSON().filters._id
        let result
        switch (id) {
            case height.id:
                result = height
                break
            case weight.id:
                result = weight
                break
            case waist.id:
                result = waist
                break
            case bodyFat.id:
                result = bodyFat
                break
            case bloodPressure.id:
                result = bloodPressure
                break
            case bloodGlucose.id:
                result = bloodGlucose
                break
            case bodyTemperature.id:
                result = bodyTemperature
                break
        }
        return Promise.resolve(result)
    }

    public update(item: any): Promise<any> {
        return Promise.resolve(item)

    }

    public checkExists(item: any): Promise<boolean> {
        return Promise.resolve(item.type === 'exists')
    }

    public getLastMeasurement(patientId: string, measurementType: string): Promise<any> {
        let result: any
        switch (measurementType) {
            case MeasurementTypes.HEIGHT:
                result = height
                break
            case MeasurementTypes.WEIGHT:
                result = weight
                break
            case MeasurementTypes.WAIST_CIRCUMFERENCE:
                result = waist
                break
            case MeasurementTypes.BODY_FAT:
                result = bodyFat
                break
            case MeasurementTypes.BLOOD_PRESSURE:
                result = bloodPressure
                break
            case MeasurementTypes.BLOOD_GLUCOSE:
                result = bloodGlucose
                break
            case MeasurementTypes.BODY_TEMPERATURE:
                result = bodyTemperature
                break
        }
        return Promise.resolve(result)
    }
}
