import { IRepository } from './repository.interface'
import { PhysicalActivity } from '../domain/model/physical.activity'

/**
 * Interface of the physicalactivity repository.
 * Must be implemented by the physicalactivity repository at the infrastructure layer.
 *
 * @see {@link PhysicalActivityRepository} for further information.
 * @extends {IRepository<PhysicalActivity>}
 */
export interface IPhysicalActivityRepository extends IRepository<PhysicalActivity> {
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
     * Checks if an physicalactivity already has a registration.
     * What differs from one physicalactivity to another is the start date and associated patient.
     *
     * @param activity
     * @return {Promise<boolean>} True if it exists or False, otherwise
     * @throws {ValidationException | RepositoryException}
     */
    checkExist(activity: PhysicalActivity): Promise<boolean>

    /**
     * Removes all physical activities associated with the patientId received.
     *
     * @param patientId Patient id associated with physical activities.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    removeAllByPatient(patientId: string): Promise<boolean>

    /**
     * Returns the total of activities of a patient.
     *
     * @param patientId Patient id associated with physical activities.
     * @return {Promise<number>}
     * @throws {RepositoryException}
     */
    countByPatient(patientId: string): Promise<number>

    /**
     * Updates or creates a Physical Activity.
     *
     * @param item Physical Activity to be updated or created.
     * @return {Promise<any>}
     * @throws {RepositoryException}
     */
    updateOrCreate(item: any): Promise<any>
}
