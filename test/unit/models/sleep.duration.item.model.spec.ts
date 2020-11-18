import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { SleepDurationItem } from '../../../src/application/domain/model/sleep.duration.item'

describe('MODELS: SleepDurationItem', () => {
    const sleepDurationItemJSON: any = DefaultEntityMock.SLEEP_DURATION_ITEM

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a SleepDurationItem from a complete json', () => {
                const result: SleepDurationItem = new SleepDurationItem().fromJSON(sleepDurationItemJSON)

                assert.propertyVal(result, 'date', sleepDurationItemJSON.date)
                assert.propertyVal(result, 'value', sleepDurationItemJSON.value)
            })

            it('should return an empty SleepDurationItem from an empty json', () => {
                const result: SleepDurationItem = new SleepDurationItem().fromJSON({})

                assert.isEmpty(result)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an empty SleepDurationItem from an undefined json', () => {
                const result: SleepDurationItem = new SleepDurationItem().fromJSON(undefined)

                assert.isEmpty(result)
            })
        })

        context('when the json is a string', () => {
            it('should return a SleepDurationItem from a complete json', () => {
                const result: SleepDurationItem = new SleepDurationItem().fromJSON(JSON.stringify(sleepDurationItemJSON))

                assert.propertyVal(result, 'date', sleepDurationItemJSON.date)
                assert.propertyVal(result, 'value', sleepDurationItemJSON.value)
            })

            it('should return an empty SleepDurationItem from an empty string', () => {
                const result: SleepDurationItem = new SleepDurationItem().fromJSON(JSON.stringify(''))

                assert.isEmpty(result)
            })

            it('should return an empty SleepDurationItem from an invalid string', () => {
                const result: SleepDurationItem = new SleepDurationItem().fromJSON('d52215d412')

                assert.isEmpty(result)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete SleepDurationItem', () => {
                const sleepDurationItem: SleepDurationItem = new SleepDurationItem().fromJSON(sleepDurationItemJSON)
                const result: any = sleepDurationItem.toJSON()

                assert.propertyVal(result, 'date', sleepDurationItemJSON.date)
                assert.propertyVal(result, 'value', sleepDurationItemJSON.value)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete SleepDurationItem', () => {
                const result: any = new SleepDurationItem().toJSON()

                assert.isUndefined(result.date)
                assert.isUndefined(result.value)
            })
        })
    })
})
