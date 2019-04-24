import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { BaseRepository } from './base/base.repository'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { Fat } from '../../application/domain/model/fat'
import { FatEntity } from '../entity/fat.entity'
import { IFatRepository } from '../../application/port/fat.repository.interface'

@injectable()
export class FatRepository extends BaseRepository<Fat, FatEntity> implements IFatRepository {
    constructor(
        @inject(Identifier.FAT_REPO_MODEL) readonly _model: any,
        @inject(Identifier.FAT_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<Fat, FatEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
