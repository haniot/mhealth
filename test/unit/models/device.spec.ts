import { Device } from '../../../src/application/domain/model/device'
import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('Models: Device', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new Device().fromJSON(DefaultEntityMock.DEVICE)
                assert.propertyVal(result, 'name', DefaultEntityMock.DEVICE.name)
                assert.propertyVal(result, 'address', DefaultEntityMock.DEVICE.address)
                assert.propertyVal(result, 'type', DefaultEntityMock.DEVICE.type)
                assert.propertyVal(result, 'model_number', DefaultEntityMock.DEVICE.model_number)
                assert.propertyVal(result, 'manufacturer', DefaultEntityMock.DEVICE.manufacturer)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.DEVICE.user_id)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new Device().fromJSON(JSON.stringify(DefaultEntityMock.DEVICE))
                assert.propertyVal(result, 'name', DefaultEntityMock.DEVICE.name)
                assert.propertyVal(result, 'address', DefaultEntityMock.DEVICE.address)
                assert.propertyVal(result, 'type', DefaultEntityMock.DEVICE.type)
                assert.propertyVal(result, 'model_number', DefaultEntityMock.DEVICE.model_number)
                assert.propertyVal(result, 'manufacturer', DefaultEntityMock.DEVICE.manufacturer)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.DEVICE.user_id)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Device().fromJSON('')
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'address', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'model_number', undefined)
                assert.propertyVal(result, 'manufacturer', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Device().fromJSON('invalid')
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'address', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'model_number', undefined)
                assert.propertyVal(result, 'manufacturer', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Device().fromJSON(undefined)
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'address', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'model_number', undefined)
                assert.propertyVal(result, 'manufacturer', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Device().fromJSON({})
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'address', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'model_number', undefined)
                assert.propertyVal(result, 'manufacturer', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })
    })
    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)
                const result = device.toJSON()
                assert.propertyVal(result, 'name', DefaultEntityMock.DEVICE.name)
                assert.propertyVal(result, 'address', DefaultEntityMock.DEVICE.address)
                assert.propertyVal(result, 'type', DefaultEntityMock.DEVICE.type)
                assert.propertyVal(result, 'model_number', DefaultEntityMock.DEVICE.model_number)
                assert.propertyVal(result, 'manufacturer', DefaultEntityMock.DEVICE.manufacturer)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.DEVICE.user_id)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new Device().toJSON()
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'address', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'model_number', undefined)
                assert.propertyVal(result, 'manufacturer', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })
    })
})
