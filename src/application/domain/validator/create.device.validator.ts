import { Device } from '../model/device'
import { ValidationException } from '../exception/validation.exception'
import { DeviceTypeValidator } from './device.type.validator'
import { ObjectIdValidator } from './object.id.validator'

export class CreateDeviceValidator {
    public static validate(item: Device): void | ValidationException {
        const fields: Array<string> = []

        if (!item.name) fields.push('name')
        if (!item.address) fields.push('address')
        if (!item.type) fields.push('type')
        else DeviceTypeValidator.validate(item.type)
        if (!item.manufacturer) fields.push('manufacturer')
        if (!item.patient_id) fields.push('patient_id')
        else item.patient_id.forEach(id => ObjectIdValidator.validate(id))

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'Device validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
