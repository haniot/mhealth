import { SleepDurationQueryFilters } from '../../../src/infrastructure/repository/utils/sleep.duration.query.filters'
import { SleepDurationQueryFiltersAssert } from '../../utils/sleep.duration.query.filters.assert'

describe('REPOSITORIES/UTILS: SleepDurationQueryFilters', () => {
    // Instantiates SleepDurationQueryFilters.
    const sleepDurationQueryFilters: SleepDurationQueryFilters = new SleepDurationQueryFilters()

    // Instantiates SleepDurationQueryFiltersAssert to use its assert functions.
    const sleepDurationFiltersAssert: SleepDurationQueryFiltersAssert = new SleepDurationQueryFiltersAssert()

    // Valid attributes.
    const patientId = '5a62be07d6f33400146c9b61'
    const startDate = new Date('2020-11-01')
    const endDate = new Date('2020-11-05')

    context('when parameters are valid', () => {
        it('should return an array with the correct filters for a monthly BalanceSummary', () => {
            const result = sleepDurationQueryFilters.buildFilters(patientId, startDate, endDate)

            sleepDurationFiltersAssert.assertAggregateFilters(result, patientId, startDate, endDate)
        })
    })
})
