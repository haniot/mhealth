import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { MeasurementTypes } from '../utils/measurement.types'

export class MeasurementTypeValidator {
    public static validator(value: string): void | ValidationException {
        if (!Object.values(MeasurementTypes).includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`type: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(MeasurementTypes).join(', ').concat('.')))
        }
    }
}
