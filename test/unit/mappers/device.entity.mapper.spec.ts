import { Device } from '../../../src/application/domain/model/device'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { DeviceEntityMapper } from '../../../src/infrastructure/entity/mapper/device.entity.mapper'
import { assert } from 'chai'
import { DeviceEntity } from '../../../src/infrastructure/entity/device.entity'

describe('Mappers: DeviceEntityMapper', () => {
    const mapper: DeviceEntityMapper = new DeviceEntityMapper()
    const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)
    device.id = DefaultEntityMock.DEVICE.id

    describe('transform()', () => {
        context('when the parameter is a json', () => {
            it('should call the jsonToModel() method', () => {
                const result = mapper.transform(DefaultEntityMock.DEVICE)
                assert.propertyVal(result, 'name', device.name)
                assert.propertyVal(result, 'type', device.type)
                assert.propertyVal(result, 'model_number', device.model_number)
                assert.propertyVal(result, 'manufacturer', device.manufacturer)
                assert.propertyVal(result, 'user_id', device.user_id)
            })

            it('should return model without parameters for empty json', () => {
                const result = mapper.transform({})
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'model_number', undefined)
                assert.propertyVal(result, 'manufacturer', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })

            it('should return model without parameter for undefined json', () => {
                const result = mapper.transform(undefined)
                assert.propertyVal(result, 'name', undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'model_number', undefined)
                assert.propertyVal(result, 'manufacturer', undefined)
                assert.propertyVal(result, 'user_id', undefined)
            })

        })

        context('when the parameter is a model', () => {
            it('should call the modelToModelEntity() method', () => {
                const result = mapper.transform(device)
                assert.propertyVal(result, 'name', device.name)
                assert.propertyVal(result, 'type', device.type)
                assert.propertyVal(result, 'model_number', device.model_number)
                assert.propertyVal(result, 'manufacturer', device.manufacturer)
                assert.propertyVal(result, 'user_id', device.user_id)
            })

            it('should return a model entity with basic parameters for empty model', () => {
                const result = mapper.transform(new Device())
                assert.isEmpty(result)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    mapper.modelEntityToModel(new DeviceEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
