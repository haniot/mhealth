import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { BloodPressureEntity } from '../../../src/infrastructure/entity/blood.pressure.entity'
import { BloodPressureEntityMapper } from '../../../src/infrastructure/entity/mapper/blood.pressure.entity.mapper'

describe('Mappers: BloodPressureEntityMapper', () => {
    const mapper: BloodPressureEntityMapper = new BloodPressureEntityMapper()
    const measurement: BloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
    measurement.id = DefaultEntityMock.BLOOD_PRESSURE.id
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.BLOOD_PRESSURE)
                assert.propertyVal(result, 'id', DefaultEntityMock.BLOOD_PRESSURE.id)
                assert.propertyVal(result, 'systolic', DefaultEntityMock.BLOOD_PRESSURE.systolic)
                assert.propertyVal(result, 'diastolic', DefaultEntityMock.BLOOD_PRESSURE.diastolic)
                assert.propertyVal(result, 'pulse', DefaultEntityMock.BLOOD_PRESSURE.pulse)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_PRESSURE.timestamp)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_PRESSURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_PRESSURE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BLOOD_PRESSURE.patient_id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
                assert.isUndefined(result.systolic, 'no systolic defined')
                assert.isUndefined(result.diastolic, 'no diastolic defined')
                assert.isUndefined(result.pulse, 'no pulse defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.id, 'no id defined')
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
                assert.isUndefined(result.systolic, 'no systolic defined')
                assert.isUndefined(result.diastolic, 'no diastolic defined')
                assert.isUndefined(result.pulse, 'no pulse defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.id, 'no id defined')
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'systolic', DefaultEntityMock.BLOOD_PRESSURE.systolic)
                assert.propertyVal(result, 'diastolic', DefaultEntityMock.BLOOD_PRESSURE.diastolic)
                assert.propertyVal(result, 'pulse', DefaultEntityMock.BLOOD_PRESSURE.pulse)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BLOOD_PRESSURE.timestamp)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BLOOD_PRESSURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BLOOD_PRESSURE.device_id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BLOOD_PRESSURE.type)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: BloodPressure = new BloodPressure()
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
                    mapper.modelEntityToModel(new BloodPressureEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
