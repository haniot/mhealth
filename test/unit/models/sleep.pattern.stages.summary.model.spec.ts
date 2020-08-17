import { assert } from 'chai'
import { SleepPatternSummaryData } from '../../../src/application/domain/model/sleep.pattern.summary.data'
import { SleepPatternStageSummary } from '../../../src/application/domain/model/sleep.pattern.stage.summary'

describe('Models: SleepPatternStagesSummary', () => {
    const summaryDataJSON: any = {
        deep: {
            count: 1,
            duration: 1000
        },
        light: {
            count: 2,
            duration: 10000
        },
        rem: {
            count: 3,
            duration: 20000
        },
        awake: {
            count: 4,
            duration: 30000
        }
    }

    describe('toJSON()', () => {
        context('when the SleepPatternStagesSummary model is correct', () => {
            it('should return a JSON from SleepPatternStagesSummary model', () => {
                let result: SleepPatternStageSummary = new SleepPatternStageSummary()
                result.deep = new SleepPatternSummaryData(summaryDataJSON.deep.count, summaryDataJSON.deep.duration)
                result.light = new SleepPatternSummaryData(summaryDataJSON.light.count, summaryDataJSON.light.duration)
                result.rem = new SleepPatternSummaryData(summaryDataJSON.rem.count, summaryDataJSON.rem.duration)
                result.awake = new SleepPatternSummaryData(summaryDataJSON.awake.count, summaryDataJSON.awake.duration)
                result = result.toJSON()
                assert.deepPropertyVal(result, 'deep', summaryDataJSON.deep)
                assert.deepPropertyVal(result, 'light', summaryDataJSON.light)
                assert.deepPropertyVal(result, 'rem', summaryDataJSON.rem)
                assert.deepPropertyVal(result, 'awake', summaryDataJSON.awake)
            })
        })
    })
})
