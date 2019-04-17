import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { BloodPressure } from '../../application/domain/model/blood.pressure'
import { BloodPressureEntity } from '../entity/blood.pressure.entity'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IBloodPressureRepository } from '../../application/port/blood.pressure.repository.interface'

@injectable()
export class BloodPressureRepository extends BaseRepository<BloodPressure, BloodPressureEntity>
    implements IBloodPressureRepository {
    constructor(
        @inject(Identifier.BLOOD_PRESSURE_REPO_MODEL) readonly _model: any,
        @inject(Identifier.BLOOD_PRESSURE_ENTITY_MAPPER)
        readonly _entityMapper: IEntityMapper<BloodPressure, BloodPressureEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
