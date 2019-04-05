import { IService } from './service.interface'
import { Device } from '../domain/model/device'

export interface IDeviceService extends IService<Device> {
    removeDevice(deviceId: string, userId: string): Promise<boolean>
}
