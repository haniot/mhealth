import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IPhysicalActivityRepository } from '../../application/port/physical.activity.repository.interface'
import { PhysicalActivity } from '../../application/domain/model/physical.activity'
import { BaseRepository } from './base/base.repository'
import { Query } from './query/query'
import { ILogger } from '../../utils/custom.logger'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { PhysicalActivityEntity } from '../entity/physical.activity.entity'

/**
 * Implementation of the physicalactivity repository.
 *
 * @implements {IPhysicalActivityRepository}
 */
@injectable()
export class PhysicalActivityRepository extends BaseRepository<PhysicalActivity, PhysicalActivityEntity>
    implements IPhysicalActivityRepository {
    constructor(
        @inject(Identifier.ACTIVITY_REPO_MODEL) readonly activityModel: any,
        @inject(Identifier.ACTIVITY_ENTITY_MAPPER) readonly activityMapper:
            IEntityMapper<PhysicalActivity, PhysicalActivityEntity>,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
        super(activityModel, activityMapper, logger)
    }

    /**
     * Checks if a physicalactivity already has a registration.
     * What differs from one physicalactivity to another is the start date and associated patient.
     *
     * @param activity
     * @return {Promise<boolean>} True if it exists or False, otherwise
     * @throws {ValidationException | RepositoryException}
     */
    public async checkExist(activity: PhysicalActivity): Promise<boolean> {
        const query: Query = new Query()
        return new Promise<boolean>((resolve, reject) => {
            if (activity.start_time && activity.patient_id) {
                query.filters = { start_time: activity.start_time, patient_id: activity.patient_id }
            }
            super.findOne(query)
                .then(result => resolve(!!result))
                .catch(err => reject(err))
        })
    }

    /**
     * Removes physicalactivity according to its unique identifier and related patient.
     *
     * @param activityId Unique identifier.
     * @param patientId Patient ID.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public removeByPatient(activityId: string | number, patientId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.activityModel.findOneAndDelete({ patient_id: patientId, _id: activityId })
                .exec()
                .then(result => resolve(!!result))
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * Removes all physical activities associated with the patientId received.
     *
     * @param patientId Patient id associated with physical activities.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async removeAllByPatient(patientId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.activityModel.deleteMany({ patient_id: patientId })
                .then(result => resolve(!!result))
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * Updates or creates a Physical Activity.
     *
     * @param item Physical Activity to be updated or created.
     * @return {Promise<PhysicalActivity | undefined>}
     * @throws {RepositoryException}
     */
    public updateOrCreate(item: any): Promise<PhysicalActivity | undefined> {
        const itemUp: any = this.activityMapper.transform(item)
        return new Promise<PhysicalActivity | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ start_time: itemUp.start_time, patient_id: itemUp.patient_id }, itemUp,
                { new: true, upsert: true })
                .exec()
                .then((result) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.activityMapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
