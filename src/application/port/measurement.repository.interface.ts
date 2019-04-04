import { IRepository } from './repository.interface'
import { Measurement } from '../domain/model/measurement'

export interface IMeasurementRepository extends IRepository<Measurement> {
}
