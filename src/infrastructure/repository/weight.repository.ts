import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { BaseRepository } from './base/base.repository'
import { WeightEntity } from '../entity/weight.entity'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IWeightRepository } from '../../application/port/weight.repository.interface'
import { Weight } from '../../application/domain/model/weight'

@injectable()
export class WeightRepository extends BaseRepository<Weight, WeightEntity> implements IWeightRepository {
    constructor(
        @inject(Identifier.WEIGHT_REPO_MODEL) readonly _model: any,
        @inject(Identifier.WEIGHT_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<Weight, WeightEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
