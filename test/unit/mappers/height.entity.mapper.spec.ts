import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { HeightEntityMapper } from '../../../src/infrastructure/entity/mapper/height.entity.mapper'
import { HeightEntity } from '../../../src/infrastructure/entity/height.entity'
import { Height } from '../../../src/application/domain/model/height'

describe('Mappers: HeightEntityMapper', () => {
    const mapper: HeightEntityMapper = new HeightEntityMapper()
    const measurement: Height = new Height().fromJSON(DefaultEntityMock.HEIGHT)
    measurement.id = DefaultEntityMock.HEIGHT.id
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.HEIGHT)
                assert.propertyVal(result, 'id', DefaultEntityMock.HEIGHT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEIGHT.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.HEIGHT.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.HEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEIGHT.timestamp)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.isUndefined(result.id, 'no id defined')
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id defined')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
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
                assert.propertyVal(result, 'id', DefaultEntityMock.HEIGHT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.HEIGHT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.HEIGHT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.HEIGHT.device_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.HEIGHT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.HEIGHT.timestamp)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: Height = new Height()
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
                    mapper.modelEntityToModel(new HeightEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
