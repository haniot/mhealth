import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { SleepNightAwakening } from '../../../src/application/domain/model/sleep.night.awakening'

describe('MODELS: SleepNightAwakening', () => {
    const sleepNightAwakeningJSON: any = DefaultEntityMock.SLEEP_NIGHT_AWAKENING

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a SleepNightAwakening from a complete json', () => {
                const result: SleepNightAwakening = new SleepNightAwakening().fromJSON(sleepNightAwakeningJSON)

                assert.propertyVal(result, 'start_time', sleepNightAwakeningJSON.start_time)
                assert.propertyVal(result, 'end_time', sleepNightAwakeningJSON.end_time)
                assert.propertyVal(result, 'steps', sleepNightAwakeningJSON.steps)
            })

            it('should return a SleepNightAwakening with some attributes equal to undefined from an empty json', () => {
                const result: SleepNightAwakening = new SleepNightAwakening().fromJSON({})

                assert.isEmpty(result)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a SleepNightAwakening with some attributes equal to undefined from an undefined json', () => {
                const result: SleepNightAwakening = new SleepNightAwakening().fromJSON(undefined)

                assert.isEmpty(result)
            })
        })

        context('when the json is a string', () => {
            it('should return a SleepNightAwakening from a complete json', () => {
                const result: SleepNightAwakening = new SleepNightAwakening().fromJSON(JSON.stringify(sleepNightAwakeningJSON))

                assert.propertyVal(result, 'start_time', sleepNightAwakeningJSON.start_time)
                assert.propertyVal(result, 'end_time', sleepNightAwakeningJSON.end_time)
                assert.propertyVal(result, 'steps', sleepNightAwakeningJSON.steps)
            })

            it('should return a SleepNightAwakening with some attributes equal to undefined from an empty string', () => {
                const result: SleepNightAwakening = new SleepNightAwakening().fromJSON(JSON.stringify(''))

                assert.isEmpty(result)
            })

            it('should return a SleepNightAwakening with some attributes equal to undefined from an invalid string', () => {
                const result: SleepNightAwakening = new SleepNightAwakening().fromJSON('d52215d412')

                assert.isEmpty(result)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete SleepNightAwakening', () => {
                const sleepNightAwakening: SleepNightAwakening = new SleepNightAwakening().fromJSON(sleepNightAwakeningJSON)
                const result: any = sleepNightAwakening.toJSON()

                assert.propertyVal(result, 'start_time', sleepNightAwakeningJSON.start_time)
                assert.propertyVal(result, 'end_time', sleepNightAwakeningJSON.end_time)
                assert.propertyVal(result, 'steps', sleepNightAwakeningJSON.steps)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete SleepNightAwakening', () => {
                const result: any = new SleepNightAwakening().toJSON()

                assert.isUndefined(result.start_time)
                assert.isUndefined(result.end_time)
                assert.isUndefined(result.steps)
            })
        })
    })
})
