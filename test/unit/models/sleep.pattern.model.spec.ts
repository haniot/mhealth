import { assert } from 'chai'
import { SleepPatternSummaryData } from '../../../src/application/domain/model/sleep.pattern.summary.data'
import { SleepPattern } from '../../../src/application/domain/model/sleep.pattern'
import { SleepPatternDataSet } from '../../../src/application/domain/model/sleep.pattern.data.set'
import { Stages } from '../../../src/application/domain/utils/stages'
import { SleepPatternStageSummary } from '../../../src/application/domain/model/sleepPatternStageSummary'

describe('Models: SleepPattern', () => {
    const dataSetItem: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItem.start_time = '2018-08-18T01:30:30Z'
    dataSetItem.name = Stages.DEEP
    dataSetItem.duration = Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min milliseconds

    const dataSetItem2: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItem2.start_time = '2018-08-18T01:45:30Z'
    dataSetItem2.name = Stages.LIGHT
    dataSetItem2.duration = Math.floor(Math.random() * 3 + 1) * 60000 // 1-3min in milliseconds

    const dataSetItem3: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItem3.start_time = '2018-08-18T02:45:30Z'
    dataSetItem3.name = Stages.REM
    dataSetItem3.duration = Math.floor(Math.random() * 120 + 1) * 60000 // 1-180min in milliseconds

    const dataSetItem4: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItem4.start_time = '2018-08-18T02:45:30Z'
    dataSetItem4.name = Stages.AWAKE
    dataSetItem4.duration = Math.floor(Math.random() * 120 + 1) * 60000 // 1-180min in milliseconds

    const summaryDataJSON: any = {
        data_set: [dataSetItem, dataSetItem2, dataSetItem3, dataSetItem4],
        summary: new SleepPatternStageSummary(new SleepPatternSummaryData(2, 10000),
            new SleepPatternSummaryData(3, 20000),
            new SleepPatternSummaryData(4, 30000),
            new SleepPatternSummaryData(5, 40000))
    }

    describe('fromJSON(json: any)', () => {
        context('when the json is correct', () => {
            it('should return an SleepPattern model', () => {
                const result = new SleepPattern().fromJSON(summaryDataJSON)

                assert.deepPropertyVal(result, 'data_set', summaryDataJSON.data_set)
            })
        })

        context('when the json is undefined', () => {
            it('should return an SleepPattern model with all attributes with undefined value', () => {
                const result = new SleepPattern().fromJSON(undefined)
                assert.isUndefined(result.data_set)
                assert.isUndefined(result.summary)
            })
        })

        context('when the json is a string', () => {
            it('should transform the string in json and return SleepPattern model', () => {
                const result = new SleepPattern().fromJSON(JSON.stringify(summaryDataJSON))

                assert.deepPropertyVal(result, 'data_set', summaryDataJSON.data_set)
            })
        })
    })

    describe('toJSON()', () => {
        context('when the SleepPattern model is correct', () => {
            it('should return a JSON from SleepPattern model', () => {
                let result = new SleepPattern().fromJSON(summaryDataJSON)
                result = result.toJSON()
                // Pattern data_set
                assert.propertyVal(result.data_set[0], 'start_time', summaryDataJSON.data_set[0].start_time)
                assert.propertyVal(result.data_set[0], 'name', summaryDataJSON.data_set[0].name)
                assert.propertyVal(result.data_set[0], 'duration', summaryDataJSON.data_set[0].duration)
                assert.propertyVal(result.data_set[1], 'start_time', summaryDataJSON.data_set[1].start_time)
                assert.propertyVal(result.data_set[1], 'name', summaryDataJSON.data_set[1].name)
                assert.propertyVal(result.data_set[1], 'duration', summaryDataJSON.data_set[1].duration)
                assert.propertyVal(result.data_set[2], 'start_time', summaryDataJSON.data_set[2].start_time)
                assert.propertyVal(result.data_set[2], 'name', summaryDataJSON.data_set[2].name)
                assert.propertyVal(result.data_set[2], 'duration', summaryDataJSON.data_set[2].duration)
            })
        })
    })
})
