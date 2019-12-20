import { assert } from 'chai'
import { SleepPatternSummaryData } from '../../../src/application/domain/model/sleep.pattern.summary.data'

describe('Models: SleepPatternSummaryData', () => {
    const summaryDataJSON: any = {
        count: 2,
        duration: 100000
    }

    describe('toJSON()', () => {
        context('when the SleepPatternSummaryData model is correct', () => {
            it('should return a JSON from SleepPatternSummaryData model', () => {
                let result = new SleepPatternSummaryData(summaryDataJSON.count, summaryDataJSON.duration)
                result = result.toJSON()
                assert.propertyVal(result, 'count', summaryDataJSON.count)
                assert.propertyVal(result, 'duration', summaryDataJSON.duration)
            })
        })
    })
})
