import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { BloodGlucose } from '../../application/domain/model/blood.glucose'
import { BloodPressureEntity } from '../entity/blood.pressure.entity'
import { IBloodGlucoseRepository } from '../../application/port/blood.glucose.repository.interface'

@injectable()
export class BloodGlucoseRepository extends BaseRepository<BloodGlucose, BloodPressureEntity> implements IBloodGlucoseRepository {
    constructor(
        @inject(Identifier.BLOOD_GLUCOSE_REPO_MODEL) readonly _model: any,
        @inject(Identifier.BLOOD_GLUCOSE_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<BloodGlucose, BloodPressureEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
