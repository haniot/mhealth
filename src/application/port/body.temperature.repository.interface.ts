import { IRepository } from './repository.interface'
import { BodyTemperature } from '../domain/model/body.temperature'

export interface IBodyTemperatureRepository extends IRepository<BodyTemperature>{
}
