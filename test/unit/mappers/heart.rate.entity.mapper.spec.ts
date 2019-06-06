import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { HeartRate } from '../../../src/application/domain/model/heart.rate'
import { HeartRateEntity } from '../../../src/infrastructure/entity/heart.rate.entity'
import { HeartRateEntityMapper } from '../../../src/infrastructure/entity/mapper/heart.rate.entity.mapper'
import { DataSetItem } from '../../../src/application/domain/model/data.set.item'

describe('Mappers: HeartRateEntityMapper', () => {
    const mapper: HeartRateEntityMapper = new HeartRateEntityMapper()
    const measurement: HeartRate = new HeartRate().fromJSON(DefaultEntityMock.HEART_RATE)
    measurement.id = DefaultEntityMock.HEART_RATE.id
    const dataset = DefaultEntityMock.HEART_RATE.dataset.map(item => new DataSetItem().fromJSON(item))
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.HEART_RATE)
                assert.propertyVal(result, 'id', DefaultEntityMock.HEART_RATE.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.deepPropertyVal(result, 'dataset', dataset)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEART_RATE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEART_RATE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.HEART_RATE.user_id)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.isUndefined(result.id, 'no id defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.dataset, 'no dataset defined')
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.isUndefined(result.id, 'no id defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id defined')
                assert.isUndefined(result.dataset, 'no dataset defined')
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'id', DefaultEntityMock.HEART_RATE.id)
                assert.deepPropertyVal(result, 'dataset', DefaultEntityMock.HEART_RATE.dataset)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEART_RATE.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEART_RATE.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEART_RATE.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.HEART_RATE.user_id)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: HeartRate = new HeartRate()
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
                    mapper.modelEntityToModel(new HeartRateEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
