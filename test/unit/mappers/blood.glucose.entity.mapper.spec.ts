import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { BloodGlucoseEntity } from '../../../src/infrastructure/entity/blood.glucose.entity'
import { BloodGlucoseEntityMapper } from '../../../src/infrastructure/entity/mapper/blood.glucose.entity.mapper'

describe('Mappers: BloodGlucoseEntityMapper', () => {
    const mapper: BloodGlucoseEntityMapper = new BloodGlucoseEntityMapper()
    const measurement: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
    measurement.id = DefaultEntityMock.BLOOD_GLUCOSE.id
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.BLOOD_GLUCOSE)
                assert.propertyVal(result, 'id', DefaultEntityMock.BLOOD_GLUCOSE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_GLUCOSE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_GLUCOSE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.BLOOD_GLUCOSE.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BLOOD_GLUCOSE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_GLUCOSE.timestamp)
                assert.propertyVal(result, 'meal', DefaultEntityMock.BLOOD_GLUCOSE.meal)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
                assert.propertyVal(result, 'meal', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
                assert.propertyVal(result, 'meal', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'id', DefaultEntityMock.BLOOD_GLUCOSE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_GLUCOSE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_GLUCOSE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_GLUCOSE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.BLOOD_GLUCOSE.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BLOOD_GLUCOSE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_GLUCOSE.timestamp)
                assert.propertyVal(result, 'meal', DefaultEntityMock.BLOOD_GLUCOSE.meal)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: BloodGlucose = new BloodGlucose()
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
                    mapper.modelEntityToModel(new BloodGlucoseEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
