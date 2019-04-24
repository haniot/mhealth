import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Fat } from '../../../src/application/domain/model/fat'

describe('Models: Fat', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new Fat().fromJSON(DefaultEntityMock.FAT)
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.FAT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.FAT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.FAT.timestamp)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new Fat().fromJSON(JSON.stringify(DefaultEntityMock.FAT))
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.FAT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.FAT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.FAT.timestamp)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Fat().fromJSON('')
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Fat().fromJSON('invalid')
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Fat().fromJSON(undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Fat().fromJSON({})
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new Fat().fromJSON(DefaultEntityMock.FAT)
                measurement.id = DefaultEntityMock.FAT.id
                const result = measurement.toJSON()
                assert.propertyVal(result, 'id', DefaultEntityMock.FAT.id)
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', DefaultEntityMock.FAT.unit)
                assert.propertyVal(result, 'device_id', DefaultEntityMock.FAT.device_id)
                assert.propertyVal(result, 'user_id', DefaultEntityMock.FAT.user_id)
                assert.propertyVal(result, 'value', DefaultEntityMock.FAT.value)
                assert.propertyVal(result, 'timestamp', DefaultEntityMock.FAT.timestamp)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new Fat().toJSON()
                assert.propertyVal(result, 'id', undefined)
                assert.propertyVal(result, 'type', DefaultEntityMock.FAT.type)
                assert.propertyVal(result, 'unit', undefined)
                assert.propertyVal(result, 'device_id', undefined)
                assert.propertyVal(result, 'user_id', undefined)
                assert.propertyVal(result, 'value', undefined)
                assert.propertyVal(result, 'timestamp', undefined)
            })
        })
    })
})
