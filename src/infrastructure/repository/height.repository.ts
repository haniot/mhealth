import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { Height } from '../../application/domain/model/height'
import { HeightEntity } from '../entity/height.entity'
import { IHeightRepository } from '../../application/port/height.repository.interface'

@injectable()
export class HeightRepository extends BaseRepository<Height, HeightEntity> implements IHeightRepository {
    constructor(
        @inject(Identifier.HEIGHT_REPO_MODEL) readonly _model: any,
        @inject(Identifier.HEIGHT_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<Height, HeightEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
