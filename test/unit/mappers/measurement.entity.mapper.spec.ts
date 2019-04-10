import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { MeasurementEntity } from '../../../src/infrastructure/entity/measurement.entity'
import { MeasurementEntityMapper } from '../../../src/infrastructure/entity/mapper/measurement.entity.mapper'
import { Context } from '../../../src/application/domain/model/context'

describe('Mappers: measurementEntityMapper', () => {
    const mapper: MeasurementEntityMapper = new MeasurementEntityMapper()
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
    measurement.id = DefaultEntityMock.MEASUREMENT.id
    measurement.contexts = [new Context().fromJSON(DefaultEntityMock.CONTEXT)]

    const measurement_temperature: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT_TEMPERATURE)
    measurement_temperature.id = DefaultEntityMock.MEASUREMENT_TEMPERATURE.id
    measurement.measurements = [measurement_temperature]

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(measurement.toJSON())
                assert.propertyVal(result, 'value', measurement.value)
                assert.propertyVal(result, 'unit', measurement.unit)
                assert.propertyVal(result, 'type', measurement.type)
                assert.propertyVal(result, 'user_id', measurement.user_id)
                assert.propertyVal(result, 'device_id', measurement.device_id)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'device_id', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'device_id', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'value', measurement.value)
                assert.propertyVal(result, 'unit', measurement.unit)
                assert.propertyVal(result, 'type', measurement.type)
                assert.propertyVal(result, 'user_id', measurement.user_id)
                assert.propertyVal(result, 'device_id', measurement.device_id)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const result = mapper.transform(new Measurement())
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
