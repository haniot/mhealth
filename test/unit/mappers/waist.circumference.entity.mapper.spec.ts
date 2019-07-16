import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'
import { WaistCircumferenceEntityMapper } from '../../../src/infrastructure/entity/mapper/waist.circumference.entity.mapper'
import { WaistCircumferenceEntity } from '../../../src/infrastructure/entity/waist.circumference.entity'

describe('Mappers: WaistCircumferenceEntityMapper', () => {
    const mapper: WaistCircumferenceEntityMapper = new WaistCircumferenceEntityMapper()
    const measurement: WaistCircumference = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
    measurement.id = DefaultEntityMock.WAIST_CIRCUMFERENCE.id
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.WAIST_CIRCUMFERENCE)
                assert.propertyVal(result, 'id', DefaultEntityMock.WAIST_CIRCUMFERENCE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WAIST_CIRCUMFERENCE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WAIST_CIRCUMFERENCE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WAIST_CIRCUMFERENCE.timestamp)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.isUndefined(result.id, 'no id defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.isUndefined(result.id, 'no id defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'id', DefaultEntityMock.WAIST_CIRCUMFERENCE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.WAIST_CIRCUMFERENCE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WAIST_CIRCUMFERENCE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.WAIST_CIRCUMFERENCE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WAIST_CIRCUMFERENCE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WAIST_CIRCUMFERENCE.timestamp)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: WaistCircumference = new WaistCircumference()
                emptyMeasurement.type = undefined
                const result = mapper.transform(emptyMeasurement)
                assert.isEmpty(result)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new WaistCircumferenceEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
