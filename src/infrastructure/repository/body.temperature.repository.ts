import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { BodyTemperature } from '../../application/domain/model/body.temperature'
import { BodyTemperatureEntity } from '../entity/body.temperature.entity'
import { IBodyTemperatureRepository } from '../../application/port/body.temperature.repository.interface'

@injectable()
export class BodyTemperatureRepository extends BaseRepository<BodyTemperature, BodyTemperatureEntity>
    implements IBodyTemperatureRepository {
    constructor(
        @inject(Identifier.BODY_TEMPERATURE_REPO_MODEL) readonly _model: any,
        @inject(Identifier.BODY_TEMPERATURE_ENTITY_MAPPER)
        readonly _entityMapper: IEntityMapper<BodyTemperature, BodyTemperatureEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
