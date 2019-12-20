import { assert } from 'chai'
import { SleepPatternDataSet } from '../../../src/application/domain/model/sleep.pattern.data.set'

describe('Models: SleepPatternDataSet', () => {
    const dataSetJSON: any = {
        start_time: new Date(),
        name: 'restless',
        duration: 100000
    }

    describe('fromJSON(json: any)', () => {
        context('when the json is correct', () => {
            it('should return an SleepPatternDataSet model', () => {
                const result = new SleepPatternDataSet().fromJSON(dataSetJSON)
                assert.propertyVal(result, 'start_time', dataSetJSON.start_time)
                assert.propertyVal(result, 'name', dataSetJSON.name)
                assert.propertyVal(result, 'duration', dataSetJSON.duration)
            })
        })

        context('when the json is undefined', () => {
            it('should return an SleepPatternDataSet model with all attributes with undefined value', () => {
                const result = new SleepPatternDataSet().fromJSON(undefined)
                assert.isUndefined(result.start_time)
                assert.isUndefined(result.name)
                assert.isUndefined(result.duration)
            })
        })

        context('when the json is a string', () => {
            it('should transform the string in json and return SleepPatternDataSet model', () => {
                const result = new SleepPatternDataSet().fromJSON(JSON.stringify(dataSetJSON))
                assert.deepPropertyVal(result, 'start_time', dataSetJSON.start_time.toISOString())
                assert.propertyVal(result, 'name', dataSetJSON.name)
                assert.propertyVal(result, 'duration', dataSetJSON.duration)
            })
        })
    })

    describe('toJSON()', () => {
        context('when the SleepPatternDataSet model is correct', () => {
            it('should return a JSON from SleepPatternDataSet model', () => {
                let result = new SleepPatternDataSet().fromJSON(dataSetJSON)
                result = result.toJSON()
                assert(result.start_time, 'start_time must not be undefined')
                assert.propertyVal(result, 'name', dataSetJSON.name)
                assert.propertyVal(result, 'duration', dataSetJSON.duration)
            })
        })
    })
})
