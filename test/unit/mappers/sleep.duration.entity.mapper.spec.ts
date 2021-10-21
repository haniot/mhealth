import { assert } from 'chai'
import { SleepDurationEntityMapper } from '../../../src/infrastructure/entity/mapper/sleep.duration.entity.mapper'
import { SleepDuration } from '../../../src/application/domain/model/sleep.duration'
import { SleepDurationEntity } from '../../../src/infrastructure/entity/sleep.duration.entity'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MAPPERS: SleepDurationEntityMapper', () => {
    const sleepDurationEntityMapper: SleepDurationEntityMapper = new SleepDurationEntityMapper()

    // Create SleepDuration JSON.
    const sleepDurationJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.SLEEP_DURATION))
    sleepDurationJSON.start_date = '2020-10-31'
    sleepDurationJSON.end_date = '2020-11-02'

    describe('transform(item: any)', () => {
        context('when the parameter is of type SleepDuration', () => {
            it('should throw "Unsupported feature!" error', () => {
                try {
                    sleepDurationEntityMapper.transform(new SleepDuration())
                } catch (err: any) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })

        context('when the parameter is a JSON', () => {
            it('should return a SleepDuration from a complete JSON', () => {
                const result: SleepDuration = sleepDurationEntityMapper.transform(sleepDurationJSON)

                assert.isUndefined(result.id)
                assert.propertyVal(result.summary, 'total', sleepDurationJSON.summary.total)
                assert.propertyVal(result.data_set[0], 'date', sleepDurationJSON.data_set[0].date)
                assert.propertyVal(result.data_set[0], 'value', sleepDurationJSON.data_set[0].value)
                assert.propertyVal(result.data_set[1], 'date', sleepDurationJSON.data_set[1].date)
                assert.propertyVal(result.data_set[1], 'value', sleepDurationJSON.data_set[1].value)
                assert.propertyVal(result.data_set[2], 'date', sleepDurationJSON.data_set[2].date)
                assert.propertyVal(result.data_set[2], 'value', sleepDurationJSON.data_set[2].value)
            })

            it('should return a SleepDuration with some attributes equal to undefined from an empty JSON', () => {
                const result: SleepDuration = sleepDurationEntityMapper.transform({})

                assert.isUndefined(result.id)
                assert.propertyVal(result.summary, 'total', 0)
                assert.propertyVal(result.data_set[0], 'date', generateSimpleDate(new Date().toISOString()))
                assert.propertyVal(result.data_set[0], 'value', 0)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a SleepDuration with some attributes equal to undefined from undefined json', () => {
                const result: SleepDuration = sleepDurationEntityMapper.transform(undefined)

                assert.isUndefined(result.id)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    sleepDurationEntityMapper.modelEntityToModel(new SleepDurationEntity())
                } catch (err: any) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})

/**
 * Builds the date in format YYYY-MM-dd.
 *
 * @param dateString Date used to construct the final date.
 * @return {string}
 */
function generateSimpleDate(dateString: string): string {
    const date = new Date(dateString)
    return [
        date.getFullYear().toString(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0')
    ].join('-')
}
