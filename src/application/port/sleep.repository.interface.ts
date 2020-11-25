import { IRepository } from './repository.interface'
import { Sleep } from '../domain/model/sleep'

/**
 * Interface of the sleep repository.
 * Must be implemented by the sleep repository at the infrastructure layer.
 *
 * @see {@link SleepRepository} for further information.
 * @extends {IRepository<Sleep>}
 */
export interface ISleepRepository extends IRepository<Sleep> {
    /**
     * Removes sleep according to its unique identifier and related patient.
     *
     * @param sleepId Sleep unique identifier.
     * @param patientId Patient unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    removeByPatient(sleepId: string, patientId: string): Promise<boolean>

    /**
     * Checks if an sleep already has a registration.
     * What differs from one sleep to another is the start date and associated patient.
     *
     * @param sleep
     * @return {Promise<boolean>} True if it exists or False, otherwise
     * @throws {ValidationException | RepositoryException}
     */
    checkExist(sleep: Sleep): Promise<boolean>

    /**
     * Removes all sleep objects associated with the patientId received.
     *
     * @param patientId Patient id associated with sleep objects.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    removeAllByPatient(patientId: string): Promise<boolean>

    /**
     * Updates or creates a Sleep.
     *
     * @param item Sleep to be updated or created.
     * @return {Promise<Sleep | undefined>}
     * @throws {RepositoryException}
     */
    updateOrCreate(item: Sleep): Promise<Sleep | undefined>
}
