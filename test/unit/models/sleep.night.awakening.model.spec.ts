import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { SleepAwakening } from '../../../src/application/domain/model/sleep.awakening'

describe('MODELS: SleepAwakening', () => {
    const sleepAwakeningJSON: any = DefaultEntityMock.SLEEP_AWAKENING

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a SleepAwakening from a complete json', () => {
                const result: SleepAwakening = new SleepAwakening().fromJSON(sleepAwakeningJSON)

                assert.propertyVal(result, 'start_time', sleepAwakeningJSON.start_time)
                assert.propertyVal(result, 'end_time', sleepAwakeningJSON.end_time)
                assert.propertyVal(result, 'duration', sleepAwakeningJSON.duration)
                assert.propertyVal(result, 'steps', sleepAwakeningJSON.steps)
            })

            it('should return a SleepAwakening with some attributes equal to undefined from an empty json', () => {
                const result: SleepAwakening = new SleepAwakening().fromJSON({})

                assert.isEmpty(result)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a SleepAwakening with some attributes equal to undefined from an undefined json', () => {
                const result: SleepAwakening = new SleepAwakening().fromJSON(undefined)

                assert.isEmpty(result)
            })
        })

        context('when the json is a string', () => {
            it('should return a SleepAwakening from a complete json', () => {
                const result: SleepAwakening = new SleepAwakening().fromJSON(JSON.stringify(sleepAwakeningJSON))

                assert.propertyVal(result, 'start_time', sleepAwakeningJSON.start_time)
                assert.propertyVal(result, 'end_time', sleepAwakeningJSON.end_time)
                assert.propertyVal(result, 'duration', sleepAwakeningJSON.duration)
                assert.propertyVal(result, 'steps', sleepAwakeningJSON.steps)
            })

            it('should return a SleepAwakening with some attributes equal to undefined from an empty string', () => {
                const result: SleepAwakening = new SleepAwakening().fromJSON(JSON.stringify(''))

                assert.isEmpty(result)
            })

            it('should return a SleepAwakening with some attributes equal to undefined from an invalid string', () => {
                const result: SleepAwakening = new SleepAwakening().fromJSON('d52215d412')

                assert.isEmpty(result)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete SleepAwakening', () => {
                const sleepAwakening: SleepAwakening = new SleepAwakening().fromJSON(sleepAwakeningJSON)
                const result: any = sleepAwakening.toJSON()

                assert.propertyVal(result, 'start_time', sleepAwakeningJSON.start_time)
                assert.propertyVal(result, 'end_time', sleepAwakeningJSON.end_time)
                assert.propertyVal(result, 'duration', sleepAwakeningJSON.duration)
                assert.propertyVal(result, 'steps', sleepAwakeningJSON.steps)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete SleepAwakening', () => {
                const result: any = new SleepAwakening().toJSON()

                assert.isUndefined(result.start_time)
                assert.isUndefined(result.end_time)
                assert.isUndefined(result.duration)
                assert.isUndefined(result.steps)
            })
        })
    })
})
