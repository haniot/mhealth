import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { HeartRate } from '../../application/domain/model/heart.rate'
import { HeartRateEntity } from '../entity/heart.rate.entity'
import { IHeartRateRepository } from '../../application/port/heart.rate.repository.interface'

@injectable()
export class HeartRateRepository extends BaseRepository<HeartRate, HeartRateEntity> implements IHeartRateRepository {
    constructor(
        @inject(Identifier.HEART_RATE_REPO_MODEL) readonly _model: any,
        @inject(Identifier.HEART_RATE_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<HeartRate, HeartRateEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
