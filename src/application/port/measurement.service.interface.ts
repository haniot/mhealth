import { IService } from './service.interface'
import { Measurement } from '../domain/model/measurement'

export interface IMeasurementService extends IService<Measurement> {
    removeMeasurement(measurementId: string, userId: string): Promise<boolean>
}
