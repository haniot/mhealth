import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'

describe('Models: BloodGlucose', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_GLUCOSE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_GLUCOSE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BLOOD_GLUCOSE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BLOOD_GLUCOSE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_GLUCOSE.timestamp)
                assert.propertyVal(result, 'meal', DefaultEntityMock.BLOOD_GLUCOSE.meal)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new BloodGlucose().fromJSON(JSON.stringify(DefaultEntityMock.BLOOD_GLUCOSE))
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_GLUCOSE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_GLUCOSE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BLOOD_GLUCOSE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BLOOD_GLUCOSE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_GLUCOSE.timestamp)
                assert.propertyVal(result, 'meal', DefaultEntityMock.BLOOD_GLUCOSE.meal)

            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BloodGlucose().fromJSON('')
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.meal, 'no meal defined')

            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BloodGlucose().fromJSON('invalid')
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.meal, 'no meal defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BloodGlucose().fromJSON(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.meal, 'no meal defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BloodGlucose().fromJSON({})
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.meal, 'no meal defined')
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
                measurement.id = DefaultEntityMock.BLOOD_GLUCOSE.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.BLOOD_GLUCOSE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_GLUCOSE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_GLUCOSE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BLOOD_GLUCOSE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BLOOD_GLUCOSE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_GLUCOSE.timestamp)
                assert.propertyVal(result, 'meal', DefaultEntityMock.BLOOD_GLUCOSE.meal)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new BloodGlucose().toJSON()
                assert.isUndefined(result.id, 'no id defined')
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.meal, 'no meal defined')
            })
        })
    })
})
