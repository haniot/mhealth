import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { BaseRepository } from './base/base.repository'
import { WeightEntity } from '../entity/weight.entity'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IWeightRepository } from '../../application/port/weight.repository.interface'
import { Weight } from '../../application/domain/model/weight'
import { Query } from './query/query'
import { IQuery } from '../../application/port/query.interface'

@injectable()
export class WeightRepository extends BaseRepository<Weight, WeightEntity> implements IWeightRepository {
    constructor(
        @inject(Identifier.WEIGHT_REPO_MODEL) readonly _model: any,
        @inject(Identifier.WEIGHT_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<Weight, WeightEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }

    public create(item: Weight): Promise<Weight> {
        const itemNew: WeightEntity = this.mapper.transform(item)
        return new Promise<Weight>((resolve, reject) => {
            this.Model.create(itemNew)
                .then((result) => {
                    if (!result) return resolve(undefined)
                    const query: Query = new Query()
                    query.addFilter({ _id: result.id })
                    return resolve(this.findOne(query))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public find(query: IQuery): Promise<Array<Weight>> {
        const q: any = query.toJSON()
        return new Promise<Array<Weight>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .populate('fat')
                .exec() // execute query
                .then((result: Array<WeightEntity>) => resolve(result.map(item => this.mapper.transform(item))))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findOne(query: IQuery): Promise<Weight> {
        const q: any = query.toJSON()
        return new Promise<Weight>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .select(q.fields)
                .populate('fat')
                .exec()
                .then((result) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
