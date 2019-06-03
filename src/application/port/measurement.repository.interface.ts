import { IRepository } from './repository.interface'
import { Measurement } from '../domain/model/measurement'
import { Query } from '../../infrastructure/repository/query/query'

export interface IMeasurementRepository extends IRepository<Measurement> {
    checkExists(item: any): Promise<boolean>

    find(query: Query): Promise<Array<any>>
}
