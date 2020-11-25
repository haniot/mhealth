import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { BaseRepository } from './base/base.repository'
import { Query } from './query/query'
import { ILogger } from '../../utils/custom.logger'
import { ISleepRepository } from '../../application/port/sleep.repository.interface'
import { Sleep } from '../../application/domain/model/sleep'
import { SleepEntity } from '../entity/sleep.entity'
import { IEntityMapper } from '../port/entity.mapper.interface'

/**
 * Implementation of the sleep repository.
 *
 * @implements {ISleepRepository}
 */
@injectable()
export class SleepRepository extends BaseRepository<Sleep, SleepEntity> implements ISleepRepository {
    constructor(
        @inject(Identifier.SLEEP_REPO_MODEL) readonly sleepModel: any,
        @inject(Identifier.SLEEP_ENTITY_MAPPER) readonly sleepMapper: IEntityMapper<Sleep, SleepEntity>,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
        super(sleepModel, sleepMapper, logger)
    }

    /**
     * Checks if a sleep already has a registration.
     * What differs from one sleep to another is the start date and associated patient.
     *
     * @param sleep
     * @return {Promise<boolean>} True if it exists or False, otherwise
     * @throws {ValidationException | RepositoryException}
     */
    public async checkExist(sleep: Sleep): Promise<boolean> {
        const query: Query = new Query()
        return new Promise<boolean>((resolve, reject) => {
            if (sleep.start_time && sleep.patient_id) {
                query.filters = { start_time: sleep.start_time, patient_id: sleep.patient_id }
            }
            super.findOne(query)
                .then(result => resolve(!!result))
                .catch(err => reject(err))
        })
    }

    /**
     * Removes sleep according to its unique identifier and related patient.
     *
     * @param sleepId Unique identifier.
     * @param patientId Patient unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public removeByPatient(sleepId: string, patientId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.sleepModel.findOneAndDelete({ patient_id: patientId, _id: sleepId })
                .exec()
                .then(result => resolve(!!result))
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * Removes all sleep objects associated with the patientId received.
     *
     * @param patientId Patient id associated with sleep objects.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async removeAllByPatient(patientId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.sleepModel.deleteMany({ patient_id: patientId })
                .then(result => resolve(!!result))
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * Updates a Sleep.
     *
     * @param item Sleep to be updated.
     * @return {Promise<Sleep | undefined>}
     * @throws {RepositoryException}
     */
    public update(item: Sleep): Promise<Sleep | undefined> {
        const itemUp: any = this.sleepMapper.transform(item)
        return new Promise<Sleep | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ start_time: itemUp.start_time, patient_id: itemUp.patient_id }, itemUp,
                { new: true })
                .exec()
                .then((result) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.sleepMapper.transform(result))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * Updates or creates a Sleep.
     *
     * @param item Sleep to be updated or created.
     * @return {Promise<Sleep | undefined>}
     * @throws {RepositoryException}
     */
    public updateOrCreate(item: Sleep): Promise<Sleep | undefined> {
        const itemUp: any = this.sleepMapper.transform(item)
        return new Promise<Sleep | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ start_time: itemUp.start_time, patient_id: itemUp.patient_id }, itemUp,
                { new: true, upsert: true })
                .exec()
                .then((result) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.sleepMapper.transform(result))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }
}
