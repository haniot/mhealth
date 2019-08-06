import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Measurement } from '../../application/domain/model/measurement'
import { MeasurementEntity } from '../entity/measurement.entity'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IMeasurementRepository } from '../../application/port/measurement.repository.interface'
import { Query } from './query/query'
import { MeasurementTypes } from '../../application/domain/utils/measurement.types'
import { BloodGlucose } from '../../application/domain/model/blood.glucose'
import { BloodGlucoseEntity } from '../entity/blood.glucose.entity'
import { BloodPressure } from '../../application/domain/model/blood.pressure'
import { BloodPressureEntity } from '../entity/blood.pressure.entity'
import { BodyTemperature } from '../../application/domain/model/body.temperature'
import { BodyTemperatureEntity } from '../entity/body.temperature.entity'
import { BodyFat } from '../../application/domain/model/body.fat'
import { BodyFatEntity } from '../entity/body.fat.entity'
import { Height } from '../../application/domain/model/height'
import { HeightEntity } from '../entity/height.entity'
import { WaistCircumference } from '../../application/domain/model/waist.circumference'
import { WaistCircumferenceEntity } from '../entity/waist.circumference.entity'
import { Weight } from '../../application/domain/model/weight'
import { WeightEntity } from '../entity/weight.entity'
import { IQuery } from '../../application/port/query.interface'

@injectable()
export class MeasurementRepository extends BaseRepository<Measurement, MeasurementEntity> implements IMeasurementRepository {
    constructor(
        @inject(Identifier.MEASUREMENT_REPO_MODEL) readonly _model: any,
        @inject(Identifier.MEASUREMENT_ENTITY_MAPPER)
        readonly _measurementEntityMapper: IEntityMapper<Measurement, MeasurementEntity>,
        @inject(Identifier.BLOOD_GLUCOSE_ENTITY_MAPPER)
        readonly _bloodGlucoseEntityMapper: IEntityMapper<BloodGlucose, BloodGlucoseEntity>,
        @inject(Identifier.BLOOD_PRESSURE_ENTITY_MAPPER)
        readonly _bloodPressureEntityMapper: IEntityMapper<BloodPressure, BloodPressureEntity>,
        @inject(Identifier.BODY_TEMPERATURE_ENTITY_MAPPER)
        readonly _bodyTemperatureEntityMapper: IEntityMapper<BodyTemperature, BodyTemperatureEntity>,
        @inject(Identifier.BODY_FAT_ENTITY_MAPPER)
        readonly _bodyFatEntityMapper: IEntityMapper<BodyFat, BodyFatEntity>,
        @inject(Identifier.HEIGHT_ENTITY_MAPPER)
        readonly _heightEntityMapper: IEntityMapper<Height, HeightEntity>,
        @inject(Identifier.WAIST_CIRCUMFERENCE_ENTITY_MAPPER)
        readonly _waistCircumferenceEntityMapper: IEntityMapper<WaistCircumference, WaistCircumferenceEntity>,
        @inject(Identifier.WEIGHT_ENTITY_MAPPER)
        readonly _weightEntityMapper: IEntityMapper<Weight, WeightEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _measurementEntityMapper, _logger)
    }

    public async checkExists(item: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const query: Query = new Query().fromJSON({
                filters: {
                    type: item.type,
                    value: item.value,
                    patient_id: item.patient_id,
                    timestamp: item.timestamp,
                    device_id: item.device_id
                }
            })
            this.findOne(query)
                .then(result => resolve(!!result))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public create(item: any): Promise<any> {
        const itemNew: any = this.transform(item)
        return new Promise<any>((resolve, reject) => {
            this.Model.create(itemNew)
                .then((result) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public find(query: IQuery): Promise<Array<any>> {
        const q: any = query.toJSON()
        return new Promise<Array<any>>((resolve, reject) => {
            this.Model.find(q.filters)
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .exec()
                .then((result: Array<any>) => resolve(result.map(item => this.transform(item))))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findOne(query: IQuery): Promise<any> {
        const q: any = query.toJSON()
        return new Promise<any>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .exec()
                .then((result) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.transform(result))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public async getLastMeasurement(patientId: string, measurementType: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const query: Query = new Query()
            query.addFilter({ patient_id: patientId, type: measurementType })
            query.addOrdination('timestamp', 'desc')
            return this
                .find(query)
                .then(result => resolve(result[0]))
                .catch(err => reject(this.mongoDBErrorListener(err)))

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
            case(MeasurementTypes.HEIGHT):
                return this._heightEntityMapper.transform(item)
            case(MeasurementTypes.WAIST_CIRCUMFERENCE):
                return this._waistCircumferenceEntityMapper.transform(item)
            case(MeasurementTypes.WEIGHT):
                return this._weightEntityMapper.transform(item)
            case(MeasurementTypes.BODY_FAT):
                return this._bodyFatEntityMapper.transform(item)
            default:
                return this.mapper.transform(item)
        }
    }
}
