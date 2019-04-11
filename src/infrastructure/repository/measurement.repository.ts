import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Measurement } from '../../application/domain/model/measurement'
import { MeasurementEntity } from '../entity/measurement.entity'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { Query } from './query/query'
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

    public create(item: Measurement): Promise<Measurement> {
        const itemNew: Measurement = this.mapper.transform(item)
        return new Promise<Measurement>(async (resolve, reject) => {
            this.Model.create(itemNew)
                .then(result => {
                    if (!result) return resolve(undefined)

                    const query = new Query()
                    query.addFilter({ _id: result.id })

                    return resolve(this.findOne(query))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findOne(query: IQuery): Promise<Measurement> {
        const q: any = query.toJSON()
        return new Promise<Measurement>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .select(q.fields)
                .populate('measurements')
                .exec()
                .then((result: Measurement) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public find(query: IQuery): Promise<Array<Measurement>> {
        const q: any = query.toJSON()
        return new Promise<Array<Measurement>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .populate('measurements')
                .exec() // execute query
                .then((result: Array<Measurement>) => {
                    return resolve(result.map(item => this.mapper.transform(item)))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public update(item: Measurement): Promise<Measurement> {
        const itemUp: any = this.mapper.transform(item)
        return new Promise<Measurement>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: itemUp.id }, itemUp, { new: true })
                .populate('measurements')
                .exec()
                .then((result: Measurement) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
