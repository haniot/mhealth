import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { DataSetItem } from '../../../src/application/domain/model/data.set.item'

describe('Models: DataSetItem', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new DataSetItem().fromJSON(DefaultEntityMock.HEART_RATE.dataset[0])
                assert.propertyVal(result, 'value', DefaultEntityMock.HEART_RATE.dataset[0].value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEART_RATE.dataset[0].timestamp)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new DataSetItem().fromJSON(JSON.stringify(DefaultEntityMock.HEART_RATE.dataset[0]))
                assert.propertyVal(result, 'value', DefaultEntityMock.HEART_RATE.dataset[0].value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEART_RATE.dataset[0].timestamp)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new DataSetItem().fromJSON('')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new DataSetItem().fromJSON('invalid')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new DataSetItem().fromJSON(undefined)
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new DataSetItem().fromJSON({})
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new DataSetItem().fromJSON(DefaultEntityMock.HEART_RATE.dataset[0])
                const result = measurement.toJSON()
                assert.propertyVal(result, 'value', DefaultEntityMock.HEART_RATE.dataset[0].value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEART_RATE.dataset[0].timestamp)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new DataSetItem().toJSON()
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })
    })
})
