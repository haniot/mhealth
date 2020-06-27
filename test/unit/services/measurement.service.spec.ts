import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Height } from '../../../src/application/domain/model/height'
import { Weight } from '../../../src/application/domain/model/weight'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'
import { BodyFat } from '../../../src/application/domain/model/body.fat'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { MeasurementService } from '../../../src/application/service/measurement.service'
import { MeasurementRepositoryMock } from '../../mocks/repositories/measurement.repository.mock'
import { DeviceRepositoryMock } from '../../mocks/repositories/device.repository.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { LastMeasurements } from '../../../src/application/domain/model/last.measurements'
import { ObjectID } from 'bson'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'

describe('Services: MeasurementService', () => {
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
    const lastMeasurements: LastMeasurements = new LastMeasurements().fromJSON(DefaultEntityMock.LAST_MEASUREMENTS)
    lastMeasurements.blood_glucose!.patient_id = DefaultEntityMock.BLOOD_GLUCOSE.patient_id
    lastMeasurements.blood_pressure!.patient_id = DefaultEntityMock.BLOOD_PRESSURE.patient_id
    lastMeasurements.body_fat!.patient_id = DefaultEntityMock.BODY_FAT.patient_id
    lastMeasurements.body_temperature!.patient_id = DefaultEntityMock.BODY_TEMPERATURE.patient_id
    lastMeasurements.height!.patient_id = DefaultEntityMock.HEIGHT.patient_id
    lastMeasurements.waist_circumference!.patient_id = DefaultEntityMock.WAIST_CIRCUMFERENCE.patient_id
    lastMeasurements.weight!.patient_id = DefaultEntityMock.WEIGHT.patient_id
    const service = new MeasurementService(new MeasurementRepositoryMock(), new DeviceRepositoryMock())

    describe('getAll()', () => {
        context('when get all measurements from patient', () => {
            it('should return a list of measurements from patient', () => {
                return service.getAll(new Query().fromJSON({ filters: { patient_id: height.patient_id } }))
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 7)
                        assert.deepEqual(res, listMeasurements)
                    })
            })
        })

        context('when does not pass a patient_id', () => {
            it('should return a list of measurements', () => {
                return service.getAll(new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 7)
                        assert.deepEqual(res, listMeasurements)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error', () => {
                return service.getAll(new Query().fromJSON({ filters: { patient_id: '1a2b3c' } }))
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when get a measurement by id', () => {
            it('should return a measurement', () => {
                return service.getById(height.id!, new Query())
                    .then(res => {
                        assert.deepEqual(res, height)
                    })
            })
        })

        context('when get a measurement by id and patient_id', () => {
            it('should return a measurement', () => {
                return service
                    .getById(height.id!, new Query().fromJSON({ filters: { patient_id: height.patient_id } }))
                    .then(res => {
                        assert.deepEqual(res, height)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error', () => {
                return service
                    .getById('1a2b3c', new Query().fromJSON({ filters: { patient_id: height.patient_id } }))
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('removeMeasurement()', () => {
        context('when remove a measurement from patient', () => {
            return service.removeByPatient(height.id!, height.patient_id!)
                .then(res => {
                    assert.isBoolean(res)
                    assert.isTrue(res)
                })
        })

        context('when there are validation errors', () => {
            it('should reject an error', () => {
                return service.removeByPatient('1a2b3c', '1bd2c3')
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('remove()', () => {
        context('when call this function', () => {
            it('should reject error for not implemented', () => {
                return service.remove(height.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Not implemented!')
                    })
            })
        })
    })

    describe('update()', () => {
        context('when call this function', () => {
            it('should reject error for not implemented', () => {
                return service.update(height)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Not implemented!')
                    })
            })
        })
    })

    describe('count()', () => {
        context('when count the total of measurements', () => {
            it('should return a number', () => {
                return service.count(new Query())
                    .then(res => {
                        assert.isNumber(res)
                        assert.equal(res, 7)
                    })
            })
        })
    })

    describe('getLastMeasurements()', () => {
        context('when get a list of last measurements', () => {
            return service.getLast(height.patient_id!)
                .then(res => {
                    assert.deepEqual(res, lastMeasurements)
                })
        })

        context('when there are validation errors', () => {
            it('should reject an error ()', () => {
                return service.getLast('1a2b23c')
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('addMeasurement()', () => {
        describe('when save a unique measurement', () => {
            context('when save a blood glucose measurement', () => {
                it('should return the saved measurement', () => {
                    return service.add(bloodGlucose)
                        .then(res => {
                            assert.deepEqual(res, bloodGlucose)
                        })
                })
            })

            context('when does not pass a device_id', () => {
                it('should return the saved measurement without device_id', () => {
                    bloodGlucose.device_id = undefined
                    return service.add(bloodGlucose)
                        .then(res => {
                            assert.deepEqual(res, bloodGlucose)
                        })
                })
            })

            context('when device is not found', () => {
                it('should reject error for device does not exists', () => {
                    bloodGlucose.device_id = `${new ObjectID()}`
                    return service.add(bloodGlucose)
                        .catch(err => {
                            assert.propertyVal(err, 'message', Strings.DEVICE.NOT_FOUND)
                            assert.propertyVal(err, 'description', Strings.DEVICE.NOT_FOUND_DESC)
                            bloodGlucose.device_id = DefaultEntityMock.BLOOD_GLUCOSE.device_id
                        })
                })
            })

            context('when does not pass a patient_id', () => {
                it('should reject an error for missing parameters', () => {
                    bloodGlucose.patient_id = undefined
                    bloodGlucose.timestamp = undefined
                    return service.add(bloodGlucose)
                        .catch(err => {
                            assert.propertyVal(err, 'message', 'Required fields were not provided...')
                            assert.propertyVal(err, 'description', 'BloodGlucose validation: timestamp, patient_id required!')
                            bloodGlucose.patient_id = DefaultEntityMock.BLOOD_GLUCOSE.patient_id
                            bloodGlucose.timestamp = DefaultEntityMock.BLOOD_GLUCOSE.timestamp
                        })
                })
            })

            context('when measurement already exists', () => {
                it('should reject an error for existent measurement', () => {
                    bloodGlucose.type = 'exists'
                    return service.add(bloodGlucose)
                        .catch(err => {
                            assert.propertyVal(err, 'message', Strings.MEASUREMENT.ALREADY_REGISTERED)
                        })
                })
            })

            context('when measurement type is not mapped', () => {
                it('should reject an error for invalid type', () => {
                    bloodGlucose.type = 'inexistent'
                    return service.add(bloodGlucose)
                        .catch(err => {
                            assert.propertyVal(err, 'message',
                                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`type: ${bloodGlucose.type}`))
                            assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                                .concat(Object.values(MeasurementTypes).join(', ').concat('.')))
                            bloodGlucose.type = DefaultEntityMock.BLOOD_GLUCOSE.type
                        })
                })
            })
        })

        describe('when save a list of measurements', () => {
            context('when save a collection of measurements', () => {
                it('should return a multi status with a list of success saves', () => {
                    return service.add(listMeasurements)
                        .then(res => {
                            assert.lengthOf(res.success, 7)
                            assert.lengthOf(res.error, 0)
                        })
                })
            })

            context('when a validation error occours', () => {
                it('should return a multi status with a list of error', () => {
                    bloodGlucose.patient_id = undefined
                    return service.add([bloodGlucose])
                        .then(res => {
                            assert.lengthOf(res.success, 0)
                            assert.lengthOf(res.error, 1)
                            bloodGlucose.patient_id = DefaultEntityMock.BLOOD_GLUCOSE.patient_id
                        })
                })
            })

            context('when a conflict error occours', () => {
                it('should return a multi status with a list of error', () => {
                    bloodGlucose.type = 'exists'
                    return service.add([bloodGlucose])
                        .then(res => {
                            assert.lengthOf(res.success, 0)
                            assert.lengthOf(res.error, 1)
                            bloodGlucose.type = DefaultEntityMock.BLOOD_GLUCOSE.type
                        })
                })
            })
        })
    })

})
