import { IService } from './service.interface'
import { Measurement } from '../domain/model/measurement'
import { LastMeasurements } from '../domain/model/last.measurements'

export interface IMeasurementService extends IService<Measurement> {
    addMeasurement(item: any | Array<any>): Promise<any>

    removeMeasurement(measurementId: string, userId: string): Promise<boolean>

    getLastMeasurements(patientId: string): Promise<LastMeasurements>
}
