import { IRepository } from './repository.interface'
import { BloodPressure } from '../domain/model/blood.pressure'

export interface IBloodPressureRepository extends IRepository<BloodPressure>{
}
