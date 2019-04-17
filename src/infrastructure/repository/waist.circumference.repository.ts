import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { WaistCircumference } from '../../application/domain/model/waist.circumference'
import { WaistCircumferenceEntity } from '../entity/waist.circumference.entity'
import { IWaistCircumferenceRepository } from '../../application/port/waist.circumference.repository.interface'

@injectable()
export class WaistCircumferenceRepository extends BaseRepository<WaistCircumference, WaistCircumferenceEntity>
    implements IWaistCircumferenceRepository {
    constructor(
        @inject(Identifier.WAIST_CIRCUMFERENCE_REPO_MODEL) readonly _model: any,
        @inject(Identifier.WAIST_CIRCUMFERENCE_ENTITY_MAPPER)
        readonly _entityMapper: IEntityMapper<WaistCircumference, WaistCircumferenceEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }
}
