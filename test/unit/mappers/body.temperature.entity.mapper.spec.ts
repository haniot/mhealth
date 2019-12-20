import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { BodyTemperatureEntityMapper } from '../../../src/infrastructure/entity/mapper/body.temperature.entity.mapper'
import { BodyTemperatureEntity } from '../../../src/infrastructure/entity/body.temperature.entity'

describe('Mappers: BodyTemperatureEntityMapper', () => {
    const mapper: BodyTemperatureEntityMapper = new BodyTemperatureEntityMapper()
    const measurement: BodyTemperature = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
    measurement.id = DefaultEntityMock.BODY_TEMPERATURE.id
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.BODY_TEMPERATURE)
                assert.propertyVal(result, 'id', DefaultEntityMock.BODY_TEMPERATURE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_TEMPERATURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_TEMPERATURE.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BODY_TEMPERATURE.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_TEMPERATURE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_TEMPERATURE.timestamp)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.id, 'no id defined')
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.id, 'no id defined')
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'id', DefaultEntityMock.BODY_TEMPERATURE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_TEMPERATURE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_TEMPERATURE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_TEMPERATURE.device_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_TEMPERATURE.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_TEMPERATURE.timestamp)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: BodyTemperature = new BodyTemperature()
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
                    mapper.modelEntityToModel(new BodyTemperatureEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
