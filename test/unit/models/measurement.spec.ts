import { Measurement } from '../../../src/application/domain/model/measurement'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'

describe('Models: Measurement', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.MEASUREMENT.user_id)
                assert.isUndefined(result.type, 'no type defined')
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new Measurement().fromJSON(JSON.stringify(DefaultEntityMock.MEASUREMENT))
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.MEASUREMENT.user_id)
                assert.isUndefined(result.type, 'no type defined')
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON('')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.type, 'no type defined')
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON('invalid')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.type, 'no type defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON(undefined)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.type, 'no type defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON({})
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.type, 'no type defined')
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
                measurement.id = DefaultEntityMock.MEASUREMENT.id
                measurement.type = 'any_type'
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.MEASUREMENT.id)
                assert.propertyVal(result, 'type', 'any_type')
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.MEASUREMENT.user_id)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new Measurement().toJSON()
                assert.propertyVal(result, 'id', undefined)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.type, 'no type defined')
                assert.isUndefined(result.id, 'no id defined')
            })
        })
    })
})
