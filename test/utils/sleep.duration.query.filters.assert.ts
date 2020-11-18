import { SleepDurationQueryFiltersMock } from '../mocks/repositories/utils/sleep.duration.query.filters.mock'
import { assert } from 'chai'
import { Phases } from '../../src/application/domain/utils/phases'

export class SleepDurationQueryFiltersAssert {
    /**
     * Executes assert statements on the attributes of an array of filters returned from the buildFilters method
     * of the SleepDurationQueryFilters class.
     *
     * @param result Array of filters returned from the SleepDurationQueryFilters class.
     * @param patientId Patient unique identifier.
     * @param startTime Start date in the format `yyyy-MM-ddTHH:mm:ss[Z]`.
     * @param endTime End date in the format `yyyy-MM-ddTHH:mm:ss[Z]`.
     * @return {void}
     */
    public assertAggregateFilters(result: Array<object>, patientId: string, startTime: Date, endTime: Date): void {
        const summaryAggregateFiltersMock: SleepDurationQueryFiltersMock = new SleepDurationQueryFiltersMock()

        assert.deepEqual(result[0], summaryAggregateFiltersMock.buildMatchFilter(patientId, startTime, endTime))
        assert.deepEqual(result[1], summaryAggregateFiltersMock.setTotalDuration('$pattern', 0, [Phases.AWAKE, Phases.RESTLESS]))
        assert.deepEqual(result[2], summaryAggregateFiltersMock.groupByEndTime())
        assert.deepEqual(result[3], summaryAggregateFiltersMock.projectDate())
        assert.deepEqual(result[4], summaryAggregateFiltersMock.groupDataSet())
        assert.deepEqual(result[5], summaryAggregateFiltersMock.projectSummary())
    }
}
