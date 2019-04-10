import { Measurement } from '../../../src/application/domain/model/measurement'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'

describe('Models: Measurement', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const measurement = Object.assign({}, DefaultEntityMock.MEASUREMENT)
                measurement.measurements = [Object.assign({}, DefaultEntityMock.MEASUREMENT_TEMPERATURE)]
                measurement.contexts = [Object.assign({}, DefaultEntityMock.CONTEXT)]
                const result = new Measurement().fromJSON(measurement)
                assert.propertyVal(result, 'value', DefaultEntityMock.MEASUREMENT.value)
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'type', DefaultEntityMock.MEASUREMENT.type)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.MEASUREMENT.user_id)
                assert.lengthOf(result.measurements!, 1)
                assert.lengthOf(result.contexts!, 1)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new Measurement().fromJSON(JSON.stringify(DefaultEntityMock.MEASUREMENT))
                assert.propertyVal(result, 'value', DefaultEntityMock.MEASUREMENT.value)
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'type', DefaultEntityMock.MEASUREMENT.type)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.MEASUREMENT.user_id)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON('')
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON('invalid')
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON(undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON({})
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })
    })
    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
                const result = measurement.toJSON()
                assert.propertyVal(result, 'value', DefaultEntityMock.MEASUREMENT.value)
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'type', DefaultEntityMock.MEASUREMENT.type)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.MEASUREMENT.user_id)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new Measurement().toJSON()
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })
    })
})
