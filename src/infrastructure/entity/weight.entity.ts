import { MeasurementEntity } from './measurement.entity'

export class WeightEntity extends MeasurementEntity {
    public body_fat?: number
    public annual_variation?: string
}
