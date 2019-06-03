import { MeasurementEntity } from './measurement.entity'

export class WeightEntity extends MeasurementEntity {
    public value?: number
    public timestamp?: string
    public fat?: string
}
