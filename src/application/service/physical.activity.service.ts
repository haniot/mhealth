import HttpStatus from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IPhysicalActivityService } from '../port/physical.activity.service.interface'
import { IPhysicalActivityRepository } from '../port/physical.activity.repository.interface'
import { PhysicalActivity } from '../domain/model/physical.activity'
import { CreatePhysicalActivityValidator } from '../domain/validator/create.physical.activity.validator'
import { ConflictException } from '../domain/exception/conflict.exception'
import { IQuery } from '../port/query.interface'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { Strings } from '../../utils/strings'
import { MultiStatus } from '../domain/model/multi.status'
import { StatusSuccess } from '../domain/model/status.success'
import { StatusError } from '../domain/model/status.error'
import { ValidationException } from '../domain/exception/validation.exception'

/**
 * Implementing Physical Activity Service.
 *
 * @implements {IPhysicalActivityService}
 */
@injectable()
export class PhysicalActivityService implements IPhysicalActivityService {

    constructor(@inject(Identifier.ACTIVITY_REPOSITORY) private readonly _activityRepository: IPhysicalActivityRepository) {
    }

    /**
     * Adds a new PhysicalActivity or a list of PhysicalActivity.
     *
     * @param {PhysicalActivity | Array<PhysicalActivity>} activity
     * @returns {(Promise<PhysicalActivity | MultiStatus<PhysicalActivity>)}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    public async add(activity: PhysicalActivity | Array<PhysicalActivity>):
        Promise<PhysicalActivity | MultiStatus<PhysicalActivity>> {
        if (activity instanceof Array) return this.addMultipleActivities(activity)
        return this.addActivity(activity)
    }

    /**
     * Adds the data of multiple items of PhysicalActivity.
     * Before adding, it is checked whether each of the activities already exists.
     *
     * @param activity
     * @return {Promise<MultiStatus<PhysicalActivity>>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    private async addMultipleActivities(activity: Array<PhysicalActivity>): Promise<MultiStatus<PhysicalActivity>> {
        const multiStatus: MultiStatus<PhysicalActivity> = new MultiStatus<PhysicalActivity>()
        const statusSuccessArr: Array<StatusSuccess<PhysicalActivity>> = new Array<StatusSuccess<PhysicalActivity>>()
        const statusErrorArr: Array<StatusError<PhysicalActivity>> = new Array<StatusError<PhysicalActivity>>()

        for (const elem of activity) {
            try {
                // 1. Add each activity from the array
                const activityResult = await this.addActivity(elem)

                // 2. Create a StatusSuccess object for the construction of the MultiStatus response.
                const statusSuccess: StatusSuccess<PhysicalActivity> =
                    new StatusSuccess<PhysicalActivity>(HttpStatus.CREATED, activityResult)
                statusSuccessArr.push(statusSuccess)
            } catch (err) {
                let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
                if (err instanceof ValidationException) statusCode = HttpStatus.BAD_REQUEST
                if (err instanceof ConflictException) statusCode = HttpStatus.CONFLICT

                // 3. Create a StatusError object for the construction of the MultiStatus response.
                const statusError: StatusError<PhysicalActivity> = new StatusError<PhysicalActivity>(statusCode, err.message,
                    err.description, elem)
                statusErrorArr.push(statusError)
            }
        }

        // 4. Build the MultiStatus response.
        multiStatus.success = statusSuccessArr
        multiStatus.error = statusErrorArr

        // 5. Returns the created MultiStatus object.
        return Promise.resolve(multiStatus)
    }

    /**
     * Adds the data of one item of PhysicalActivity.
     * Before adding, it is checked whether the activity already exists.
     *
     * @param activity PhysicalActivity
     * @return {Promise<Activity>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    private async addActivity(activity: PhysicalActivity): Promise<PhysicalActivity> {
        try {
            // 1. Validate the object.
            CreatePhysicalActivityValidator.validate(activity)

            // 2. Checks if physical activity already exists.
            const activityExist = await this._activityRepository.checkExist(activity)
            if (activityExist) throw new ConflictException(Strings.PHYSICAL_ACTIVITY.ALREADY_REGISTERED)

            // 3. Add PhysicalActivity.
            return this._activityRepository.create(activity)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Get the data of all physicalactivity in the infrastructure.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<PhysicalActivity>>}
     * @throws {RepositoryException}
     */
    public async getAll(query: IQuery): Promise<Array<PhysicalActivity>> {
        throw new Error('Unsupported feature!')
    }

    /**
     * Get in infrastructure the physicalactivity data.
     *
     * @param id Unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<PhysicalActivity>}
     * @throws {RepositoryException}
     */
    public async getById(id: string, query: IQuery): Promise<PhysicalActivity> {
        throw new Error('Unsupported feature!')
    }

    /**
     * Retrieve physicalactivity by unique identifier (ID) and patient ID.
     *
     * @param activityId PhysicalActivity ID.
     * @param patientId Patient ID.
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<PhysicalActivity>>}
     * @throws {RepositoryException}
     */
    public getByIdAndPatient(activityId: string, patientId: string, query: IQuery): Promise<PhysicalActivity> {
        ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
        ObjectIdValidator.validate(activityId, Strings.PHYSICAL_ACTIVITY.PARAM_ID_NOT_VALID_FORMAT)

        return this._activityRepository.findOne(query)
    }

    /**
     * List the activities of a patient.
     *
     * @param patientId Patient ID.
     * @param query Defines object to be used for queries.
     * @return {Promise<PhysicalActivity>}`
     * @throws {ValidationException | RepositoryException}
     */
    public getAllByPatient(patientId: string, query: IQuery): Promise<Array<PhysicalActivity>> {
        ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)

        return this._activityRepository.find(query)
    }

    /**
     * Removes physicalactivity according to its unique identifier and related patient.
     *
     * @param activityId Unique identifier.
     * @param patientId Patient ID.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async removeByPatient(activityId: string, patientId: string): Promise<boolean> {
        try {
            // 1. Validate id's
            ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
            ObjectIdValidator.validate(activityId, Strings.PHYSICAL_ACTIVITY.PARAM_ID_NOT_VALID_FORMAT)

            // 2. Create a PhysicalActivity with only one attribute.
            const activityToBeDeleted: PhysicalActivity = new PhysicalActivity()
            activityToBeDeleted.id = activityId

            const wasDeleted: boolean = await this._activityRepository.removeByPatient(activityId, patientId)

            // 3. Returns if activity was deleted
            return Promise.resolve(wasDeleted)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(physicalActivity: PhysicalActivity): Promise<PhysicalActivity> {
        throw new Error('Unsupported feature!')
    }

    public async remove(id: string): Promise<boolean> {
        throw new Error('Unsupported feature!')
    }

    /**
     * Returns the total of activities according to the query.
     *
     * @param query Defines object to be used for query.
     * @return {Promise<number>}
     * @throws {ValidationException | RepositoryException}
     */
    public async count(query: IQuery): Promise<number> {
        return this._activityRepository.count(query)
    }
}
