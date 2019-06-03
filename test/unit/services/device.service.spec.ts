import { DeviceService } from '../../../src/application/service/device.service'
import { DeviceRepositoryMock } from '../../mocks/repositories/device.repository.mock'
import { Device } from '../../../src/application/domain/model/device'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Query } from '../../../src/infrastructure/repository/query/query'

describe('Services: DeviceService', () => {
    const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)
    device.id = DefaultEntityMock.DEVICE.id
    const service = new DeviceService(new DeviceRepositoryMock())

    describe('add()', () => {
        context('when add a new device', () => {
            it('should return the saved device', () => {
                return service.add(device)
                    .then(result => {
                        assert.propertyVal(result, 'name', device.name)
                        assert.propertyVal(result, 'type', device.type)
                        assert.propertyVal(result, 'model_number', device.model_number)
                        assert.propertyVal(result, 'manufacturer', device.manufacturer)
                        assert.propertyVal(result, 'user_id', device.user_id)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.add(new Device())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.propertyVal(err, 'description', 'Device validation: name, address, ' +
                            'type, manufacturer, user_id required!')
                    })
            })
        })
    })

    describe('getAll', () => {
        context('when get all devices from user', () => {
            it('should return a list of devices', () => {
                return service.getAll(new Query().fromJSON({ filters: { user_id: device.user_id } }))
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 1)
                        assert.propertyVal(result[0], 'name', device.name)
                        assert.propertyVal(result[0], 'type', device.type)
                        assert.propertyVal(result[0], 'model_number', device.model_number)
                        assert.propertyVal(result[0], 'manufacturer', device.manufacturer)
                        assert.propertyVal(result[0], 'user_id', device.user_id)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.getAll(new Query().fromJSON({ filters: { user_id: '123' } }))
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should reject an error for empty parameters', () => {
                return service.getAll(new Query().fromJSON({ filters: { user_id: '' } }))
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when get a unique device', () => {
            it('should return a device', () => {
                return service.getById(device.id!, new Query().fromJSON({ filters: { user_id: device.user_id } }))
                    .then(result => {
                        assert.propertyVal(result, 'name', device.name)
                        assert.propertyVal(result, 'type', device.type)
                        assert.propertyVal(result, 'model_number', device.model_number)
                        assert.propertyVal(result, 'manufacturer', device.manufacturer)
                        assert.propertyVal(result, 'user_id', device.user_id)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.getById('321', new Query().fromJSON({ filters: { user_id: '123' } }))
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should reject an error for empty parameters', () => {
                return service.getById('', new Query())
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('update()', () => {
        context('when update a device', () => {
            it('should return the updated device', () => {
                device.user_id = undefined
                return service.update(device)
                    .then(result => {
                        assert.propertyVal(result, 'name', device.name)
                        assert.propertyVal(result, 'type', device.type)
                        assert.propertyVal(result, 'model_number', device.model_number)
                        assert.propertyVal(result, 'manufacturer', device.manufacturer)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                device.user_id = '123'
                return service.update(device)
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                        device.user_id = undefined
                    })
            })

            it('should reject an error for empty parameters', () => {
                device.id = ''
                return service.update(device)
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('removeDevice()', () => {
        context('when remove a device', () => {
            it('should return true', () => {
                device.id = DefaultEntityMock.DEVICE.id
                device.user_id = DefaultEntityMock.DEVICE.user_id
                return service.removeDevice(device.id!, device.user_id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.removeDevice('123', '321')
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should reject an error for empty parameters', () => {
                return service.removeDevice('', '')
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('remove()', () => {
        it('should throw an error for does not implemented', () => {
            return service
                .remove(device.id!)
                .catch(err => {
                    assert.propertyVal(err, 'message', 'Not implemented!')
            })
        })
    })
})