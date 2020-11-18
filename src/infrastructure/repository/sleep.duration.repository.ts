import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { BaseRepository } from './base/base.repository'
import { Query } from './query/query'
import { ILogger } from '../../utils/custom.logger'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { SleepDuration } from '../../application/domain/model/sleep.duration'
import { SleepDurationQueryFilters } from './utils/sleep.duration.query.filters'
import { SleepDurationEntity } from '../entity/sleep.duration.entity'
import { ISleepDurationRepository } from '../../application/port/sleep.duration.repository.interface'
import moment from 'moment'

/**
 * Implementation of the SleepDuration repository.
 *
 * @implements {ISleepDurationRepository}
 */
@injectable()
export class SleepDurationRepository extends BaseRepository<SleepDuration, SleepDurationEntity>
    implements ISleepDurationRepository {
    constructor(
        @inject(Identifier.SLEEP_REPO_MODEL) readonly sleepModel: any,
        @inject(Identifier.SLEEP_DURATION_ENTITY_MAPPER)
            readonly sleepDurationMapper: IEntityMapper<SleepDuration, SleepDurationEntity>,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
        super(sleepModel, sleepDurationMapper, logger)
    }

    /**
     * Aggregates a patient's total sleep duration per day.
     *
     * @param patientId Patient unique identifier.
     * @param startDate Start date in the format `yyyy-MM-dd`.
     * @param endDate End date in the format `yyyy-MM-dd`.
     * @return {Promise<SleepDuration>}
     * @throws {ValidationException | RepositoryException}
     */
    public aggregateDurationPyPatient(patientId: string, startDate: string, endDate: string): Promise<SleepDuration> {
        const q: any = new Query().toJSON()

        // Retrieves Date object in utc from date parameters.
        const startTime = moment(`${startDate}T00:00:00`).utc().toDate()
        const endTime = moment(`${endDate}T23:59:59`).utc().toDate()

        // Creates filters and assign them to the query that will be used in the aggregation.
        const queryAggregateFilters = new SleepDurationQueryFilters()
        q.filters = queryAggregateFilters.buildFilters(patientId, startTime, endTime)

        return new Promise<SleepDuration>((resolve, reject) => {
            this.sleepModel.aggregate(q.filters)
                .exec()
                .then(result => {
                    if (result.length) {
                        result[0].start_date = startDate
                        result[0].end_date = endDate

                        return resolve(this.sleepDurationMapper.transform(result[0]))
                    }
                    // When the result is an empty array.
                    result.start_date = startDate
                    result.end_date = endDate
                    resolve(this.sleepDurationMapper.transform(result))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }
}
