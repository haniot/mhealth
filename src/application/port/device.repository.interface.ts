import { IRepository } from './repository.interface'
import { Device } from '../domain/model/device'

export interface IDeviceRepository extends IRepository<Device> {
}
