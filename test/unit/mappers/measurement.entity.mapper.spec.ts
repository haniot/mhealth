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
                assert.property(result, 'id')
                assert.property(result, 'value')
                assert.propertyVal(result, 'value', measurement.value)
                assert.property(result, 'unit')
                assert.propertyVal(result, 'unit', measurement.unit)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', measurement.type)
                assert.property(result, 'timestamp')
                assert.property(result, 'user_id')
                assert.propertyVal(result, 'user_id', measurement.user_id)
                assert.property(result, 'device_id')
                assert.propertyVal(result, 'device_id', measurement.device_id)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.property(result, 'id')
                assert.property(result, 'value')
                assert.propertyVal(result, 'value', undefined)
                assert.property(result, 'unit')
                assert.propertyVal(result, 'unit', undefined)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', undefined)
                assert.property(result, 'timestamp')
                assert.property(result, 'user_id')
                assert.propertyVal(result, 'user_id', undefined)
                assert.property(result, 'device_id')
                assert.propertyVal(result, 'device_id', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.property(result, 'id')
                assert.property(result, 'value')
                assert.propertyVal(result, 'value', undefined)
                assert.property(result, 'unit')
                assert.propertyVal(result, 'unit', undefined)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', undefined)
                assert.property(result, 'timestamp')
                assert.property(result, 'user_id')
                assert.propertyVal(result, 'user_id', undefined)
                assert.property(result, 'device_id')
                assert.propertyVal(result, 'device_id', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.property(result, 'value')
                assert.propertyVal(result, 'value', measurement.value)
                assert.property(result, 'unit')
                assert.propertyVal(result, 'unit', measurement.unit)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', measurement.type)
                assert.property(result, 'timestamp')
                assert.property(result, 'user_id')
                assert.propertyVal(result, 'user_id', measurement.user_id)
                assert.property(result, 'device_id')
                assert.propertyVal(result, 'device_id', measurement.device_id)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const result = mapper.transform(new Measurement())
                console.log(result)
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
                    assert.property(err, 'message')
                    assert.property(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
