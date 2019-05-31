import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'

describe('Models: WaistCircumference', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WAIST_CIRCUMFERENCE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WAIST_CIRCUMFERENCE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WAIST_CIRCUMFERENCE.timestamp)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new WaistCircumference().fromJSON(JSON.stringify(DefaultEntityMock.WAIST_CIRCUMFERENCE))
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WAIST_CIRCUMFERENCE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WAIST_CIRCUMFERENCE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WAIST_CIRCUMFERENCE.timestamp)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new WaistCircumference().fromJSON('')
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new WaistCircumference().fromJSON('invalid')
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new WaistCircumference().fromJSON(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new WaistCircumference().fromJSON({})
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
                measurement.id = DefaultEntityMock.WAIST_CIRCUMFERENCE.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.WAIST_CIRCUMFERENCE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WAIST_CIRCUMFERENCE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WAIST_CIRCUMFERENCE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WAIST_CIRCUMFERENCE.timestamp)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new WaistCircumference().toJSON()
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })
    })
})
