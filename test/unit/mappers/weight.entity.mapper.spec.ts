import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { WeightEntity } from '../../../src/infrastructure/entity/weight.entity'
import { WeightEntityMapper } from '../../../src/infrastructure/entity/mapper/weight.entity.mapper'
import { Weight } from '../../../src/application/domain/model/weight'

describe('Mappers: WeightEntityMapper', () => {
    const mapper: WeightEntityMapper = new WeightEntityMapper()
    const measurement: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
    measurement.id = DefaultEntityMock.WEIGHT.id
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.WEIGHT)
                assert.propertyVal(result, 'id', DefaultEntityMock.WEIGHT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WEIGHT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.WEIGHT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WEIGHT.timestamp)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'id', DefaultEntityMock.WEIGHT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.WEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.WEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.WEIGHT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.WEIGHT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.WEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.WEIGHT.timestamp)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: Weight = new Weight()
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
                    mapper.modelEntityToModel(new WeightEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
