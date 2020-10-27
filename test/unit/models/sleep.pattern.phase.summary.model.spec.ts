import { assert } from 'chai'
import { SleepPatternSummaryData } from '../../../src/application/domain/model/sleep.pattern.summary.data'
import { SleepPatternPhaseSummary } from '../../../src/application/domain/model/sleep.pattern.phase.summary'

describe('Models: SleepPatternPhaseSummary', () => {
    const summaryDataJSON: any = {
        awake: {
            count: 1,
            duration: 1000
        },
        asleep: {
            count: 2,
            duration: 10000
        },
        restless: {
            count: 3,
            duration: 20000
        }
    }

    describe('toJSON()', () => {
        context('when the SleepPatternPhasesSummary model is correct', () => {
            it('should return a JSON from SleepPatternPhaseSummary model', () => {
                const awakePattern = new SleepPatternSummaryData(summaryDataJSON.awake.count, summaryDataJSON.awake.duration)
                const asleepPattern = new SleepPatternSummaryData(summaryDataJSON.asleep.count, summaryDataJSON.asleep.duration)
                const restlessPattern =
                    new SleepPatternSummaryData(summaryDataJSON.restless.count, summaryDataJSON.restless.duration)
                let result: SleepPatternPhaseSummary = new SleepPatternPhaseSummary(awakePattern, asleepPattern, restlessPattern)
                result = result.toJSON()
                assert.deepPropertyVal(result, 'awake', summaryDataJSON.awake)
                assert.deepPropertyVal(result, 'asleep', summaryDataJSON.asleep)
                assert.deepPropertyVal(result, 'restless', summaryDataJSON.restless)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete SleepPatternPhaseSummary',
                () => {
                    let result: any = new SleepPatternPhaseSummary().toJSON()
                    assert.isUndefined(result.awake)
                    assert.isUndefined(result.asleep)
                    assert.isUndefined(result.restless)
                })
        })
    })
})
