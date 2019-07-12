import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Weight } from '../../../src/application/domain/model/weight'
import { Fat } from '../../../src/application/domain/model/fat'

describe('Models: Weight', () => {
    const fat = new Fat().fromJSON(DefaultEntityMock.WEIGHT.fat)
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WEIGHT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.WEIGHT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WEIGHT.timestamp)
                assert.deepPropertyVal(result, 'fat', fat)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new Weight().fromJSON(JSON.stringify(DefaultEntityMock.WEIGHT))
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WEIGHT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.WEIGHT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WEIGHT.timestamp)
                assert.deepPropertyVal(result, 'fat', fat)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Weight().fromJSON('')
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.fat, 'no fat defined')

            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Weight().fromJSON('invalid')
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.fat, 'no fat defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Weight().fromJSON(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.fat, 'no fat defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Weight().fromJSON({})
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.fat, 'no fat defined')
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
                measurement.id = DefaultEntityMock.WEIGHT.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.WEIGHT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WEIGHT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.WEIGHT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WEIGHT.timestamp)
                assert.deepPropertyVal(result, 'fat', DefaultEntityMock.WEIGHT.fat)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new Weight().toJSON()
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.fat, 'no fat defined')
                assert.isUndefined(result.id, 'no id defined')
            })
        })
    })
})
