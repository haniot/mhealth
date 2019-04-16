import { IService } from './service.interface'
import { Measurement } from '../domain/model/measurement'

export interface IMeasurementService extends IService<Measurement> {
    add(item: Measurement | Array<Measurement>): Promise<Measurement | any>

    removeMeasurement(measurementId: string, userId: string): Promise<boolean>
}
