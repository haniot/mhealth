import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Measurement } from '../../application/domain/model/measurement'
import { MeasurementEntity } from '../entity/measurement.entity'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IMeasurementRepository } from '../../application/port/measurement.repository.interface'

@injectable()
export class MeasurementRepository extends BaseRepository<Measurement, MeasurementEntity> implements IMeasurementRepository {
    constructor(
        @inject(Identifier.MEASUREMENT_REPO_MODEL) readonly _model: any,
        @inject(Identifier.MEASUREMENT_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
