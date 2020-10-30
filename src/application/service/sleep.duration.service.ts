import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IQuery } from '../port/query.interface'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { Strings } from '../../utils/strings'
import { SleepDuration } from '../domain/model/sleep.duration'
import { DateValidator } from '../domain/validator/date.validator'
import { ISleepDurationService } from '../port/sleep.duration.service.interface'
import { ISleepDurationRepository } from '../port/sleep.duration.repository.interface'
import { DateRangeValidator } from '../domain/validator/date.range.validator'

/**
 * Implementing SleepDuration Service.
 *
 * @implements {ISleepDurationService}
 */
@injectable()
export class SleepDurationService implements ISleepDurationService {

    constructor(@inject(Identifier.SLEEP_DURATION_REPOSITORY)
                        private readonly _sleepDurationRepository: ISleepDurationRepository) {
    }

    /**
     * Retrieves all sleep durations by patient.
     *
     * @param patientId Patient unique identifier.
     * @param startDate Start date in the format `yyyy-MM-dd`.
     * @param endDate End date in the format `yyyy-MM-dd`.
     * @return {Promise<SleepDuration>}
     * @throws {ValidationException | RepositoryException}
     */
    public getDurationByPatient(patientId: string, startDate: string, endDate: string): Promise<SleepDuration> {
        try {
            // Constructs dates in the appropriate format.
            startDate = this.buildDate(startDate)
            endDate = this.buildDate(endDate)

            // Validates params.
            ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
            DateValidator.validate(startDate)
            DateValidator.validate(endDate)
            DateRangeValidator.validate(startDate, endDate)

            // Calls the repository.
            return this._sleepDurationRepository.aggregateDurationPyPatient(patientId, startDate, endDate)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Builds the date in yyyy-MM-dd format if it is 'today'.
     *
     * @param date Date used to construct the final date.
     * @return {string}
     */
    private buildDate(date: string): string {
        return date === 'today' ? this.generateSimpleDate() : date
    }

    private generateSimpleDate(): string {
        const date = new Date()
        return [
            date.getFullYear().toString(),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getDate().toString().padStart(2, '0')
        ].join('-')
    }

    public add(item: SleepDuration): Promise<SleepDuration> {
        throw new Error('Unsupported feature!')
    }

    public getAll(query: IQuery): Promise<Array<SleepDuration>> {
        throw new Error('Unsupported feature!')
    }

    public getById(id: string, query: IQuery): Promise<SleepDuration> {
        throw new Error('Unsupported feature!')
    }

    public update(item: SleepDuration): Promise<SleepDuration> {
        throw new Error('Unsupported feature!')
    }

    public remove(id: string): Promise<boolean> {
        throw new Error('Unsupported feature!')
    }

    public count(query: IQuery): Promise<number> {
        throw new Error('Unsupported feature!')
    }
}
