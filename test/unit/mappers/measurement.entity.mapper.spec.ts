import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { MeasurementEntityMapper } from '../../../src/infrastructure/entity/mapper/measurement.entity.mapper'
import { MeasurementEntity } from '../../../src/infrastructure/entity/measurement.entity'

describe('Mappers: MeasurementEntityMapper', () => {
    const mapper: MeasurementEntityMapper = new MeasurementEntityMapper()
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
    measurement.id = DefaultEntityMock.MEASUREMENT.id
    measurement.type = DefaultEntityMock.MEASUREMENT.type
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.MEASUREMENT)
                assert.propertyVal(result, 'id', DefaultEntityMock.MEASUREMENT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.MEASUREMENT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.MEASUREMENT.patient_id)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.isUndefined(result.id, 'no id defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.type, 'no type defined')
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.isUndefined(result.id, 'no id defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.type, 'no type defined')
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'id', DefaultEntityMock.MEASUREMENT.id)
                assert.propertyVal(result, 'unit', DefaultEntityMock.MEASUREMENT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.MEASUREMENT.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.MEASUREMENT.patient_id)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: Measurement = new Measurement()
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
                    mapper.modelEntityToModel(new MeasurementEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
