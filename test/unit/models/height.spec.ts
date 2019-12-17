import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Height } from '../../../src/application/domain/model/height'

describe('Models: Height', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new Height().fromJSON(DefaultEntityMock.HEIGHT)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEIGHT.device_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.HEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEIGHT.timestamp)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new Height().fromJSON(JSON.stringify(DefaultEntityMock.HEIGHT))
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEIGHT.device_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.HEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEIGHT.timestamp)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Height().fromJSON('')
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Height().fromJSON('invalid')
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Height().fromJSON(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Height().fromJSON({})
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })
    })

    describe('toJSON()', () => {
        context('when convert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new Height().fromJSON(DefaultEntityMock.HEIGHT)
                measurement.id = DefaultEntityMock.HEIGHT.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.HEIGHT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEIGHT.device_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.HEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEIGHT.timestamp)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new Height().toJSON()
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.id, 'no id defined')
            })
        })
    })
})
