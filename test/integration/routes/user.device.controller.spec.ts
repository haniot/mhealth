import { App } from '../../../src/app'
import { Identifier } from '../../../src/di/identifiers'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Container } from 'inversify'
import { DeviceRepoModel } from '../../../src/infrastructure/database/schema/device.schema'
import { Device } from '../../../src/application/domain/model/device'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { expect } from 'chai'
import { ObjectID } from 'bson'
import { Strings } from '../../../src/utils/strings'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: UserDevice', () => {

    const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)
    const user_id: string = DefaultEntityMock.DEVICE.user_id[0]

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllDevices()
            } catch (err) {
                throw new Error('Failure on UserDevice test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllDevices()
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on UserDevice test: ' + err.message)
        }
    })

    describe('POST /users/:user_id/devices', () => {
        context('when save a device from user', () => {
            it('should return status code 201 and the created device', () => {
                return request
                    .post(`/users/${user_id}/devices`)
                    .send(device.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('name', device.name)
                        expect(res.body).to.have.property('address', device.address)
                        expect(res.body).to.have.property('type', device.type)
                        expect(res.body).to.have.property('model_number', device.model_number)
                        expect(res.body).to.have.property('manufacturer', device.manufacturer)
                        device.id = res.body.id
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .post('/users/123/devices')
                    .send(device.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('GET /users/:user_id/devices/:device_id', () => {
        context('when get a unique device from user', () => {
            it('should return status code 200 and a device', () => {
                return request
                    .get(`/users/${user_id}/devices/${device.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', device.id)
                        expect(res.body).to.have.property('name', device.name)
                        expect(res.body).to.have.property('address', device.address)
                        expect(res.body).to.have.property('type', device.type)
                        expect(res.body).to.have.property('model_number', device.model_number)
                        expect(res.body).to.have.property('manufacturer', device.manufacturer)
                    })
            })
        })

        context('when device is not founded', () => {
            it('should return status code 404 and message from device not found', () => {
                return request
                    .get(`/users/${user_id}/devices/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.DEVICE.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.DEVICE.NOT_FOUND_DESC)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .get('/users/123/devices/321')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('PATCH /users/:user_id/devices/:device_id', () => {
        context('when update a device from user', () => {
            it('should return the updated device', () => {
                return request
                    .patch(`/users/${user_id}/devices/${device.id}`)
                    .set('Content-Type', 'application/json')
                    .send(device.toJSON())
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id', device.id)
                        expect(res.body).to.have.property('name', device.name)
                        expect(res.body).to.have.property('address', device.address)
                        expect(res.body).to.have.property('type', device.type)
                        expect(res.body).to.have.property('model_number', device.model_number)
                        expect(res.body).to.have.property('manufacturer', device.manufacturer)
                    })
            })
        })

        context('when device is not founded', () => {
            it('should return status code 404 and message from device not found', () => {
                return request
                    .patch(`/users/${new ObjectID()}/devices/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .send(device.toJSON())
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.DEVICE.NOT_FOUND)
                        expect(res.body).to.have.property('description', Strings.DEVICE.NOT_FOUND_DESC)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .patch('/users/123/devices/321')
                    .set('Content-Type', 'application/json')
                    .send(device.toJSON())
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('GET /users/:user_id/devices', () => {
        context('when get all devices from user', () => {
            it('should return status code 200 and a list of devices', () => {
                return request
                    .get(`/users/${user_id}/devices`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).is.an.instanceOf(Array)
                        expect(res.body.length).to.eql(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0]).to.have.property('name', device.name)
                        expect(res.body[0]).to.have.property('address', device.address)
                        expect(res.body[0]).to.have.property('type', device.type)
                        expect(res.body[0]).to.have.property('model_number', device.model_number)
                        expect(res.body[0]).to.have.property('manufacturer', device.manufacturer)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid parameters', () => {
                return request
                    .get('/users/123/devices')
                    .send(device.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('DELETE /users/:user_id/devices/:device_id', () => {
        context('when delete a device from user', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/users/${user_id}/devices/${device.id}`)
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
                    .delete('/users/123/devices/321')
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

async function deleteAllDevices() {
    return await DeviceRepoModel.deleteMany({})
}
