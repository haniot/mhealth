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
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new Measurement().fromJSON(JSON.stringify(DefaultEntityMock.MEASUREMENT))
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.MEASUREMENT.user_id)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON('')
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON('invalid')
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON(undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Measurement().fromJSON({})
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
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
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })
    })
})
