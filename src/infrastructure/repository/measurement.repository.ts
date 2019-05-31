import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Measurement } from '../../application/domain/model/measurement'
import { MeasurementEntity } from '../entity/measurement.entity'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IMeasurementRepository } from '../../application/port/measurement.repository.interface'
import { Query } from './query/query'
import { IQuery } from '../../application/port/query.interface'
import { MeasurementTypes } from '../../application/domain/utils/measurement.types'

@injectable()
export class MeasurementRepository extends BaseRepository<Measurement, MeasurementEntity> implements IMeasurementRepository {
    constructor(
        @inject(Identifier.MEASUREMENT_REPO_MODEL) readonly _model: any,
        @inject(Identifier.MEASUREMENT_ENTITY_MAPPER)
        readonly _entityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.BLOOD_GLUCOSE_ENTITY_MAPPER)
        readonly _bloodGlucoseEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.BLOOD_PRESSURE_ENTITY_MAPPER)
        readonly _bloodPressureEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.BODY_TEMPERATURE_ENTITY_MAPPER)
        readonly _bodyTemperatureEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.FAT_ENTITY_MAPPER)
        readonly _fatEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.HEART_RATE_ENTITY_MAPPER)
        readonly _heartRateEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.HEIGHT_ENTITY_MAPPER)
        readonly _heightEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.WAIST_CIRCUMFERENCE_ENTITY_MAPPER)
        readonly _waistCircumferenceEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.WEIGHT_ENTITY_MAPPER)
        readonly _weightEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }

    public async checkExists(item: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const query: Query = new Query()
            query.addFilter({ type: item.type, value: item.value, user_id: item.user_id, timestamp: item.timestamp })
            this.findOne(query).then(result => {
                if (!result) return resolve(false)
                return resolve(true)
            }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public create(item: any): Promise<any> {
        const itemNew: any = this.transform(item)
        return new Promise<any>((resolve, reject) => {
            this.Model.create(itemNew)
                .then((result) => {
                    if (!result) return resolve(undefined)
                    const query: Query = new Query()
                    query.addFilter({ _id: result.id })
                    return resolve(this.findOne(query))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public find(query: IQuery): Promise<Array<any>> {
        const q: any = query.toJSON()
        return new Promise<Array<any>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .populate('fat')
                .exec()
                .then((result: Array<any>) => resolve(result.map(item => this.transform(item))))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findOne(query: IQuery): Promise<any> {
        const q: any = query.toJSON()
        return new Promise<any>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .select(q.fields)
                .populate('fat')
                .exec()
                .then((result) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.transform(result))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    private transform(item: any) {
        switch (item.type) {
            case(MeasurementTypes.BLOOD_GLUCOSE):
                return this._bloodGlucoseEntityMapper.transform(item)
            case(MeasurementTypes.BLOOD_PRESSURE):
                return this._bloodPressureEntityMapper.transform(item)
            case(MeasurementTypes.BODY_TEMPERATURE):
                return this._bodyTemperatureEntityMapper.transform(item)
            case(MeasurementTypes.HEART_RATE):
                return this._heartRateEntityMapper.transform(item)
            case(MeasurementTypes.HEIGHT):
                return this._heightEntityMapper.transform(item)
            case(MeasurementTypes.WAIST_CIRCUMFERENCE):
                return this._waistCircumferenceEntityMapper.transform(item)
            case(MeasurementTypes.WEIGHT):
                return this._weightEntityMapper.transform(item)
            case(MeasurementTypes.FAT):
                return this._fatEntityMapper.transform(item)
            default:
                return this.mapper.transform(item)
        }
    }
}
