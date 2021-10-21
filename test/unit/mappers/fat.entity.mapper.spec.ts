import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { BodyFatEntity } from '../../../src/infrastructure/entity/body.fat.entity'
import { BodyFat } from '../../../src/application/domain/model/body.fat'
import { BodyFatEntityMapper } from '../../../src/infrastructure/entity/mapper/body.fat.entity.mapper'

describe('Mappers: BodyFatEntityMapper', () => {
    const mapper: BodyFatEntityMapper = new BodyFatEntityMapper()
    const measurement: BodyFat = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
    measurement.id = DefaultEntityMock.BODY_FAT.id
    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.BODY_FAT)
                assert.propertyVal(result, 'id', DefaultEntityMock.BODY_FAT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_FAT.device_id)
                assert.propertyVal(result, 'patient_id', DefaultEntityMock.BODY_FAT.patient_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_FAT.timestamp)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.id, 'no id defined')
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.isUndefined(result.unit, 'no unit defined')
                assert.isUndefined(result.device_id, 'no device_id defined')
                assert.isUndefined(result.patient_id, 'no patient_id type')
                assert.isUndefined(result.value, 'no value defined')
                assert.isUndefined(result.timestamp, 'no timestamp defined')
                assert.isUndefined(result.id, 'no id defined')
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(measurement)
                assert.propertyVal(result, 'id', DefaultEntityMock.BODY_FAT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.BODY_FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.BODY_FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.BODY_FAT.device_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.BODY_FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.BODY_FAT.timestamp)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const emptyMeasurement: BodyFat = new BodyFat()
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
                    mapper.modelEntityToModel(new BodyFatEntity())
                } catch (err: any) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
