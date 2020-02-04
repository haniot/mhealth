import { IService } from './service.interface'
import { IQuery } from './query.interface'
import { Sleep } from '../domain/model/sleep'

/**
 * Sleep service interface.
 *
 * @extends {IService<Sleep>}
 */
export interface ISleepService extends IService<Sleep> {
    /**
     * Add a new Sleep or a list of Sleep.
     *
     * @param sleep Sleep | Array<Sleep> to insert.
     * @return {Promise<Sleep | any>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    add(sleep: Sleep | Array<Sleep>): Promise<Sleep | any>
    /**
     * List the sleep of a patient.
     *
     * @param patientId Patient ID.
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<Sleep>>}
     * @throws {RepositoryException}
     */
    getAllByPatient(patientId: string, query: IQuery): Promise<Array<Sleep>>

    /**
     * Retrieve sleep by unique identifier (ID)  and related patient.
     *
     * @param sleepId Sleep unique identifier.
     * @param patientId Patient unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<Sleep>}
     * @throws {RepositoryException}
     */
    getByIdAndPatient(sleepId: string, patientId: string, query: IQuery): Promise<Sleep>

    /**
     * Removes sleep according to its unique identifier and related patient.
     *
     * @param sleepId Sleep unique identifier.
     * @param patientId Patient unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    removeByPatient(sleepId: string, patientId: string): Promise<boolean>
}
