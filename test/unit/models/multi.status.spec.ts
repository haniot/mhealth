import { MultiStatus } from '../../../src/application/domain/model/multi.status'
import { StatusSuccess } from '../../../src/application/domain/model/status.success'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { StatusError } from '../../../src/application/domain/model/status.error'
import { assert } from 'chai'

describe('Models: MultiStatus', () => {
    describe('fromJSON()', () => {
        context('set the values in constructor', () => {
            it('should return a model with json parameters', () => {
                const result = new MultiStatus(
                    [new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)],
                    [new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)]
                )
                assert.deepPropertyVal(result, 'success', [new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)])
                assert.deepPropertyVal(result, 'error', [new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)])
            })
        })

        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new MultiStatus().fromJSON(
                    {
                        success: [new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)],
                        error: [new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)]
                    })
                assert.deepPropertyVal(result, 'success', [new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)])
                assert.deepPropertyVal(result, 'error', [new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)])
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new MultiStatus().fromJSON(JSON.stringify(
                    {
                        success: [new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)],
                        error: [new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)]
                    }))
                assert.deepPropertyVal(result, 'success', [new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)])
                assert.deepPropertyVal(result, 'error', [new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)])
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new MultiStatus().fromJSON('')
                assert.isUndefined(result.success, 'no success defined')
                assert.isUndefined(result.error, 'no error defined')
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new MultiStatus().fromJSON('invalid')
                assert.isUndefined(result.success, 'no success defined')
                assert.isUndefined(result.error, 'no error defined')
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new MultiStatus().fromJSON(undefined)
                assert.isUndefined(result.success, 'no success defined')
                assert.isUndefined(result.error, 'no error defined')
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new MultiStatus().fromJSON({})
                assert.isUndefined(result.success, 'no success defined')
                assert.isUndefined(result.error, 'no error defined')
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const status = new MultiStatus().fromJSON(
                    {
                        success: [new StatusSuccess().fromJSON(DefaultEntityMock.STATUS_SUCCESS)],
                        error: [new StatusError().fromJSON(DefaultEntityMock.STATUS_ERROR)]
                    })
                const result = status.toJSON()
                assert.deepPropertyVal(result, 'success', [DefaultEntityMock.STATUS_SUCCESS])
                assert.deepPropertyVal(result, 'error', [DefaultEntityMock.STATUS_ERROR])
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new MultiStatus().toJSON()
                assert.isUndefined(result.success, 'no success defined')
                assert.isUndefined(result.error, 'no error defined')
            })
        })
    })
})
