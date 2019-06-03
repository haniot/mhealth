import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { HeartRate } from '../../../src/application/domain/model/heart.rate'
import { DataSetItem } from '../../../src/application/domain/model/data.set.item'

describe('Models: HeartRate', () => {
    const dataset = DefaultEntityMock.HEART_RATE.dataset.map(item => new DataSetItem().fromJSON(item))
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new HeartRate().fromJSON(DefaultEntityMock.HEART_RATE)
                assert.deepPropertyVal(result, 'dataset', dataset)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEART_RATE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEART_RATE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.HEART_RATE.user_id)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new HeartRate().fromJSON(JSON.stringify(DefaultEntityMock.HEART_RATE))
                assert.deepPropertyVal(result, 'dataset', dataset)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEART_RATE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEART_RATE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.HEART_RATE.user_id)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new HeartRate().fromJSON('')
                assert.propertyVal(result, 'dataset', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new HeartRate().fromJSON('invalid')
                assert.propertyVal(result, 'dataset', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new HeartRate().fromJSON(undefined)
                assert.propertyVal(result, 'dataset', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new HeartRate().fromJSON({})
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new HeartRate().fromJSON(DefaultEntityMock.HEART_RATE)
                measurement.id = DefaultEntityMock.HEART_RATE.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.HEART_RATE.id)
                assert.deepPropertyVal(result, 'dataset', DefaultEntityMock.HEART_RATE.dataset)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEART_RATE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEART_RATE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.HEART_RATE.user_id)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new HeartRate().toJSON()
                assert.propertyVal(result, 'id', undefined)
                assert.deepPropertyVal(result, 'dataset', [])
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })
    })
})
