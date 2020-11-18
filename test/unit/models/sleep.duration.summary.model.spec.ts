import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { SleepDurationSummary } from '../../../src/application/domain/model/sleep.duration.summary'

describe('MODELS: SleepDurationSummary', () => {
    const sleepDurationSummaryJSON: any = DefaultEntityMock.SLEEP_DURATION_SUMMARY

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a SleepDurationSummary from a complete json', () => {
                const result: SleepDurationSummary = new SleepDurationSummary().fromJSON(sleepDurationSummaryJSON)

                assert.propertyVal(result, 'total', sleepDurationSummaryJSON.total)
            })

            it('should return an empty SleepDurationSummary from an empty json', () => {
                const result: SleepDurationSummary = new SleepDurationSummary().fromJSON({})

                assert.isEmpty(result)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an empty SleepDurationSummary from an undefined json', () => {
                const result: SleepDurationSummary = new SleepDurationSummary().fromJSON(undefined)

                assert.isEmpty(result)
            })
        })

        context('when the json is a string', () => {
            it('should return a SleepDurationSummary from a complete json', () => {
                const result: SleepDurationSummary = new SleepDurationSummary().fromJSON(JSON.stringify(sleepDurationSummaryJSON))

                assert.propertyVal(result, 'total', sleepDurationSummaryJSON.total)
            })

            it('should return an empty SleepDurationSummary from an empty string', () => {
                const result: SleepDurationSummary = new SleepDurationSummary().fromJSON(JSON.stringify(''))

                assert.isEmpty(result)
            })

            it('should return an empty SleepDurationSummary from an invalid string', () => {
                const result: SleepDurationSummary = new SleepDurationSummary().fromJSON('d52215d412')

                assert.isEmpty(result)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete SleepDurationSummary', () => {
                const sleepDurationSummary: SleepDurationSummary = new SleepDurationSummary().fromJSON(sleepDurationSummaryJSON)
                const result: any = sleepDurationSummary.toJSON()

                assert.propertyVal(result, 'total', sleepDurationSummaryJSON.total)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete SleepDurationSummary', () => {
                const result: any = new SleepDurationSummary().toJSON()

                assert.isUndefined(result.total)
            })
        })
    })
})
