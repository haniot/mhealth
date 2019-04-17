import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Measurement } from '../../application/domain/model/measurement'
import { MeasurementEntity } from '../entity/measurement.entity'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IMeasurementRepository } from '../../application/port/measurement.repository.interface'
import { Query } from './query/query'

@injectable()
export class MeasurementRepository extends BaseRepository<Measurement, MeasurementEntity> implements IMeasurementRepository {
    constructor(
        @inject(Identifier.MEASUREMENT_REPO_MODEL) readonly _model: any,
        @inject(Identifier.MEASUREMENT_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }

    public async checkExists(item: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const query: Query = new Query()
            query.addFilter({ type: item.type, user_id: item.user_id, timestamp: item.timestamp })
            this.findOne(query).then(result => {
                if (!result) return resolve(false)
                return resolve(true)
            }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
