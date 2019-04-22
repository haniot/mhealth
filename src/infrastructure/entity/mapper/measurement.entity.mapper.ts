import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { Measurement } from '../../../application/domain/model/measurement'
import { MeasurementEntity } from '../measurement.entity'
import { MeasurementTypes } from '../../../application/domain/utils/measurement.types'
import { BloodGlucoseEntityMapper } from './blood.glucose.entity.mapper'
import { BloodPressureEntityMapper } from './blood.pressure.entity.mapper'
import { BodyTemperatureEntityMapper } from './body.temperature.entity.mapper'
import { HeartRateEntityMapper } from './heart.rate.entity.mapper'
import { HeightEntityMapper } from './height.entity.mapper'
import { WaistCircumferenceEntityMapper } from './waist.circumference.entity.mapper'
import { WeightEntityMapper } from './weight.entity.mapper'

@injectable()
export class MeasurementEntityMapper implements IEntityMapper<Measurement, MeasurementEntity> {
    public transform(item: any): any {
        if (item.type) {
            switch (item.type) {
                case MeasurementTypes.BLOOD_GLUCOSE:
                    return new BloodGlucoseEntityMapper().transform(item)
                case MeasurementTypes.BLOOD_PRESSURE:
                    return new BloodPressureEntityMapper().transform(item)
                case MeasurementTypes.BODY_TEMPERATURE:
                    return new BodyTemperatureEntityMapper().transform(item)
                case MeasurementTypes.HEART_RATE:
                    return new HeartRateEntityMapper().transform(item)
                case MeasurementTypes.HEIGHT:
                    return new HeightEntityMapper().transform(item)
                case MeasurementTypes.WAIST_CIRCUMFERENCE:
                    return new WaistCircumferenceEntityMapper().transform(item)
                case MeasurementTypes.WEIGHT:
                    return new WeightEntityMapper().transform(item)
                default:
                    if (item instanceof Measurement) return this.modelToModelEntity(item)
                    return this.jsonToModel(item) // json
            }
        }
    }

    public jsonToModel(json: any): Measurement {
        const result: Measurement = new Measurement()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.unit !== undefined) result.unit = json.unit
        if (json.type !== undefined) result.type = json.type
        if (json.device_id !== undefined) result.device_id = json.device_id
        if (json.user_id !== undefined) result.user_id = json.user_id
        return result
    }

    public modelEntityToModel(item: MeasurementEntity): Measurement {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: Measurement): MeasurementEntity {
        const result: MeasurementEntity = new MeasurementEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.unit !== undefined) result.unit = item.unit
        if (item.type !== undefined) result.type = item.type
        if (item.device_id !== undefined) result.device_id = item.device_id
        if (item.user_id !== undefined) result.user_id = item.user_id
        return result
    }
}
