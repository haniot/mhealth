import { MeasurementEntity } from './measurement.entity'

export class BodyTemperatureEntity extends MeasurementEntity {
    public value?: number
    public timestamp?: string
}
