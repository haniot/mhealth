import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { StatusSuccess } from '../../../src/application/domain/model/status.success'

describe('Models: StatusSuccess', () => {
    describe('fromJSON()', () => {
        context('set the values in constructor', () => {
            it('should return a model with json parameters', () => {
                const result = new StatusSuccess(
                    DefaultEntityMock.STATUS_SUCCESS.code,
                    DefaultEntityMock.STATUS_SUCCESS.item)
                assert.propertyVal(result, 'code', DefaultEntityMock.STATUS_SUCCESS.code)
                assert.deepPropertyVal(result, 'item', DefaultEntityMock.STATUS_SUCCESS.item)
            })
        })

        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)
                assert.propertyVal(result, 'code', DefaultEntityMock.STATUS_SUCCESS.code)
                assert.deepPropertyVal(result, 'item', DefaultEntityMock.STATUS_SUCCESS.item)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new StatusSuccess().fromJSON(JSON.stringify(DefaultEntityMock.STATUS_SUCCESS))
                assert.propertyVal(result, 'code', DefaultEntityMock.STATUS_SUCCESS.code)
                assert.deepPropertyVal(result, 'item', DefaultEntityMock.STATUS_SUCCESS.item)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new StatusSuccess().fromJSON('')
                assert.propertyVal(result, 'code', undefined)
                assert.deepPropertyVal(result, 'item', undefined)

            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new StatusSuccess().fromJSON('invalid')
                assert.propertyVal(result, 'code', undefined)
                assert.deepPropertyVal(result, 'item', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new StatusSuccess().fromJSON(undefined)
                assert.propertyVal(result, 'code', undefined)
                assert.deepPropertyVal(result, 'item', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new StatusSuccess().fromJSON({})
                assert.propertyVal(result, 'code', undefined)
                assert.deepPropertyVal(result, 'item', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const status = new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)
                const result = status.toJSON()
                assert.propertyVal(result, 'code', DefaultEntityMock.STATUS_SUCCESS.code)
                assert.deepPropertyVal(result, 'item', DefaultEntityMock.STATUS_SUCCESS.item)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new StatusSuccess().toJSON()
                assert.propertyVal(result, 'code', undefined)
                assert.deepPropertyVal(result, 'item', undefined)
            })
        })
    })
})
