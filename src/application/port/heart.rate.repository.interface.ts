import { IRepository } from './repository.interface'
import { HeartRate } from '../domain/model/heart.rate'

export interface IHeartRateRepository extends IRepository<HeartRate>{
}
