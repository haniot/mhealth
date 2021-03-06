import { Device } from '../model/device'
import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { ObjectIdValidator } from './object.id.validator'

export class UpdateDeviceValidator {
    public static validate(item: Device): void | ValidationException {
        ObjectIdValidator.validate(item.id!)
        if (item.patient_id) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED,
                Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED_DESC.concat('patient_id'))
        }
    }
}
