// import { App } from '../../../src/app'
// import { Identifier } from '../../../src/di/identifiers'
// import { DI } from '../../../src/di/di'
// import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
// import { Container } from 'inversify'
// import { DeviceRepoModel } from '../../../src/infrastructure/database/schema/device.schema'
// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { expect } from 'chai'
// import { ObjectID } from 'bson'
// import { Strings } from '../../../src/utils/strings'
// import { Measurement } from '../../../src/application/domain/model/measurement'
// import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
//
// const container: Container = DI.getInstance().getContainer()
// const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
// const app: App = container.get(Identifier.APP)
// const request = require('supertest')(app.getExpress())
//
// describe('Routes: UserMeasurement', () => {
//
//     const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
//
//     before(async () => {
//             try {
//                 await dbConnection.tryConnect(0, 500)
//                 await deleteAllDevices()
//                 await deleteAllMeasurements()
//                 const result = await createDevice()
//                 measurement.device_id = result._id.toString()
//             } catch (err) {
//                 throw new Error('Failure on UserMeasurement test: ' + err.message)
//             }
//         }
//     )
//
//     after(async () => {
//         try {
//             await deleteAllDevices()
//             await deleteAllMeasurements()
//             await dbConnection.dispose()
//         } catch (err) {
//             throw new Error('Failure on UserMeasurement test: ' + err.message)
//         }
//     })
//
//     describe('POST /users/:user_id/measurements', () => {
//         context('when save a measurement from user', () => {
//             it('should return status code 201 and the created measurement', () => {
//                 return request
//                     .post(`/users/${measurement.user_id}/measurements`)
//                     .send(measurement.toJSON())
//                     .set('Content-Type', 'application/json')
//                     .then(res => {
//                         expect(res.body).to.have.property('id')
//                         expect(res.body).to.have.property('value')
//                         expect(res.body.value).to.eql(measurement.value)
//                         expect(res.body).to.have.property('unit')
//                         expect(res.body.unit).to.eql(measurement.unit)
//                         expect(res.body).to.have.property('type')
//                         expect(res.body.type).to.eql(measurement.type)
//                         expect(res.body).to.have.property('device_id')
//                         expect(res.body.device_id).to.eql(measurement.device_id)
//                         expect(res.body).to.have.property('user_id')
//                         expect(res.body.user_id).to.eql(measurement.user_id)
//                         measurement.id = res.body.id
//                     })
//             })
//         })
//
//         context('when there are validation errors', () => {
//             it('should return status code 400 and message from invalid parameters', () => {
//                 return request
//                     .post('/users/123/measurements')
//                     .send(measurement.toJSON())
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
//                     })
//             })
//         })
//     })
//
//     describe('GET /users/:user_id/measurements/:measurement_id', () => {
//         context('when get a unique measurement from user', () => {
//             it('should return status code 200 and a measurement', () => {
//                 return request
//                     .get(`/users/${measurement.user_id}/measurements/${measurement.id}`)
//                     .set('Content-Type', 'application/json')
//                     .expect(200)
//                     .then(res => {
//                         expect(res.body).to.have.property('id')
//                         expect(res.body.id).to.eql(measurement.id)
//                         expect(res.body).to.have.property('value')
//                         expect(res.body.value).to.eql(measurement.value)
//                         expect(res.body).to.have.property('unit')
//                         expect(res.body.unit).to.eql(measurement.unit)
//                         expect(res.body).to.have.property('type')
//                         expect(res.body.type).to.eql(measurement.type)
//                         expect(res.body).to.have.property('device_id')
//                         expect(res.body.device_id).to.eql(measurement.device_id)
//                         expect(res.body).to.have.property('user_id')
//                         expect(res.body.user_id).to.eql(measurement.user_id)
//                     })
//             })
//         })
//
//         context('when measurement is not founded', () => {
//             it('should return status code 404 and message from measurement not found', () => {
//                 return request
//                     .get(`/users/${measurement.user_id}/measurements/${new ObjectID()}`)
//                     .set('Content-Type', 'application/json')
//                     .expect(404)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.MEASUREMENT.NOT_FOUND)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.MEASUREMENT.NOT_FOUND_DESC)
//                     })
//             })
//         })
//
//         context('when there are validation errors', () => {
//             it('should return status code 400 and message from invalid parameters', () => {
//                 return request
//                     .get('/users/123/measurements/321')
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
//                     })
//             })
//         })
//     })
//
//     describe('PATCH /users/:user_id/measurements/:measurement_id', () => {
//         context('when update a measurement from user', () => {
//             it('should return the updated measurement', () => {
//                 return request
//                     .patch(`/users/${measurement.user_id}/measurements/${measurement.id}`)
//                     .set('Content-Type', 'application/json')
//                     .send({})
//                     .expect(200)
//                     .then(res => {
//                         expect(res.body).to.have.property('id')
//                         expect(res.body.id).to.eql(measurement.id)
//                         expect(res.body).to.have.property('value')
//                         expect(res.body.value).to.eql(measurement.value)
//                         expect(res.body).to.have.property('unit')
//                         expect(res.body.unit).to.eql(measurement.unit)
//                         expect(res.body).to.have.property('type')
//                         expect(res.body.type).to.eql(measurement.type)
//                         expect(res.body).to.have.property('user_id')
//                         expect(res.body.user_id).to.eql(measurement.user_id)
//                     })
//             })
//         })
//
//         context('when measurement is not founded', () => {
//             it('should return status code 404 and message from measurement not found', () => {
//                 return request
//                     .patch(`/users/${new ObjectID()}/measurements/${new ObjectID()}`)
//                     .set('Content-Type', 'application/json')
//                     .send({})
//                     .expect(404)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.MEASUREMENT.NOT_FOUND)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.MEASUREMENT.NOT_FOUND_DESC)
//                     })
//             })
//         })
//
//         context('when there are validation errors', () => {
//             it('should return status code 400 and message from invalid parameters', () => {
//                 return request
//                     .patch('/users/123/measurements/321')
//                     .set('Content-Type', 'application/json')
//                     .send({})
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
//                     })
//             })
//         })
//     })
//
//     describe('GET /users/:user_id/measurements', () => {
//         context('when get all measurements from user', () => {
//             it('should return status code 200 and a list of measurements', () => {
//                 return request
//                     .get(`/users/${measurement.user_id}/measurements`)
//                     .set('Content-Type', 'application/json')
//                     .expect(200)
//                     .then(res => {
//                         expect(res.body).is.an.instanceOf(Array)
//                         expect(res.body.length).to.eql(1)
//                         expect(res.body[0]).to.have.property('id')
//                         expect(res.body[0].id).to.eql(measurement.id)
//                         expect(res.body[0]).to.have.property('value')
//                         expect(res.body[0].value).to.eql(measurement.value)
//                         expect(res.body[0]).to.have.property('unit')
//                         expect(res.body[0].unit).to.eql(measurement.unit)
//                         expect(res.body[0]).to.have.property('type')
//                         expect(res.body[0].type).to.eql(measurement.type)
//                         expect(res.body[0]).to.have.property('device_id')
//                         expect(res.body[0].device_id).to.eql(measurement.device_id)
//                         expect(res.body[0]).to.have.property('user_id')
//                         expect(res.body[0].user_id).to.eql(measurement.user_id)
//                     })
//             })
//         })
//
//         context('when there are validation errors', () => {
//             it('should return status code 400 and message from invalid parameters', () => {
//                 return request
//                     .get('/users/123/measurements')
//                     .send(measurement.toJSON())
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
//                     })
//             })
//         })
//     })
//
//     describe('DELETE /users/:user_id/measurements/:measurement_id', () => {
//         context('when delete a measurement from user', () => {
//             it('should return status code 204 and no content', () => {
//                 return request
//                     .delete(`/users/${measurement.user_id}/measurements/${measurement.id}`)
//                     .set('Content-Type', 'application/json')
//                     .expect(204)
//                     .then(res => {
//                         expect(res.body).to.eql({})
//                     })
//             })
//         })
//
//         context('when there are validation errors', () => {
//             it('should return status code 400 and message from invalid parameters', () => {
//                 return request
//                     .delete('/users/123/measurements/321')
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
//                     })
//             })
//         })
//     })
// })
//
// async function deleteAllMeasurements() {
//     return await MeasurementRepoModel.deleteMany({})
// }
//
// async function createDevice() {
//     return await DeviceRepoModel.create(DefaultEntityMock.DEVICE)
// }
//
// async function deleteAllDevices() {
//     return await DeviceRepoModel.deleteMany({})
// }
