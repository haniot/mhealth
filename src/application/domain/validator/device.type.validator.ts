import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { DeviceTypes } from '../utils/device.types'

export class DeviceTypeValidator {
    public static validate(value: string): void | ValidationException {
        if (!Object.values(DeviceTypes).includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`type: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(DeviceTypes).join(', ').concat('.')))
        }
    }
}
