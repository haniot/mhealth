import { MeasurementEntity } from './measurement.entity'

export class HeartRateEntity extends MeasurementEntity {
    public dataset?: Array<any>
    public timestamp?: string
}
