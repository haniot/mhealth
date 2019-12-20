import sinon from 'sinon'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { MeasurementRepository } from '../../../src/infrastructure/repository/measurement.repository'
import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { assert } from 'chai'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'
import { BodyFat } from '../../../src/application/domain/model/body.fat'
import { Height } from '../../../src/application/domain/model/height'
import { Weight } from '../../../src/application/domain/model/weight'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { Query } from '../../../src/infrastructure/repository/query/query'

require('sinon-mongoose')

describe('Repositories: MeasurementRepository', () => {
    const bloodGlucose: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
    bloodGlucose.id = DefaultEntityMock.BLOOD_GLUCOSE.id
    const bloodPressure: BloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
    bloodPressure.id = DefaultEntityMock.BLOOD_PRESSURE.id
    const bodyTemperature: BodyTemperature = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
    bodyTemperature.id = DefaultEntityMock.BODY_TEMPERATURE.id
    const fat: BodyFat = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
    fat.id = DefaultEntityMock.BODY_FAT.id
    const height: Height = new Height().fromJSON(DefaultEntityMock.HEIGHT)
    height.id = DefaultEntityMock.HEIGHT.id
    const waistCircumference: WaistCircumference = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
    waistCircumference.id = DefaultEntityMock.WAIST_CIRCUMFERENCE.id
    const weight: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
    weight.id = DefaultEntityMock.WEIGHT.id
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
    measurement.id = DefaultEntityMock.MEASUREMENT.id
    measurement.type = DefaultEntityMock.MEASUREMENT.type

    const modelFake: any = MeasurementRepoModel
    const repo =
        new MeasurementRepository(
            modelFake,
            new EntityMapperMock(),
            new EntityMapperMock(),
            new EntityMapperMock(),
            new EntityMapperMock(),
            new EntityMapperMock(),
            new EntityMapperMock(),
            new EntityMapperMock(),
            new EntityMapperMock(),
            new CustomLoggerMock())

    afterEach(() => {
        sinon.restore()
    })

    describe('checkExists()', () => {
        context('when the measurement exists', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({
                        type: bloodGlucose.type,
                        value: bloodGlucose.value,
                        patient_id: bloodGlucose.patient_id,
                        timestamp: bloodGlucose.timestamp,
                        device_id: bloodGlucose.device_id
                    })
                    .chain('exec')
                    .resolves(bloodGlucose)

                return repo.checkExists(bloodGlucose)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when the measurement does not exists', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({
                        type: bloodGlucose.type,
                        value: bloodGlucose.value,
                        patient_id: bloodGlucose.patient_id,
                        timestamp: bloodGlucose.timestamp,
                        device_id: bloodGlucose.device_id
                    })
                    .chain('exec')
                    .resolves(undefined)

                return repo.checkExists(bloodGlucose)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({
                        type: bloodGlucose.type,
                        value: bloodGlucose.value,
                        patient_id: bloodGlucose.patient_id,
                        timestamp: bloodGlucose.timestamp,
                        device_id: bloodGlucose.device_id
                    })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.checkExists(bloodGlucose)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('create()', () => {
        context('when save a new measurement', () => {
            it('should return the saved blood glucose measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(bloodGlucose)
                    .resolves(bloodGlucose)

                return repo.create(bloodGlucose)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.BLOOD_GLUCOSE.id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_GLUCOSE.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_GLUCOSE.device_id)
                        assert.propertyVal(result, 'value', DefaultEntityMock.BLOOD_GLUCOSE.value)
                        assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_GLUCOSE.timestamp)
                        assert.propertyVal(result, 'meal', DefaultEntityMock.BLOOD_GLUCOSE.meal)
                    })
            })
            it('should return the saved blood pressure measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(bloodPressure)
                    .resolves(bloodPressure)

                return repo.create(bloodPressure)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.BLOOD_PRESSURE.id)
                        assert.propertyVal(result, 'systolic', DefaultEntityMock.BLOOD_PRESSURE.systolic)
                        assert.propertyVal(result, 'diastolic', DefaultEntityMock.BLOOD_PRESSURE.diastolic)
                        assert.propertyVal(result, 'pulse', DefaultEntityMock.BLOOD_PRESSURE.pulse)
                        assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_PRESSURE.timestamp)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_PRESSURE.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_PRESSURE.device_id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
                    })
            })
            it('should return the saved body temperature measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(bodyTemperature)
                    .resolves(bodyTemperature)

                return repo.create(bodyTemperature)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.BODY_TEMPERATURE.id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_TEMPERATURE.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_TEMPERATURE.device_id)
                        assert.propertyVal(result, 'value', DefaultEntityMock.BODY_TEMPERATURE.value)
                        assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_TEMPERATURE.timestamp)
                    })
            })
            it('should return the saved fat measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(fat)
                    .resolves(fat)

                return repo.create(fat)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.BODY_FAT.id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_FAT.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_FAT.device_id)
                        assert.propertyVal(result, 'value', DefaultEntityMock.BODY_FAT.value)
                        assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_FAT.timestamp)
                    })
            })
            it('should return the saved height measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(height)
                    .resolves(height)

                return repo.create(height)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.HEIGHT.id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.HEIGHT.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.HEIGHT.device_id)
                        assert.propertyVal(result, 'value', DefaultEntityMock.HEIGHT.value)
                        assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEIGHT.timestamp)
                    })
            })
            it('should return the saved waist circumference measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(waistCircumference)
                    .resolves(waistCircumference)

                return repo.create(waistCircumference)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.WAIST_CIRCUMFERENCE.id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.WAIST_CIRCUMFERENCE.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.device_id)
                        assert.propertyVal(result, 'value', DefaultEntityMock.WAIST_CIRCUMFERENCE.value)
                        assert.propertyVal(result, 'timestamp', DefaultEntityMock.WAIST_CIRCUMFERENCE.timestamp)
                    })
            })
            it('should return the saved weight measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(weight)
                    .resolves(weight)

                return repo.create(weight)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.WEIGHT.id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.WEIGHT.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.WEIGHT.device_id)
                        assert.propertyVal(result, 'value', DefaultEntityMock.WEIGHT.value)
                        assert.propertyVal(result, 'timestamp', DefaultEntityMock.WEIGHT.timestamp)
                    })
            })
            it('should return the saved default measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(measurement)
                    .resolves(measurement)

                return repo.create(measurement)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.MEASUREMENT.id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.MEASUREMENT.type)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                    })
            })
        })

        context('when the measurement is not saved', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(bloodGlucose)
                    .resolves(undefined)

                return repo.create(bloodGlucose)
                    .then(result => {
                        assert.isUndefined(result, 'no result defined')
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(bloodGlucose)
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.create(bloodGlucose)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('find()', () => {
        context('when get many measurements', () => {
            it('should return a list of measurements', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .withArgs({})
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .resolves([bloodGlucose])

                return repo.find(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 1)
                        assert.propertyVal(result[0], 'id', DefaultEntityMock.BLOOD_GLUCOSE.id)
                        assert.propertyVal(result[0], 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                        assert.propertyVal(result[0], 'unit', DefaultEntityMock.BLOOD_GLUCOSE.unit)
                        assert.propertyVal(result[0], 'device_id', DefaultEntityMock.BLOOD_GLUCOSE.device_id)
                        assert.propertyVal(result[0], 'value', DefaultEntityMock.BLOOD_GLUCOSE.value)
                        assert.propertyVal(result[0], 'timestamp', DefaultEntityMock.BLOOD_GLUCOSE.timestamp)
                        assert.propertyVal(result[0], 'meal', DefaultEntityMock.BLOOD_GLUCOSE.meal)
                    })
            })
        })

        context('when does not exists measurements', () => {
            it('should return empty array', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .withArgs({})
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .resolves([])

                return repo.find(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 0)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .withArgs({})
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.find(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('getLastMeasurement()', () => {
        context('when get a last measurement for any type', () => {
            it('should return a last measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .withArgs({ patient_id: bloodGlucose.patient_id, type: bloodGlucose.type })
                    .chain('sort')
                    .withArgs({ timestamp: 'desc', created_at: 'desc' })
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .resolves([bloodGlucose])

                return repo.getLastMeasurement(bloodGlucose.patient_id!, bloodGlucose.type!)
                    .then(result => {
                        assert.propertyVal(result, 'id', DefaultEntityMock.BLOOD_GLUCOSE.id)
                        assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                        assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_GLUCOSE.unit)
                        assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_GLUCOSE.device_id)
                        assert.propertyVal(result, 'value', DefaultEntityMock.BLOOD_GLUCOSE.value)
                        assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_GLUCOSE.timestamp)
                        assert.propertyVal(result, 'meal', DefaultEntityMock.BLOOD_GLUCOSE.meal)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject an error', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .withArgs({ patient_id: bloodGlucose.patient_id, type: bloodGlucose.type })
                    .chain('sort')
                    .withArgs({ timestamp: 'desc', created_at: 'desc' })
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.getLastMeasurement(bloodGlucose.patient_id!, bloodGlucose.type!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })
})
