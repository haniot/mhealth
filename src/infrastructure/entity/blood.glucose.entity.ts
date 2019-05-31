import { MeasurementEntity } from './measurement.entity'

export class BloodGlucoseEntity extends MeasurementEntity {
    public value?: number
    public meal?: string
    public timestamp?: string
}
