import { Context } from '../../../src/application/domain/model/context'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'

describe('Models: Context', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new Context().fromJSON(DefaultEntityMock.CONTEXT)
                assert.propertyVal(result, 'type', DefaultEntityMock.CONTEXT.type)
                assert.propertyVal(result, 'value', DefaultEntityMock.CONTEXT.value)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new Context().fromJSON(JSON.stringify(DefaultEntityMock.CONTEXT))
                assert.propertyVal(result, 'type', DefaultEntityMock.CONTEXT.type)
                assert.propertyVal(result, 'value', DefaultEntityMock.CONTEXT.value)
            })
        })

        context('when pass a empty json string', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Context().fromJSON('')
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'value', undefined)
            })
        })

        context('when pass a invalid json string', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Context().fromJSON('invalid')
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'value', undefined)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Context().fromJSON(undefined)
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'value', undefined)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new Context().fromJSON({})
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'value', undefined)
            })
        })
    })
    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const context: Context = new Context().fromJSON(DefaultEntityMock.CONTEXT)
                const result = context.toJSON()
                assert.propertyVal(result, 'type', DefaultEntityMock.CONTEXT.type)
                assert.propertyVal(result, 'value', DefaultEntityMock.CONTEXT.value)
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new Context().toJSON()
                assert.propertyVal(result, 'type', undefined)
                assert.propertyVal(result, 'value', undefined)
            })
        })
    })
})
