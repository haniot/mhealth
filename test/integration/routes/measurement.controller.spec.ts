// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { Container } from 'inversify'
// import { DI } from '../../../src/di/di'
// import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
// import { Identifier } from '../../../src/di/identifiers'
// import { App } from '../../../src/app'
// import { expect } from 'chai'
// import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
// import { Measurement } from '../../../src/application/domain/model/measurement'
//
// const container: Container = DI.getInstance().getContainer()
// const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
// const app: App = container.get(Identifier.APP)
// const request = require('supertest')(app.getExpress())
//
// describe('Routes: Measurement', () => {
//
//     const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
//
//     before(async () => {
//             try {
//                 await dbConnection.tryConnect(0, 500)
//                 await deleteAllMeasurements()
//                 const result = await createMeasurement()
//                 measurement.id = result._id.toString()
//             } catch (err) {
//                 throw new Error('Failure on Measurement test: ' + err.message)
//             }
//         }
//     )
//
//     after(async () => {
//         try {
//             await deleteAllMeasurements()
//             await dbConnection.dispose()
//         } catch (err) {
//             throw new Error('Failure on Measurement test: ' + err.message)
//         }
//     })
//
//     describe('GET /measurements', () => {
//         context('when get all measurements', () => {
//             it('should return status code 200 and a list of measurements', () => {
//                 return request
//                     .get('/measurements')
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
//     })
// })
//
// async function createMeasurement() {
//     return await MeasurementRepoModel.create(DefaultEntityMock.MEASUREMENT)
// }
//
// async function deleteAllMeasurements() {
//     return await MeasurementRepoModel.deleteMany({})
// }
