import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { StatusError } from '../../../src/application/domain/model/status.error'

describe('Models: StatusError', () => {
    describe('fromJSON()', () => {
        context('set the values in constructor', () => {
            it('should return a model with json parameters', () => {
                const result = new StatusError(
                    DefaultEntityMock.STATUS_ERROR.code,
                    DefaultEntityMock.STATUS_ERROR.message,
                    DefaultEntityMock.STATUS_ERROR.description,
                    DefaultEntityMock.STATUS_ERROR.item)
                assert.propertyVal(result, 'code', DefaultEntityMock.STATUS_ERROR.code)
                assert.propertyVal(result, 'message', DefaultEntityMock.STATUS_ERROR.message)
                assert.propertyVal(result, 'description', DefaultEntityMock.STATUS_ERROR.description)
                assert.deepPropertyVal(result, 'item', DefaultEntityMock.STATUS_ERROR.item)
            })
        })

        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)
                assert.propertyVal(result, 'code', DefaultEntityMock.STATUS_ERROR.code)
                assert.propertyVal(result, 'message', DefaultEntityMock.STATUS_ERROR.message)
                assert.propertyVal(result, 'description', DefaultEntityMock.STATUS_ERROR.description)
                assert.deepPropertyVal(result, 'item', DefaultEntityMock.STATUS_ERROR.item)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new StatusError().fromJSON(JSON.stringify(DefaultEntityMock.STATUS_ERROR))
                assert.propertyVal(result, 'code', DefaultEntityMock.STATUS_ERROR.code)
                assert.propertyVal(result, 'message', DefaultEntityMock.STATUS_ERROR.message)
                assert.propertyVal(result, 'description', DefaultEntityMock.STATUS_ERROR.description)
                assert.deepPropertyVal(result, 'item', DefaultEntityMock.STATUS_ERROR.item)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new StatusError().fromJSON('')
                assert.propertyVal(result, 'code', undefined)
                assert.propertyVal(result, 'message', undefined)
                assert.propertyVal(result, 'description', undefined)
                assert.deepPropertyVal(result, 'item', undefined)

            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new StatusError().fromJSON('invalid')
                assert.propertyVal(result, 'code', undefined)
                assert.propertyVal(result, 'message', undefined)
                assert.propertyVal(result, 'description', undefined)
                assert.deepPropertyVal(result, 'item', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new StatusError().fromJSON(undefined)
                assert.propertyVal(result, 'code', undefined)
                assert.propertyVal(result, 'message', undefined)
                assert.propertyVal(result, 'description', undefined)
                assert.deepPropertyVal(result, 'item', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new StatusError().fromJSON({})
                assert.propertyVal(result, 'code', undefined)
                assert.propertyVal(result, 'message', undefined)
                assert.propertyVal(result, 'description', undefined)
                assert.deepPropertyVal(result, 'item', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const status = new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)
                const result = status.toJSON()
                assert.propertyVal(result, 'code', DefaultEntityMock.STATUS_ERROR.code)
                assert.propertyVal(result, 'message', DefaultEntityMock.STATUS_ERROR.message)
                assert.propertyVal(result, 'description', DefaultEntityMock.STATUS_ERROR.description)
                assert.deepPropertyVal(result, 'item', DefaultEntityMock.STATUS_ERROR.item)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new StatusError().toJSON()
                assert.propertyVal(result, 'code', undefined)
                assert.propertyVal(result, 'message', undefined)
                assert.propertyVal(result, 'description', undefined)
                assert.deepPropertyVal(result, 'item', undefined)
            })
        })
    })
})
