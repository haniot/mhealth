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
                assert.deepPropertyVal(result, 'patient_id', DefaultEntityMock.DEVICE.patient_id)
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
                assert.deepPropertyVal(result, 'patient_id', DefaultEntityMock.DEVICE.patient_id)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Device().fromJSON('')
                assert.isUndefined(result.name, 'no name defined')
                assert.isUndefined(result.address, 'no address defined')
                assert.isUndefined(result.type, 'no name type')
                assert.isUndefined(result.model_number, 'no model_number defined')
                assert.isUndefined(result.manufacturer, 'no manufacturer defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Device().fromJSON('invalid')
                assert.isUndefined(result.name, 'no name defined')
                assert.isUndefined(result.address, 'no address defined')
                assert.isUndefined(result.type, 'no name type')
                assert.isUndefined(result.model_number, 'no model_number defined')
                assert.isUndefined(result.manufacturer, 'no manufacturer defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Device().fromJSON(undefined)
                assert.isUndefined(result.name, 'no name defined')
                assert.isUndefined(result.address, 'no address defined')
                assert.isUndefined(result.type, 'no name type')
                assert.isUndefined(result.model_number, 'no model_number defined')
                assert.isUndefined(result.manufacturer, 'no manufacturer defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Device().fromJSON({})
                assert.isUndefined(result.name, 'no name defined')
                assert.isUndefined(result.address, 'no address defined')
                assert.isUndefined(result.type, 'no name type')
                assert.isUndefined(result.model_number, 'no model_number defined')
                assert.isUndefined(result.manufacturer, 'no manufacturer defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
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
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new Device().toJSON()
                assert.isUndefined(result.name, 'no name defined')
                assert.isUndefined(result.address, 'no address defined')
                assert.isUndefined(result.type, 'no name type')
                assert.isUndefined(result.model_number, 'no model_number defined')
                assert.isUndefined(result.manufacturer, 'no manufacturer defined')
            })
        })
    })
})
