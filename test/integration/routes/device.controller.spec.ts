import { Device } from '../../../src/application/domain/model/device'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { DeviceRepoModel } from '../../../src/infrastructure/database/schema/device.schema'
import { expect } from 'chai'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Device', () => {

    const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllDevices()
                const result = await createDevice()
                device.id = result._id.toString()
            } catch (err) {
                throw new Error('Failure on Device test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllDevices()
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on Device test: ' + err.message)
        }
    })

    describe('GET /devices', () => {
        context('when get all devices', () => {
            it('should return status code 200 and a list of devices', () => {
                return request
                    .get('/devices')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).is.an.instanceOf(Array)
                        expect(res.body.length).to.eql(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0]).to.have.property('name')
                        expect(res.body[0].name).to.eql(device.name)
                        expect(res.body[0]).to.have.property('type')
                        expect(res.body[0].type).to.eql(device.type)
                        expect(res.body[0]).to.have.property('model_number')
                        expect(res.body[0].model_number).to.eql(device.model_number)
                        expect(res.body[0]).to.have.property('manufacturer')
                        expect(res.body[0].manufacturer).to.eql(device.manufacturer)
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
