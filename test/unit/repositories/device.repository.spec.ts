import {DefaultEntityMock} from '../../mocks/models/default.entity.mock'
import {Device} from '../../../src/application/domain/model/device'
import sinon from 'sinon'
import {DeviceRepository} from '../../../src/infrastructure/repository/device.repository'
import {DeviceRepoModel} from '../../../src/infrastructure/database/schema/device.schema'
import {EntityMapperMock} from '../../mocks/models/entity.mapper.mock'
import {CustomLoggerMock} from '../../mocks/custom.logger.mock'
import {assert} from 'chai'
import {Query} from '../../../src/infrastructure/repository/query/query'

require('sinon-mongoose')

describe('Repositories: DeviceRepository', () => {
    const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)
    device.id = DefaultEntityMock.DEVICE.id
    const modelFake: any = DeviceRepoModel
    const repo = new DeviceRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())

    afterEach(() => {
        sinon.restore()
    })

    describe('create()', () => {
        context('when save a new device', () => {
            it('should return the saved device', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(device)
                    .chain('exec')
                    .resolves(device)

                return repo.create(device)
                    .then(result => {
                        assert.propertyVal(result, 'name', device.name)
                        assert.propertyVal(result, 'type', device.type)
                        assert.propertyVal(result, 'model_number', device.model_number)
                        assert.propertyVal(result, 'manufacturer', device.manufacturer)
                        assert.deepPropertyVal(result, 'user_id', device.user_id)
                    })
            })
        })

        context('when the device is not saved', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(device)
                    .chain('exec')
                    .resolves(undefined)

                return repo.create(device)
                    .then(result => {
                        assert.isUndefined(result, 'no result defined')
                    })
            })

        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(device)
                    .chain('exec')
                    .rejects({message: 'An internal error has occurred in the database!'})

                return repo.create(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })

            it('should reject a error in validation', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(device)
                    .chain('exec')
                    .rejects({name: 'ValidationError'})

                return repo.create(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Required fields were not provided!')
                    })
            })

            it('should reject a error in cast', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(device)
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.create(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'The given ID is in invalid format.')
                    })
            })

            it('should reject a error in mongo', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(device)
                    .chain('exec')
                    .rejects({name: 'MongoError', code: 11000})

                return repo.create(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'A registration with the same unique data already exists!')
                    })
            })

            it('should reject a error in parameter', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(device)
                    .chain('exec')
                    .rejects({name: 'ObjectParameterError'})

                return repo.create(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Invalid query parameters!')
                    })
            })
        })
    })

    describe('find()', () => {
        context('when want get all devices', () => {
            it('should return a list of devices', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .resolves([device])

                return repo.find(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 1)
                        assert.propertyVal(result[0], 'name', device.name)
                        assert.propertyVal(result[0], 'type', device.type)
                        assert.propertyVal(result[0], 'model_number', device.model_number)
                        assert.propertyVal(result[0], 'manufacturer', device.manufacturer)
                        assert.deepPropertyVal(result[0], 'user_id', device.user_id)
                    })
            })
        })

        context('when there are no devices', () => {
            it('should return empty array', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .resolves([])

                return repo.find(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 0)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .rejects({message: 'An internal error has occurred in the database!'})

                return repo.find(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })

            it('should reject a error in validation', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .rejects({name: 'ValidationError'})

                return repo.find(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Required fields were not provided!')
                    })
            })

            it('should reject a error in cast', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.find(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'The given ID is in invalid format.')
                    })
            })

            it('should reject a error in mongo', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .rejects({name: 'MongoError', code: 11000})

                return repo.find(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'A registration with the same unique data already exists!')
                    })
            })

            it('should reject a error in parameter', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('exec')
                    .rejects({name: 'ObjectParameterError'})

                return repo.find(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Invalid query parameters!')
                    })
            })
        })
    })
    describe('findOne()', () => {
        context('when get a unique device', () => {
            it('should return a device', () => {
                const query = new Query()
                query.addFilter({_id: device.id})

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({_id: device.id})
                    .chain('select')
                    .chain('exec')
                    .resolves(device)

                return repo.findOne(query)
                    .then(result => {
                        assert.propertyVal(result, 'name', device.name)
                        assert.propertyVal(result, 'type', device.type)
                        assert.propertyVal(result, 'model_number', device.model_number)
                        assert.propertyVal(result, 'manufacturer', device.manufacturer)
                        assert.deepPropertyVal(result, 'user_id', device.user_id)
                    })
            })
        })

        context('when the device is not found', () => {
            it('should return undefined', () => {
                const query = new Query()
                query.addFilter({_id: device.id})

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({_id: device.id})
                    .chain('select')
                    .chain('exec')
                    .resolves(undefined)

                return repo.findOne(query)
                    .then(result => {
                        assert.isUndefined(result, 'no result defined')
                    })
            })
        })

        context('when a database error occurs', () => {
            const query = new Query()
            query.addFilter({_id: device.id})

            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({_id: device.id})
                    .chain('select')
                    .chain('exec')
                    .rejects({message: 'An internal error has occurred in the database!'})

                return repo.findOne(query)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
            it('should reject a error in validation', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({_id: device.id})
                    .chain('select')
                    .chain('exec')
                    .rejects({name: 'ValidationError'})

                return repo.findOne(query)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Required fields were not provided!')
                    })
            })

            it('should reject a error in cast', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({_id: device.id})
                    .chain('select')
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.findOne(query)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'The given ID is in invalid format.')
                    })
            })

            it('should reject a error in mongo', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({_id: device.id})
                    .chain('select')
                    .chain('exec')
                    .rejects({name: 'MongoError', code: 11000})

                return repo.findOne(query)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'A registration with the same unique data already exists!')
                    })
            })

            it('should reject a error in parameter', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({_id: device.id})
                    .chain('select')
                    .chain('exec')
                    .rejects({name: 'ObjectParameterError'})

                return repo.findOne(query)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Invalid query parameters!')
                    })
            })
        })

    })

    describe('update()', () => {
        context('when update a device', () => {
            it('should return the updated device', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: device.id}, device, {new: true})
                    .chain('exec')
                    .resolves(device)

                return repo.update(device)
                    .then(result => {
                        assert.propertyVal(result, 'name', device.name)
                        assert.propertyVal(result, 'type', device.type)
                        assert.propertyVal(result, 'model_number', device.model_number)
                        assert.propertyVal(result, 'manufacturer', device.manufacturer)
                        assert.deepPropertyVal(result, 'user_id', device.user_id)
                    })
            })
        })

        context('when the device is not found', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: device.id}, device, {new: true})
                    .chain('exec')
                    .resolves(undefined)

                return repo.update(device)
                    .then(result => {
                        assert.isUndefined(result, 'no result defined')
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: device.id}, device, {new: true})
                    .chain('exec')
                    .rejects({message: 'An internal error has occurred in the database!'})

                return repo.update(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
            it('should reject a error in validation', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: device.id}, device, {new: true})
                    .chain('exec')
                    .rejects({name: 'ValidationError'})

                return repo.update(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Required fields were not provided!')
                    })
            })

            it('should reject a error in cast', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: device.id}, device, {new: true})
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.update(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'The given ID is in invalid format.')
                    })
            })

            it('should reject a error in mongo', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: device.id}, device, {new: true})
                    .chain('exec')
                    .rejects({name: 'MongoError', code: 11000})

                return repo.update(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'A registration with the same unique data already exists!')
                    })
            })

            it('should reject a error in parameter', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({_id: device.id}, device, {new: true})
                    .chain('exec')
                    .rejects({name: 'ObjectParameterError'})

                return repo.update(device)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Invalid query parameters!')
                    })
            })
        })
    })

    describe('delete()', () => {
        context('when remove a device', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: device.id})
                    .chain('exec')
                    .resolves(true)

                return repo.delete(device.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when the device is not found', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: device.id})
                    .chain('exec')
                    .resolves(false)

                return repo.delete(device.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: device.id})
                    .chain('exec')
                    .rejects({message: 'An internal error has occurred in the database!'})

                return repo.delete(device.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
            it('should reject a error in validation', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: device.id})
                    .chain('exec')
                    .rejects({name: 'ValidationError'})

                return repo.delete(device.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Required fields were not provided!')
                    })
            })

            it('should reject a error in cast', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: device.id})
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.delete(device.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'The given ID is in invalid format.')
                    })
            })

            it('should reject a error in mongo', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: device.id})
                    .chain('exec')
                    .rejects({name: 'MongoError', code: 11000})

                return repo.delete(device.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'A registration with the same unique data already exists!')
                    })
            })

            it('should reject a error in parameter', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({_id: device.id})
                    .chain('exec')
                    .rejects({name: 'ObjectParameterError'})

                return repo.delete(device.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Invalid query parameters!')
                    })
            })
        })
    })

    describe('count()', () => {
        context('when count all devices by a filter', () => {
            it('should return the number of devices', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .resolves(1)

                return repo.count(new Query())
                    .then(result => {
                        assert.isNumber(result)
                        assert.equal(result, 1)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .rejects({message: 'An internal error has occurred in the database!'})

                return repo.count(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
            it('should reject a error in validation', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .rejects({name: 'ValidationError'})

                return repo.count(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Required fields were not provided!')
                    })
            })

            it('should reject a error in cast', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .rejects({name: 'CastError'})

                return repo.count(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'The given ID is in invalid format.')
                    })
            })

            it('should reject a error in mongo', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .rejects({name: 'MongoError', code: 11000})

                return repo.count(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'A registration with the same unique data already exists!')
                    })
            })

            it('should reject a error in parameter', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .rejects({name: 'ObjectParameterError'})

                return repo.count(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'Invalid query parameters!')
                    })
            })
        })
    })

    describe('checkExists()', () => {
        context('when the device exists', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({address: device.address})
                    .chain('select')
                    .chain('exec')
                    .resolves(device)

                return repo.checkExists(device.address!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when the device does not exists', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({address: device.address})
                    .chain('select')
                    .chain('exec')
                    .resolves(undefined)

                return repo.checkExists(device.address!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({address: device.address})
                    .chain('select')
                    .chain('exec')
                    .rejects({message: 'An internal error has occurred in the database!'})

                return repo.checkExists(device.address!)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })
})
