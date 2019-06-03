import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'

describe('Models: BloodPressure', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
                assert.propertyVal(result, 'systolic', DefaultEntityMock.BLOOD_PRESSURE.systolic)
                assert.propertyVal(result, 'diastolic', DefaultEntityMock.BLOOD_PRESSURE.diastolic)
                assert.propertyVal(result, 'pulse', DefaultEntityMock.BLOOD_PRESSURE.pulse)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_PRESSURE.timestamp)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_PRESSURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_PRESSURE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.BLOOD_PRESSURE.user_id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new BloodPressure().fromJSON(JSON.stringify(DefaultEntityMock.BLOOD_PRESSURE))
                assert.propertyVal(result, 'systolic', DefaultEntityMock.BLOOD_PRESSURE.systolic)
                assert.propertyVal(result, 'diastolic', DefaultEntityMock.BLOOD_PRESSURE.diastolic)
                assert.propertyVal(result, 'pulse', DefaultEntityMock.BLOOD_PRESSURE.pulse)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_PRESSURE.timestamp)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_PRESSURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_PRESSURE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.BLOOD_PRESSURE.user_id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BloodPressure().fromJSON('')
                assert.propertyVal(result, 'systolic', undefined)
                assert.propertyVal(result, 'diastolic', undefined)
                assert.propertyVal(result, 'pulse', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BloodPressure().fromJSON('invalid')
                assert.propertyVal(result, 'systolic', undefined)
                assert.propertyVal(result, 'diastolic', undefined)
                assert.propertyVal(result, 'pulse', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BloodPressure().fromJSON(undefined)
                assert.propertyVal(result, 'systolic', undefined)
                assert.propertyVal(result, 'diastolic', undefined)
                assert.propertyVal(result, 'pulse', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BloodPressure().fromJSON({})
                assert.propertyVal(result, 'systolic', undefined)
                assert.propertyVal(result, 'diastolic', undefined)
                assert.propertyVal(result, 'pulse', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
                measurement.id = DefaultEntityMock.BLOOD_PRESSURE.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.BLOOD_PRESSURE.id)
                assert.propertyVal(result, 'systolic', DefaultEntityMock.BLOOD_PRESSURE.systolic)
                assert.propertyVal(result, 'diastolic', DefaultEntityMock.BLOOD_PRESSURE.diastolic)
                assert.propertyVal(result, 'pulse', DefaultEntityMock.BLOOD_PRESSURE.pulse)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_PRESSURE.timestamp)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_PRESSURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_PRESSURE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.BLOOD_PRESSURE.user_id)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new BloodPressure().toJSON()
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'systolic', undefined)
                assert.propertyVal(result, 'diastolic', undefined)
                assert.propertyVal(result, 'pulse', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })
        })
    })
})
