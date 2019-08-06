import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { BodyFat } from '../../../src/application/domain/model/body.fat'

describe('Models: BodyFat', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_FAT.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BODY_FAT.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_FAT.timestamp)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new BodyFat().fromJSON(JSON.stringify(DefaultEntityMock.BODY_FAT))
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_FAT.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BODY_FAT.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_FAT.timestamp)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BodyFat().fromJSON('')
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BodyFat().fromJSON('invalid')
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BodyFat().fromJSON(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new BodyFat().fromJSON({})
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
                measurement.id = DefaultEntityMock.BODY_FAT.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.BODY_FAT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_FAT.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BODY_FAT.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_FAT.timestamp)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new BodyFat().toJSON()
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.id, 'no id defined')
            })
        })
    })
})
