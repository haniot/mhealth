import { App } from '../../../src/app'
import { Identifier } from '../../../src/di/identifiers'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DeviceRepoModel } from '../../../src/infrastructure/database/schema/device.schema'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { BodyFat } from '../../../src/application/domain/model/body.fat'
import { Height } from '../../../src/application/domain/model/height'
import { Weight } from '../../../src/application/domain/model/weight'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { expect } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { ObjectID } from 'bson'
import { DIContainer } from '../../../src/di/di'
import { Config } from '../../../src/utils/config'
import { HandGrip } from '../../../src/application/domain/model/hand.grip'
import { CalfCircumference } from '../../../src/application/domain/model/calf.circumference'
import { IMeasurementRepository } from '../../../src/application/port/measurement.repository.interface'
import { Query } from '../../../src/infrastructure/repository/query/query'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const measurementRepository: IMeasurementRepository = DIContainer.get(Identifier.MEASUREMENT_REPOSITORY)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: patients.measurements', () => {
    const bloodGlucose: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
    bloodGlucose.patient_id = DefaultEntityMock.BLOOD_GLUCOSE.patient_id
    const otherBloodGlucose: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
    otherBloodGlucose.patient_id = DefaultEntityMock.BLOOD_GLUCOSE.patient_id
    const bloodPressure: BloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
    bloodPressure.patient_id = DefaultEntityMock.BLOOD_PRESSURE.patient_id
    const bodyTemperature: BodyTemperature = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
    bodyTemperature.patient_id = DefaultEntityMock.BODY_TEMPERATURE.patient_id
    const bodyFat: BodyFat = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
    bodyFat.patient_id = DefaultEntityMock.BODY_FAT.patient_id
    const height: Height = new Height().fromJSON(DefaultEntityMock.HEIGHT)
    height.patient_id = DefaultEntityMock.HEIGHT.patient_id
    const waistCircumference: WaistCircumference = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
    waistCircumference.patient_id = DefaultEntityMock.WAIST_CIRCUMFERENCE.patient_id
    const weight: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
    weight.patient_id = DefaultEntityMock.WEIGHT.patient_id
    const handGrip: HandGrip = new HandGrip().fromJSON(DefaultEntityMock.HAND_GRIP)
    handGrip.patient_id = DefaultEntityMock.HAND_GRIP.patient_id
    const calfCircumference: CalfCircumference = new CalfCircumference().fromJSON(DefaultEntityMock.CALF_CIRCUMFERENCE)
    calfCircumference.patient_id = DefaultEntityMock.CALF_CIRCUMFERENCE.patient_id
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
    measurement.patient_id = DefaultEntityMock.MEASUREMENT.patient_id

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
                await deleteAllDevices()
                await deleteAllMeasurements()
                const result = await createDevice()
                bloodGlucose.device_id = result._id.toString()
                otherBloodGlucose.device_id = result._id.toString()
                bloodPressure.device_id = result._id.toString()
                bodyTemperature.device_id = result._id.toString()
                bodyFat.device_id = result._id.toString()
                height.device_id = result._id.toString()
                waistCircumference.device_id = result._id.toString()
                weight.device_id = result._id.toString()
                handGrip.device_id = result._id.toString()
                calfCircumference.device_id = result._id.toString()
                measurement.device_id = result._id.toString()
            } catch (err: any) {
                throw new Error('Failure on patients.measurements test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllDevices()
            await deleteAllMeasurements()
            await dbConnection.dispose()
        } catch (err: any) {
            throw new Error('Failure on patients.measurements test: ' + err.message)
        }
    })

    describe('POST /v1/patients/:patient_id/measurements', () => {
        describe('save one measurement', () => {
            context('when save a unique measurement', () => {
                before(async () => {
                    try {
                        await deleteAllMeasurements()
                    } catch (err: any) {
                        throw new Error('Failure on patients.measurements routes test: ' + err.message)
                    }
                })

                it('should return status code 201 and the saved measurement', () => {
                    return request
                        .post(`/v1/patients/${bloodGlucose.patient_id}/measurements`)
                        .send(bloodGlucose.toJSON())
                        .set('Content-Type', 'application/json')
                        .expect(201)
                        .then(res => {
                            expect(res.body).to.have.property('id')
                            expect(res.body.timestamp).to.eql(bloodGlucose.timestamp)
                            expect(res.body.type).to.eql(bloodGlucose.type)
                            expect(res.body.value).to.eql(bloodGlucose.value)
                            expect(res.body.unit).to.eql(bloodGlucose.unit)
                            expect(res.body.device_id).to.eql(bloodGlucose.device_id)
                            expect(res.body.meal).to.eql(bloodGlucose.meal)
                        })
                })
            })

            context('when there are a measurement with same parameters', () => {
                before(async () => {
                    try {
                        await deleteAllMeasurements()

                        await createMeasurement(bloodGlucose)
                    } catch (err: any) {
                        throw new Error('Failure on patients.measurements routes test: ' + err.message)
                    }
                })

                it('should return status code 409 and info message from duplicate items', () => {
                    return request
                        .post(`/v1/patients/${bloodGlucose.patient_id}/measurements`)
                        .send(bloodGlucose.toJSON())
                        .set('Content-Type', 'application/json')
                        .expect(409)
                        .then(res => {
                            expect(res.body).to.have.property('message', Strings.MEASUREMENT.ALREADY_REGISTERED)
                        })
                })
            })

            context('when there are validation errors', () => {
                it('should return status code 400 and info message from invalid parameters', () => {
                    return request
                        .post('/v1/patients/123/measurements')
                        .send(bloodGlucose.toJSON())
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(res => {
                            expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                            expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                        })
                })
            })
        })

        describe('save a list of measurements', () => {
            context('when save a list of measurements', () => {
                before(async () => {
                    try {
                        await deleteAllMeasurements()
                    } catch (err: any) {
                        throw new Error('Failure on patients.measurements routes test: ' + err.message)
                    }
                })

                it('should return a list of measurements', () => {
                    return request
                        .post(`/v1/patients/${bloodGlucose.patient_id}/measurements`)
                        .send([bloodGlucose.toJSON(), bloodPressure.toJSON(), bodyTemperature.toJSON(), bodyFat.toJSON(),
                            height.toJSON(), weight.toJSON(), waistCircumference.toJSON(), handGrip.toJSON(),
                            calfCircumference.toJSON()])
                        .set('Content-Type', 'application/json')
                        .expect(207)
                        .then(res => {
                            expect(res.body.success).to.have.lengthOf(9)
                            expect(res.body.error).to.have.lengthOf(0)
                        })
                })
            })
        })
    })

    describe('GET /v1/patients/:patient_id/measurements/:measurement_id', () => {
        context('when get a unique measurement from patient', () => {
            let result

            before(async () => {
                try {
                    await deleteAllMeasurements()

                    result = await createMeasurement(weight)
                } catch (err: any) {
                    throw new Error('Failure on patients.measurements routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a measurement', () => {
                return request
                    .get(`/v1/patients/${bloodGlucose.patient_id}/measurements/${result.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.id).to.eql(result.id)
                        expect(res.body.timestamp).to.eql(weight.timestamp)
                        expect(res.body.type).to.eql(weight.type)
                        expect(res.body.value).to.eql(weight.value)
                        expect(res.body.unit).to.eql(weight.unit)
                        expect(res.body.device_id).to.eql(weight.device_id)
                        expect(res.body.body_fat).to.eql(weight.body_fat)
                        expect(res.body.annual_variation).to.eql(weight.annual_variation)
                    })
            })
        })

        context('when measurement is not founded', () => {
            before(async () => {
                try {
                    await deleteAllMeasurements()
                } catch (err: any) {
                    throw new Error('Failure on patients.measurements routes test: ' + err.message)
                }
            })

            it('should return status code 404 and message from measurement not found', () => {
                return request
                    .get(`/v1/patients/${measurement.patient_id}/measurements/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.MEASUREMENT.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.MEASUREMENT.NOT_FOUND_DESC)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .get('/v1/patients/123/measurements/321')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('GET /v1/patients/:patient_id/measurements', () => {
        context('when get all measurements from patient', () => {
            before(async () => {
                try {
                    await deleteAllMeasurements()
                    await createMeasurement(bloodGlucose)
                    await createMeasurement(bloodPressure)
                    await createMeasurement(bodyTemperature)
                    await createMeasurement(bodyFat)
                    await createMeasurement(weight)
                    await createMeasurement(height)
                    await createMeasurement(waistCircumference)
                    await createMeasurement(handGrip)
                    await createMeasurement(calfCircumference)
                } catch (err: any) {
                    throw new Error('Failure on patients.measurements routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a list of measurements', () => {
                return request
                    .get(`/v1/patients/${measurement.patient_id}/measurements`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).is.an.instanceOf(Array)
                        expect(res.body).to.have.lengthOf(9)
                    })
            })
        })
        context('when there no are measurements from patient', () => {
            before(async () => {
                try {
                    await deleteAllMeasurements()
                } catch (err: any) {
                    throw new Error('Failure on patients.measurements routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a empty list', () => {
                return request
                    .get(`/v1/patients/${new ObjectID()}/measurements`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).is.an.instanceOf(Array)
                        expect(res.body).to.have.lengthOf(0)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .get('/v1/patients/123/measurements')
                    .send(measurement.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('GET /v1/patients/:patient_id/measurements/last', () => {
        context('when get the last measurements from patient', () => {
            before(async () => {
                try {
                    await deleteAllMeasurements()
                    bloodGlucose.timestamp = '2020-11-21T14:40:00.000Z'
                    await createMeasurement(bloodGlucose)
                    otherBloodGlucose.timestamp = '2020-11-20T14:40:00.000Z'
                    await createMeasurement(otherBloodGlucose)
                } catch (err: any) {
                    throw new Error('Failure on patients.measurements routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a object with a last measurements for each type', () => {
                return request
                    .get(`/v1/patients/${bloodGlucose.patient_id}/measurements/last`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.blood_glucose).to.have.property('id')
                        expect(res.body.blood_glucose.timestamp).to.eql(bloodGlucose.timestamp)
                        expect(res.body.blood_glucose.type).to.eql(bloodGlucose.type)
                        expect(res.body.blood_glucose.value).to.eql(bloodGlucose.value)
                        expect(res.body.blood_glucose.unit).to.eql(bloodGlucose.unit)
                        expect(res.body.blood_glucose.device_id).to.eql(bloodGlucose.device_id)
                        expect(res.body.blood_glucose.patient_id).to.eql(bloodGlucose.patient_id)
                        expect(res.body.blood_glucose.meal).to.eql(bloodGlucose.meal)
                        expect(res.body.blood_pressure).to.eql({})
                        expect(res.body.body_fat).to.eql({})
                        expect(res.body.body_temperature).to.eql({})
                        expect(res.body.height).to.eql({})
                        expect(res.body.waist_circumference).to.eql({})
                        expect(res.body.weight).to.eql({})
                        expect(res.body.hand_grip).to.eql({})
                        expect(res.body.calf_circumference).to.eql({})
                    })
            })
        })

        context('when there are no measurements from patient', () => {
            before(async () => {
                try {
                    await deleteAllMeasurements()
                } catch (err: any) {
                    throw new Error('Failure on patients.measurements routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a object with empty measurements', () => {
                return request
                    .get(`/v1/patients/${new ObjectID()}/measurements/last`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.blood_glucose).to.eql({})
                        expect(res.body.blood_pressure).to.eql({})
                        expect(res.body.body_fat).to.eql({})
                        expect(res.body.body_temperature).to.eql({})
                        expect(res.body.height).to.eql({})
                        expect(res.body.waist_circumference).to.eql({})
                        expect(res.body.weight).to.eql({})
                        expect(res.body.hand_grip).to.eql({})
                        expect(res.body.calf_circumference).to.eql({})
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .get('/v1/patients/123/measurements/last')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('GET /v1/patients/:patient_id/measurements/last/:date', () => {
        context('when get the last measurements of patient from date', () => {
            before(async () => {
                try {
                    await deleteAllMeasurements()
                    bloodGlucose.timestamp = '2020-11-19T14:50:00.000Z'
                    await createMeasurement(bloodGlucose)
                    otherBloodGlucose.timestamp = '2020-11-19T14:40:00.000Z'
                    await createMeasurement(otherBloodGlucose)
                } catch (err: any) {
                    throw new Error('Failure on patients.measurements routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a object with a last measurements for each type', () => {
                return request
                    .get(`/v1/patients/${bloodGlucose.patient_id}/measurements/last/2020-11-19`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.blood_glucose).to.have.property('id')
                        expect(res.body.blood_glucose.timestamp).to.eql(bloodGlucose.timestamp)
                        expect(res.body.blood_glucose.type).to.eql(bloodGlucose.type)
                        expect(res.body.blood_glucose.value).to.eql(bloodGlucose.value)
                        expect(res.body.blood_glucose.unit).to.eql(bloodGlucose.unit)
                        expect(res.body.blood_glucose.device_id).to.eql(bloodGlucose.device_id)
                        expect(res.body.blood_glucose.patient_id).to.eql(bloodGlucose.patient_id)
                        expect(res.body.blood_glucose.meal).to.eql(bloodGlucose.meal)
                        expect(res.body.blood_pressure).to.eql({})
                        expect(res.body.body_fat).to.eql({})
                        expect(res.body.body_temperature).to.eql({})
                        expect(res.body.height).to.eql({})
                        expect(res.body.waist_circumference).to.eql({})
                        expect(res.body.weight).to.eql({})
                        expect(res.body.hand_grip).to.eql({})
                        expect(res.body.calf_circumference).to.eql({})
                    })
            })
        })

        context('when there are no measurements from patient', () => {
            before(async () => {
                try {
                    await deleteAllMeasurements()
                } catch (err: any) {
                    throw new Error('Failure on patients.measurements routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a object with empty measurements', () => {
                return request
                    .get(`/v1/patients/${new ObjectID()}/measurements/last/2020-07-13`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.blood_glucose).to.eql({})
                        expect(res.body.blood_pressure).to.eql({})
                        expect(res.body.body_fat).to.eql({})
                        expect(res.body.body_temperature).to.eql({})
                        expect(res.body.height).to.eql({})
                        expect(res.body.waist_circumference).to.eql({})
                        expect(res.body.weight).to.eql({})
                        expect(res.body.hand_grip).to.eql({})
                        expect(res.body.calf_circumference).to.eql({})
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid patient id', () => {
                return request
                    .get('/v1/patients/123/measurements/last/2020-11-19')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from invalid date', () => {
                return request
                    .get('/v1/patients/123/measurements/last/19-11-2020')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('DELETE /v1/patients/:patient_id/measurements/:measurement_id', () => {
        let result

        before(async () => {
            try {
                await deleteAllMeasurements()

                result = await createMeasurement(bloodGlucose)
            } catch (err: any) {
                throw new Error('Failure on patients.measurements routes test: ' + err.message)
            }
        })

        context('when delete a measurement from patient', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/patients/${bloodGlucose.patient_id}/measurements/${result.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(async res => {
                        expect(res.body).to.eql({})

                        const countMeasurements = await measurementRepository.count(new Query())
                        expect(countMeasurements).to.eql(0)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .delete('/v1/patients/123/measurements/321')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
})

async function createDevice() {
    return await DeviceRepoModel.create(DefaultEntityMock.DEVICE)
}

async function deleteAllDevices() {
    return await DeviceRepoModel.deleteMany({})
}

async function createMeasurement(measurement: Measurement) {
    const measurementSaved: Measurement = await measurementRepository.create(measurement)
    return Promise.resolve(measurementSaved)
}

async function deleteAllMeasurements() {
    return await MeasurementRepoModel.deleteMany({})
}
