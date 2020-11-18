import { IRepository } from './repository.interface'
import { SleepDuration } from '../domain/model/sleep.duration'

/**
 * Interface of the SleepDuration repository.
 * Must be implemented by the SleepDuration repository at the infrastructure layer.
 *
 * @see {@link SleepDurationRepository} for further information.
 * @extends {IRepository<SleepDuration>}
 */
export interface ISleepDurationRepository extends IRepository<SleepDuration> {
    /**
     * Aggregates a patient's total sleep duration per day.
     *
     * @param patientId Patient unique identifier.
     * @param startDate Start date in the format `yyyy-MM-dd`.
     * @param endDate End date in the format `yyyy-MM-dd`.
     * @return {Promise<SleepDuration>}
     * @throws {ValidationException | RepositoryException}
     */
    aggregateDurationPyPatient(patientId: string, startDate: string, endDate: string): Promise<SleepDuration>
}
