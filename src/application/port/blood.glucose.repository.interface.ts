import { IRepository } from './repository.interface'
import { BloodGlucose } from '../domain/model/blood.glucose'

export interface IBloodGlucoseRepository extends IRepository<BloodGlucose>{
}
