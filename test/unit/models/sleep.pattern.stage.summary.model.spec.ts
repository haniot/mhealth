import { assert } from 'chai'
import { SleepPatternSummaryData } from '../../../src/application/domain/model/sleep.pattern.summary.data'
import { SleepPatternStageSummary } from '../../../src/application/domain/model/sleep.pattern.stage.summary'

describe('Models: SleepPatternStageSummary', () => {
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
            it('should return a JSON from SleepPatternStageSummary model', () => {
                const deepPattern = new SleepPatternSummaryData(summaryDataJSON.deep.count, summaryDataJSON.deep.duration)
                const lightPattern = new SleepPatternSummaryData(summaryDataJSON.light.count, summaryDataJSON.light.duration)
                const remPattern = new SleepPatternSummaryData(summaryDataJSON.rem.count, summaryDataJSON.rem.duration)
                const awakePattern = new SleepPatternSummaryData(summaryDataJSON.awake.count, summaryDataJSON.awake.duration)
                let result: SleepPatternStageSummary =
                    new SleepPatternStageSummary(deepPattern, lightPattern, remPattern, awakePattern)
                result = result.toJSON()
                assert.deepPropertyVal(result, 'deep', summaryDataJSON.deep)
                assert.deepPropertyVal(result, 'light', summaryDataJSON.light)
                assert.deepPropertyVal(result, 'rem', summaryDataJSON.rem)
                assert.deepPropertyVal(result, 'awake', summaryDataJSON.awake)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete SleepPatternStageSummary',
                () => {
                    let result: any = new SleepPatternStageSummary().toJSON()
                    assert.isUndefined(result.deep)
                    assert.isUndefined(result.light)
                    assert.isUndefined(result.rem)
                    assert.isUndefined(result.awake)
                })
        })
    })
})
