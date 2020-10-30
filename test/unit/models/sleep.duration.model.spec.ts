import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { SleepDuration } from '../../../src/application/domain/model/sleep.duration'

describe('MODELS: SleepDuration', () => {
    const sleepDurationJSON: any = DefaultEntityMock.SLEEP_DURATION

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return an SleepDuration from a complete json', () => {
                const result: SleepDuration = new SleepDuration().fromJSON(sleepDurationJSON)

                assert.isUndefined(result.id)
                assert.propertyVal(result.summary, 'total', sleepDurationJSON.summary.total)
                assert.propertyVal(result.data_set[0], 'date', sleepDurationJSON.data_set[0].date)
                assert.propertyVal(result.data_set[0], 'value', sleepDurationJSON.data_set[0].value)
            })

            it('should return an SleepDuration with some attributes equal to undefined from an empty json', () => {
                const result: SleepDuration = new SleepDuration().fromJSON({})

                assert.isUndefined(result.id)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an SleepDuration with some attributes equal to undefined from an undefined json', () => {
                const result: SleepDuration = new SleepDuration().fromJSON(undefined)

                assert.isUndefined(result.id)
            })
        })

        context('when the json is a string', () => {
            it('should return an SleepDuration from a complete json', () => {
                const result: SleepDuration = new SleepDuration().fromJSON(JSON.stringify(sleepDurationJSON))

                assert.isUndefined(result.id)
                assert.propertyVal(result.summary, 'total', sleepDurationJSON.summary.total)
                assert.propertyVal(result.data_set[0], 'date', sleepDurationJSON.data_set[0].date)
                assert.propertyVal(result.data_set[0], 'value', sleepDurationJSON.data_set[0].value)
            })

            it('should return an SleepDuration with some attributes equal to undefined from an empty string', () => {
                const result: SleepDuration = new SleepDuration().fromJSON(JSON.stringify(''))

                assert.isUndefined(result.id)
            })

            it('should return an SleepDuration with some attributes equal to undefined from an invalid string', () => {
                const result: SleepDuration = new SleepDuration().fromJSON('d52215d412')

                assert.isUndefined(result.id)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete SleepDuration', () => {
                const sleepDuration: SleepDuration = new SleepDuration().fromJSON(sleepDurationJSON)
                const result: any = sleepDuration.toJSON()

                assert.deepPropertyVal(result, 'summary', sleepDurationJSON.summary)
                assert.deepPropertyVal(result, 'data_set', sleepDurationJSON.data_set)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete SleepDuration', () => {
                const result: any = new SleepDuration().toJSON()

                assert.isUndefined(result.summary)
                assert.isUndefined(result.data_set)
            })
        })
    })
})
