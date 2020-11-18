import { IService } from './service.interface'
import { SleepDuration } from '../domain/model/sleep.duration'

/**
 * SleepDuration service interface.
 *
 * @extends {IService<SleepDuration>}
 */
export interface ISleepDurationService extends IService<SleepDuration> {
    /**
     * Retrieves all sleep durations by patient.
     *
     * @param patientId Patient unique identifier.
     * @param startDate Start date in the format `yyyy-MM-dd`.
     * @param endDate End date in the format `yyyy-MM-dd`.
     * @return {Promise<SleepDuration>}
     * @throws {ValidationException | RepositoryException}
     */
    getDurationByPatient(patientId: string, startDate: string, endDate: string): Promise<SleepDuration>
}
