import { App } from '../../../src/app'
import { Identifier } from '../../../src/di/identifiers'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Container } from 'inversify'
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

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: PatientMeasurement', () => {

    const bloodGlucose: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
    const bloodPressure: BloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
    const bodyTemperature: BodyTemperature = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
    const bodyFat: BodyFat = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
    const height: Height = new Height().fromJSON(DefaultEntityMock.HEIGHT)
    const waistCircumference: WaistCircumference = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
    const weight: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllDevices()
                await deleteAllMeasurements()
                const result = await createDevice()
                bloodGlucose.device_id = result._id.toString()
                bloodPressure.device_id = result._id.toString()
                bodyTemperature.device_id = result._id.toString()
                bodyFat.device_id = result._id.toString()
                height.device_id = result._id.toString()
                waistCircumference.device_id = result._id.toString()
                weight.device_id = result._id.toString()
                measurement.device_id = result._id.toString()
            } catch (err) {
                throw new Error('Failure on PatientMeasurement test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllDevices()
            await deleteAllMeasurements()
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on PatientMeasurement test: ' + err.message)
        }
    })

    describe('POST /v1/patients/:patient_id/measurements', () => {
        describe('save one measurement', () => {
            context('when save a unique measurement', () => {
                it('should return status code 201 and the saved measurement', () => {
                    return request
                        .post(`/v1/patients/${bloodGlucose.patient_id}/measurements`)
                        .send(bloodGlucose.toJSON())
                        .set('Content-Type', 'application/json')
                        .expect(201)
                        .then(res => {
                            expect(res.body).to.have.property('id')
                            expect(res.body).to.have.property('type', bloodGlucose.type)
                            expect(res.body).to.have.property('unit', bloodGlucose.unit)
                            expect(res.body).to.have.property('device_id', bloodGlucose.device_id)
                            expect(res.body).to.have.property('value', bloodGlucose.value)
                            expect(res.body).to.have.property('timestamp')
                            expect(res.body).to.have.property('meal', bloodGlucose.meal)
                            bloodGlucose.id = res.body.id
                        })
                })
            })

            context('when there are a measurement with same parameters', () => {
                it('should return status code 409 and info message from duplicate items', () => {
                    return request
                        .post(`/v1/patients/${bloodGlucose.patient_id}/measurements`)
                        .send(bloodGlucose.toJSON())
                        .set('Content-Type', 'application/json')
                        .expect(409)
                        .then(res => {
                            expect(res.body).to.have.property('message', 'Measurement already registered!')
                            expect(res.body).to.have.property('description', `A ${bloodGlucose.type} measurement with value ` +
                                `${bloodGlucose.value}${bloodGlucose.unit} from ${bloodGlucose.patient_id} collected by ` +
                                `device ${bloodGlucose.device_id} at ${bloodGlucose.timestamp} already exists.`)
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
                            expect(res.body).to.have.property('message',
                                Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                            expect(res.body).to.have.property('description',
                                Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                        })
                })
            })
        })

        describe('save a list of measurements', () => {
            context('when save a list of measurements', () => {
                it('should return a list of measurements', () => {
                    return request
                        .post(`/v1/patients/${bloodGlucose.patient_id}/measurements`)
                        .send([bloodPressure.toJSON(), bodyTemperature.toJSON(), bodyFat.toJSON(),
                            height.toJSON(), weight.toJSON(), waistCircumference.toJSON()])
                        .set('Content-Type', 'application/json')
                        .expect(207)
                        .then(res => {
                            expect(res.body.success).to.have.lengthOf(7)
                            expect(res.body.error).to.have.lengthOf(0)
                        })
                })
            })
        })
    })

    describe('GET /v1/patients/:patient_id/measurements/:measurement_id', () => {
        context('when get a unique measurement from patient', () => {
            it('should return status code 200 and a measurement', () => {
                return request
                    .get(`/v1/patients/${bloodGlucose.patient_id}/measurements/${bloodGlucose.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', bloodGlucose.id)
                        expect(res.body).to.have.property('type', bloodGlucose.type)
                        expect(res.body).to.have.property('unit', bloodGlucose.unit)
                        expect(res.body).to.have.property('device_id', bloodGlucose.device_id)
                        expect(res.body).to.have.property('value', bloodGlucose.value)
                        expect(res.body).to.have.property('timestamp')
                        expect(res.body).to.have.property('meal', bloodGlucose.meal)
                    })
            })
        })

        context('when measurement is not founded', () => {
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
            it('should return status code 200 and a list of measurements', () => {
                return request
                    .get(`/v1/patients/${measurement.patient_id}/measurements`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).is.an.instanceOf(Array)
                        expect(res.body).to.have.lengthOf(8)
                    })
            })
        })
        context('when there no are measurements from patient', () => {
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
            it('should return status code 200 and a object with a last measurements for each type', () => {
                return request
                    .get(`/v1/patients/${bloodGlucose.patient_id}/measurements/last`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.blood_glucose).to.not.equal({})
                        expect(res.body.blood_pressure).to.not.eql({})
                        expect(res.body.body_fat).to.not.eql({})
                        expect(res.body.body_temperature).to.not.eql({})
                        expect(res.body.height).to.not.eql({})
                        expect(res.body.waist_circumference).to.not.eql({})
                        expect(res.body.weight).to.not.eql({})
                    })
            })
        })

        context('when there are no measurements from patient', () => {
            it('should return status code 200 and a object with empty measurements', () => {
                return request
                    .get(`/v1/patients/${new ObjectID()}/measurements/last`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.blood_glucose).to.be.empty
                        expect(res.body.blood_pressure).to.be.empty
                        expect(res.body.body_fat).to.be.empty
                        expect(res.body.body_temperature).to.be.empty
                        expect(res.body.height).to.be.empty
                        expect(res.body.waist_circumference).to.be.empty
                        expect(res.body.weight).to.be.empty
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

    describe('DELETE /v1/patients/:patient_id/measurements/:measurement_id', () => {
        context('when delete a measurement from patient', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/patients/${bloodGlucose.patient_id}/measurements/${bloodGlucose.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
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

async function deleteAllMeasurements() {
    return await MeasurementRepoModel.deleteMany({})
}

async function createDevice() {
    return await DeviceRepoModel.create(DefaultEntityMock.DEVICE)
}

async function deleteAllDevices() {
    return await DeviceRepoModel.deleteMany({})
}
