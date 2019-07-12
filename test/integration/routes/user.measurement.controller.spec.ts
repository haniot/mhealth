import { App } from '../../../src/app'
import { Identifier } from '../../../src/di/identifiers'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Container } from 'inversify'
import { DeviceRepoModel } from '../../../src/infrastructure/database/schema/device.schema'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { expect } from 'chai'
import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { HeartRate } from '../../../src/application/domain/model/heart.rate'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { Fat } from '../../../src/application/domain/model/fat'
import { Height } from '../../../src/application/domain/model/height'
import { Weight } from '../../../src/application/domain/model/weight'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { ObjectID } from 'bson'
import { Strings } from '../../../src/utils/strings'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: UserMeasurement', () => {

    const bloodGlucose: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
    const bloodPressure: BloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
    const bodyTemperature: BodyTemperature = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
    const fat: Fat = new Fat().fromJSON(DefaultEntityMock.FAT)
    const heartRate: HeartRate = new HeartRate().fromJSON(DefaultEntityMock.HEART_RATE)
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
                fat.device_id = result._id.toString()
                heartRate.device_id = result._id.toString()
                height.device_id = result._id.toString()
                waistCircumference.device_id = result._id.toString()
                weight.device_id = result._id.toString()
                measurement.device_id = result._id.toString()
            } catch (err) {
                throw new Error('Failure on UserMeasurement test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllDevices()
            await deleteAllMeasurements()
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on UserMeasurement test: ' + err.message)
        }
    })

    describe('POST /users/:user_id/measurements', () => {
        context('when save a measurement from user', () => {
            it('should return status code 201 and the created measurement', () => {
                return request
                    .post(`/users/${bloodGlucose.user_id}/measurements`)
                    .send(bloodGlucose.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('value', bloodGlucose.value )
                        expect(res.body).to.have.property('unit', bloodGlucose.unit)
                        expect(res.body).to.have.property('type', bloodGlucose.type)
                        expect(res.body).to.have.property('device_id', bloodGlucose.device_id)
                        bloodGlucose.id = res.body.id
                    })
            })
        })

        context('when save a list of measurements from user', () => {
            it('should return status code 207 and a multi status object', () => {
                return request
                    .post(`/users/${bloodGlucose.user_id}/measurements`)
                    .send([
                        bloodPressure.toJSON(),
                        bodyTemperature.toJSON(),
                        fat.toJSON(),
                        height.toJSON(),
                        heartRate.toJSON(),
                        waistCircumference.toJSON(),
                        weight.toJSON()])
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        expect(res.body).to.have.property('success')
                        expect(res.body.success).to.be.instanceOf(Array)
                        expect(res.body.success.length).to.eql(7)
                        expect(res.body).to.have.property('error')
                        expect(res.body.error).to.be.instanceOf(Array)
                        expect(res.body.error.length).to.eql(0)
                    })
            })
        })

        context('when send a measurement with invalid type', () => {
            it('should return return a validation error for not existent type', () => {
                measurement.type = 'invalid'
                return request
                    .post(`/users/${bloodGlucose.user_id}/measurements`)
                    .send(measurement)
                    .set('Content-Type', 'application/json')
                    .expect(500)
                    .catch(err => {
                        expect(err.body).to.have.property('message', 'Cannot read property \\\'device_id\\\' of undefined')
                    })
            })

            it('should return return a validation error for not existent type', () => {
                measurement.type = undefined
                return request
                    .post(`/users/${bloodGlucose.user_id}/measurements`)
                    .send(measurement)
                    .set('Content-Type', 'application/json')
                    .expect(500)
                    .catch(err => {
                        expect(err.body).to.have.property('message', 'Cannot read property \\\'device_id\\\' of undefined')
                    })
            })
        })

    })

    describe('GET /users/:user_id/measurements/:measurement_id', () => {
        context('when get a unique measurement from user', () => {
            it('should return status code 200 and a measurement', () => {
                return request
                    .get(`/users/${bloodGlucose.user_id}/measurements/${bloodGlucose.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', bloodGlucose.id)
                        expect(res.body).to.have.property('value', bloodGlucose.value)
                        expect(res.body).to.have.property('unit', bloodGlucose.unit)
                        expect(res.body).to.have.property('type', bloodGlucose.type)
                        expect(res.body).to.have.property('device_id', bloodGlucose.device_id)
                    })
            })
        })

        context('when measurement is not founded', () => {
            it('should return status code 404 and message from measurement not found', () => {
                return request
                    .get(`/users/${measurement.user_id}/measurements/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.MEASUREMENT.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.MEASUREMENT.NOT_FOUND_DESC)
                    })
            })
        })
    })

    context('when there are validation errors', () => {
        it('should return status code 400 and message from invalid parameters', () => {
            return request
                .get('/users/123/measurements/321')
                .set('Content-Type', 'application/json')
                .expect(400)
                .then(res => {
                    expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                    expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                })
        })
    })

    describe('GET /users/:user_id/measurements', () => {
        context('when get all measurements from user', () => {
            it('should return status code 200 and a list of measurements', () => {
                return request
                    .get(`/users/${measurement.user_id}/measurements`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).is.an.instanceOf(Array)
                        expect(res.body.length).to.eql(9)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .get('/users/123/measurements')
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

    describe('DELETE /users/:user_id/measurements/:measurement_id', () => {
        context('when delete a measurement from user', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/users/${bloodGlucose.user_id}/measurements/${bloodGlucose.id}`)
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
                    .delete('/users/123/measurements/321')
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
