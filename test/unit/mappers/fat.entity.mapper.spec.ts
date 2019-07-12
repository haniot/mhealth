import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { FatEntity } from '../../../src/infrastructure/entity/fat.entity'
import { Fat } from '../../../src/application/domain/model/fat'
import { FatEntityMapper } from '../../../src/infrastructure/entity/mapper/fat.entity.mapper'

describe('Mappers: FatEntityMapper', () => {
    const mapper: FatEntityMapper = new FatEntityMapper()
    const measurement: Fat = new Fat().fromJSON(DefaultEntityMock.FAT)
    measurement.id = DefaultEntityMock.FAT.id
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.FAT)
                assert.propertyVal(result, 'id', DefaultEntityMock.FAT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.FAT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.FAT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.FAT.timestamp)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.id, 'no id defined')
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.user_id, 'no user_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.id, 'no id defined')
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'id', DefaultEntityMock.FAT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.FAT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.FAT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.FAT.timestamp)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: Fat = new Fat()
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
                    mapper.modelEntityToModel(new FatEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
