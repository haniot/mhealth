import { MeasurementEntity } from './measurement.entity'

export class BloodPressureEntity extends MeasurementEntity {
    public systolic?: number
    public diastolic?: number
    public pulse?: number
    public timestamp?: string
}
