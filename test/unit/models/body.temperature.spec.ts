import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'

describe('Models: BodyTemperature', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_TEMPERATURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_TEMPERATURE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BODY_TEMPERATURE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_TEMPERATURE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_TEMPERATURE.timestamp)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new BodyTemperature().fromJSON(JSON.stringify(DefaultEntityMock.BODY_TEMPERATURE))
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_TEMPERATURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_TEMPERATURE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BODY_TEMPERATURE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_TEMPERATURE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_TEMPERATURE.timestamp)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BodyTemperature().fromJSON('')
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BodyTemperature().fromJSON('invalid')
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BodyTemperature().fromJSON(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BodyTemperature().fromJSON({})
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
                measurement.id = DefaultEntityMock.BODY_TEMPERATURE.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.BODY_TEMPERATURE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_TEMPERATURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_TEMPERATURE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BODY_TEMPERATURE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_TEMPERATURE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_TEMPERATURE.timestamp)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new BodyTemperature().toJSON()
                assert.isUndefined(result.id, 'no id defined')
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })
    })
})
