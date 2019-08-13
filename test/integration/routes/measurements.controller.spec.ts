import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { expect } from 'chai'
import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { DIContainer } from '../../../src/di/di'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Measurement', () => {

    const measurement: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllMeasurements()
                const result = await createMeasurement()
                measurement.id = result._id.toString()
            } catch (err) {
                throw new Error('Failure on Measurement test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllMeasurements()
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on Measurement test: ' + err.message)
        }
    })

    describe('GET /v1/measurements', () => {
        context('when get all measurements', () => {
            it('should return status code 200 and a list of measurements', () => {
                return request
                    .get('/v1/measurements')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).is.an.instanceOf(Array)
                        expect(res.body.length).to.eql(1)
                        expect(res.body[0]).to.have.property('id', measurement.id)
                        expect(res.body[0]).to.have.property('value', measurement.value)
                        expect(res.body[0]).to.have.property('unit', measurement.unit)
                        expect(res.body[0]).to.have.property('type', measurement.type)
                        expect(res.body[0]).to.have.property('device_id', measurement.device_id)
                        expect(res.body[0]).to.have.property('patient_id', measurement.patient_id)
                        expect(res.body[0]).to.have.property('meal', measurement.meal)
                    })
            })
        })

        context('when there are no measurements', () => {
            it('should return status code 200 and a empty list', async () => {
                await deleteAllMeasurements().then()
                return request
                    .get('/v1/measurements')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).is.an.instanceOf(Array)
                        expect(res.body.length).to.eql(0)
                    })
            })
        })
    })
})

async function createMeasurement() {
    return await MeasurementRepoModel.create(DefaultEntityMock.BLOOD_GLUCOSE)
}

async function deleteAllMeasurements() {
    return await MeasurementRepoModel.deleteMany({})
}
