import { IService } from './service.interface'
import { PhysicalActivity } from '../domain/model/physical.activity'
import { IQuery } from './query.interface'

/**
 * PhysicalActivity service interface.
 *
 * @extends {IService<PhysicalActivity>}
 */
export interface IPhysicalActivityService extends IService<PhysicalActivity> {
    /**
     * Add a new PhysicalActivity or a list of PhysicalActivity.
     *
     * @param physicalActivity PhysicalActivity | Array<PhysicalActivity> to insert.
     * @return {Promise<PhysicalActivity | any>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    add(physicalActivity: PhysicalActivity | Array<PhysicalActivity>): Promise<PhysicalActivity | any>
    /**
     * List the activities of a patient.
     *
     * @param patientId Patient ID.
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<PhysicalActivity>>}
     * @throws {RepositoryException}
     */
    getAllByPatient(patientId: string, query: IQuery): Promise<Array<PhysicalActivity>>

    /**
     * Retrieve physicalactivity by unique identifier (ID)  and related patient.
     *
     * @param activityId PhysicalActivity unique identifier.
     * @param patientId Patient unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<PhysicalActivity>}
     * @throws {RepositoryException}
     */
    getByIdAndPatient(activityId: string, patientId: string, query: IQuery): Promise<PhysicalActivity>

    /**
     * Removes physicalactivity according to its unique identifier and related patient.
     *
     * @param activityId PhysicalActivity unique identifier.
     * @param patientId Patient unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    removeByPatient(activityId: string, patientId: string): Promise<boolean>

    /**
     * Returns the total of activities of a patient.
     *
     * @param patientId Patient id associated with physical activities.
     * @return {Promise<number>}
     * @throws {RepositoryException}
     */
    countByPatient(patientId: string): Promise<number>
}
