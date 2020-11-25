import HttpStatus from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { ConflictException } from '../domain/exception/conflict.exception'
import { IQuery } from '../port/query.interface'
import { ISleepService } from '../port/sleep.service.interface'
import { ISleepRepository } from '../port/sleep.repository.interface'
import { Sleep } from '../domain/model/sleep'
import { CreateSleepValidator } from '../domain/validator/create.sleep.validator'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { Strings } from '../../utils/strings'
import { MultiStatus } from '../domain/model/multi.status'
import { StatusSuccess } from '../domain/model/status.success'
import { StatusError } from '../domain/model/status.error'
import { ValidationException } from '../domain/exception/validation.exception'
import { AwakeningsTask } from '../../background/task/awakenings.task'
import { ILogger } from '../../utils/custom.logger'

/**
 * Implementing sleep Service.
 *
 * @implements {ISleepService}
 */
@injectable()
export class SleepService implements ISleepService {

    constructor(@inject(Identifier.SLEEP_REPOSITORY) private readonly _sleepRepository: ISleepRepository,
                @inject(Identifier.AWAKENINGS_TASK) private readonly _awakeningsTask: AwakeningsTask,
                @inject(Identifier.LOGGER) private readonly _logger: ILogger) {
    }

    /**
     * Adds a new sleep or a list of Sleep.
     * Before adding, it is checked whether the sleep already exists.
     *
     * @param {Sleep | Array<Sleep>} sleep
     * @returns {(Promise<Sleep | MultiStatus<Sleep> | undefined>)}
     * @throws {ConflictException | RepositoryException} If a data conflict occurs, as an existing sleep.
     */
    public async add(sleep: Sleep | Array<Sleep>): Promise<Sleep | MultiStatus<Sleep> | undefined> {
        if (sleep instanceof Array) return this.addMultipleSleep(sleep)
        return this.addSleep(sleep)
    }

    /**
     * Adds the data of multiple items of Sleep.
     * Before adding, it is checked whether each of the sleep objects already exists.
     *
     * @param sleep
     * @return {Promise<MultiStatus<Sleep>>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    private async addMultipleSleep(sleep: Array<Sleep>): Promise<MultiStatus<Sleep>> {
        const multiStatus: MultiStatus<Sleep> = new MultiStatus<Sleep>()
        const statusSuccessArr: Array<StatusSuccess<Sleep>> = new Array<StatusSuccess<Sleep>>()
        const statusErrorArr: Array<StatusError<Sleep>> = new Array<StatusError<Sleep>>()

        for (const elem of sleep) {
            try {
                // Add each sleep from the array
                const sleepResult = await this.addSleep(elem)

                // Create a StatusSuccess object for the construction of the MultiStatus response.
                const statusSuccess: StatusSuccess<Sleep> = new StatusSuccess<Sleep>(HttpStatus.CREATED, sleepResult)
                statusSuccessArr.push(statusSuccess)
            } catch (err) {
                let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
                if (err instanceof ValidationException) statusCode = HttpStatus.BAD_REQUEST
                if (err instanceof ConflictException) statusCode = HttpStatus.CONFLICT

                // Create a StatusError object for the construction of the MultiStatus response.
                const statusError: StatusError<Sleep> = new StatusError<Sleep>(statusCode, err.message,
                    err.description, elem)
                statusErrorArr.push(statusError)
            }
        }

        // Build the MultiStatus response.
        multiStatus.success = statusSuccessArr
        multiStatus.error = statusErrorArr

        // Returns the created MultiStatus object.
        return Promise.resolve(multiStatus)
    }

    /**
     * Adds the data of one item of Sleep.
     * Before adding, it is checked whether the sleep already exists.
     *
     * @param sleep Sleep
     * @return {Promise<Sleep | undefined>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    private async addSleep(sleep: Sleep): Promise<Sleep | undefined> {
        try {
            // 1. Validate the object.
            CreateSleepValidator.validate(sleep)

            // 2. Checks if sleep already exists.
            const sleepExist = await this._sleepRepository.checkExist(sleep)
            if (sleepExist) throw new ConflictException(Strings.SLEEP.ALREADY_REGISTERED)

            // 3. Add Sleep.
            const sleepCreate: Sleep | undefined = await this._sleepRepository.create(sleep)
            if (!sleepCreate) return Promise.resolve(sleepCreate)

            // 4. Calculate awakenings for the created sleep.
            return this._internalAwkCalculate(sleepCreate)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Get the data of all sleep in the infrastructure.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<Sleep>>}
     * @throws {RepositoryException}
     */
    public async getAll(query: IQuery): Promise<Array<Sleep>> {
        throw new Error('Unsupported feature!')
    }

    /**
     * Get in infrastructure the sleep data.
     *
     * @param id Unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<Sleep>}
     * @throws {RepositoryException}
     */
    public async getById(id: string | number, query: IQuery): Promise<Sleep> {
        throw new Error('Unsupported feature!')
    }

    /**
     * Retrieve sleep by unique identifier (ID) and patient ID.
     *
     * @param sleepId Sleep unique identifier.
     * @param patientId Patient unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<Sleep | undefined>}
     * @throws {RepositoryException}
     */
    public async getByIdAndPatient(sleepId: string, patientId: string, query: IQuery): Promise<Sleep | undefined> {
        // 1. Validate params.
        ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
        ObjectIdValidator.validate(sleepId, Strings.SLEEP.PARAM_ID_NOT_VALID_FORMAT)

        // 2. Find Sleep.
        const sleepRepo: Sleep | undefined = await this._sleepRepository.findOne(query)
        if (!sleepRepo) return Promise.resolve(sleepRepo)

        // 3. Calculate awakenings for the returned sleep.
        return this._internalAwkCalculate(sleepRepo)
    }

    /**
     * List the sleep of a patient.
     *
     * @param patientId Patient unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<Sleep>}
     * @throws {ValidationException | RepositoryException}
     */
    public getAllByPatient(patientId: string, query: IQuery): Promise<Array<Sleep>> {
        ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)

        return this._sleepRepository.find(query)
    }

    /**
     * Remove sleep according to its unique identifier and related patient.
     *
     * @param sleepId Unique identifier.
     * @param patientId Patient unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async removeByPatient(sleepId: string, patientId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
            ObjectIdValidator.validate(sleepId, Strings.SLEEP.PARAM_ID_NOT_VALID_FORMAT)

            return this._sleepRepository.removeByPatient(sleepId, patientId)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(sleep: Sleep): Promise<Sleep> {
        throw new Error('Unsupported feature!')
    }

    public async remove(id: string): Promise<boolean> {
        throw new Error('Unsupported feature!')
    }

    /**
     * Returns the total of sleep objects according to the query.
     *
     * @param query Defines object to be used for query.
     * @return {Promise<number>}
     * @throws {ValidationException | RepositoryException}
     */
    public async count(query: IQuery): Promise<number> {
        return this._sleepRepository.count(query)
    }

    /**
     * Returns a Sleep updated with a awakenings object.
     *
     * @param sleep Sleep that will have its awakenings calculated.
     * @return {Promise<Sleep>}
     * @throws {RepositoryException}
     */
    private async _internalAwkCalculate(sleep: Sleep): Promise<Sleep> {
        try {
            const sleepUp: Sleep = await this._awakeningsTask.calculateAwakenings(sleep)
            return Promise.resolve(sleepUp)
        } catch (err) {
            this._logger.error(`An error occurred while attempting calculate awakenings `
                .concat(`for the sleep with id: ${sleep.id}. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
            return Promise.resolve(sleep)
        }
    }
}
