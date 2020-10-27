import { ObjectID } from 'bson'
import { assert } from 'chai'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { SleepPattern } from '../../../src/application/domain/model/sleep.pattern'
import { SleepPatternDataSet } from '../../../src/application/domain/model/sleep.pattern.data.set'
import { Phases } from '../../../src/application/domain/utils/phases'
import { SleepNightAwakening } from '../../../src/application/domain/model/sleep.night.awakening'

describe('Models: Sleep', () => {
    // Creating a sleepPattern
    const dataSetItem: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItem.start_time = '2018-08-18T01:30:30Z'
    dataSetItem.name = Phases.RESTLESS
    dataSetItem.duration = Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min milliseconds

    const dataSetItem2: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItem2.start_time = '2018-08-18T01:45:30Z'
    dataSetItem2.name = Phases.AWAKE
    dataSetItem2.duration = Math.floor(Math.random() * 3 + 1) * 60000 // 1-3min in milliseconds

    const dataSetItem3: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItem3.start_time = '2018-08-18T02:45:30Z'
    dataSetItem3.name = Phases.ASLEEP
    dataSetItem3.duration = Math.floor(Math.random() * 120 + 1) * 60000 // 1-180min in milliseconds

    const dataSet: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSet.push(dataSetItem)
    dataSet.push(dataSetItem2)
    dataSet.push(dataSetItem3)

    const sleepPattern: SleepPattern = new SleepPattern()
    sleepPattern.data_set = dataSet

    const nightAwakeningItem: SleepNightAwakening = new SleepNightAwakening()
    nightAwakeningItem.start_time = '01:30:30'
    nightAwakeningItem.end_time = '01:45:30'
    nightAwakeningItem.steps = 9

    const nightAwakeningItem2: SleepNightAwakening = new SleepNightAwakening()
    nightAwakeningItem2.start_time = '02:30:30'
    nightAwakeningItem2.end_time = '02:55:00'
    nightAwakeningItem2.steps = 17

    const sleepNightAwakening: Array<SleepNightAwakening> = new Array<SleepNightAwakening>()
    sleepNightAwakening.push(nightAwakeningItem)
    sleepNightAwakening.push(nightAwakeningItem2)

    const sleepJSON: any = {
        id: new ObjectID(),
        start_time: new Date(),
        end_time: new Date(),
        duration: 900000,
        patient_id: new ObjectID(),
        pattern: sleepPattern

    }

    describe('fromJSON(json: any)', () => {
        context('when the json is correct', () => {
            it('should return an Sleep model', () => {
                const result = new Sleep().fromJSON(sleepJSON)

                assert.propertyVal(result, 'id', sleepJSON.id)
                assert.propertyVal(result, 'start_time', sleepJSON.start_time)
                assert.propertyVal(result, 'end_time', sleepJSON.end_time)
                assert.propertyVal(result, 'duration', sleepJSON.duration)
                assert.deepPropertyVal(result, 'pattern', sleepJSON.pattern)
            })
        })

        context('when the json is undefined', () => {
            it('should return an Sleep model with all attributes with undefined value', () => {
                const result = new Sleep().fromJSON(undefined)
                assert.isUndefined(result.id)
                assert.isUndefined(result.start_time)
                assert.isUndefined(result.end_time)
                assert.isUndefined(result.duration)
                assert.isUndefined(result.patient_id)
                assert.isUndefined(result.pattern)
            })
        })

        context('when the json is a string', () => {
            it('should transform the string in json and return Sleep model', () => {
                const result = new Sleep().fromJSON(JSON.stringify(sleepJSON))
                assert.propertyVal(result, 'id', sleepJSON.id.toHexString())
                assert.deepPropertyVal(result, 'start_time', sleepJSON.start_time.toISOString())
                assert.deepPropertyVal(result, 'end_time', sleepJSON.end_time.toISOString())
                assert.propertyVal(result, 'duration', sleepJSON.duration)
                assert.deepPropertyVal(result, 'pattern', sleepJSON.pattern)
            })
        })
    })

    describe('toJSON()', () => {
        context('when the Sleep model is correct', () => {
            it('should return a JSON from Sleep model', () => {
                let result = new Sleep().fromJSON(sleepJSON)
                result.night_awakening = sleepNightAwakening

                result = result.toJSON()
                assert.propertyVal(result, 'id', sleepJSON.id)
                assert.propertyVal(result, 'start_time', sleepJSON.start_time)
                assert.propertyVal(result, 'end_time', sleepJSON.end_time)
                assert.propertyVal(result, 'duration', sleepJSON.duration)
                assert.deepPropertyVal(result, 'pattern', (new SleepPattern().fromJSON(sleepJSON.pattern)).toJSON())
                assert.deepPropertyVal(result, 'night_awakening', sleepNightAwakening.map(item => item.toJSON()))
            })
        })
    })
})
