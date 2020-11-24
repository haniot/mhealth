import { IService } from './service.interface'
import { Device } from '../domain/model/device'

export interface IDeviceService extends IService<Device> {
    addDevice(item: Device, userId: string): Promise<Device | undefined>
    updateDevice(item: Device, userId: string): Promise<Device | undefined>
    removeDevice(deviceId: string, userId: string): Promise<boolean>
}
