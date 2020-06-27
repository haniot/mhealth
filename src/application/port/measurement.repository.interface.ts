import { IRepository } from './repository.interface'
import { Measurement } from '../domain/model/measurement'
import { IQuery } from './query.interface'

export interface IMeasurementRepository extends IRepository<Measurement> {
    checkExists(item: any): Promise<boolean>

    create(item: any): Promise<any>

    find(query: IQuery): Promise<Array<any>>

    findOne(query: IQuery): Promise<any>

    getLast(patientId: string, measurementType: string): Promise<any>

    removeAllByPatient(id: string): Promise<boolean>

    updateOrCreate(item: any): Promise<any>
}
