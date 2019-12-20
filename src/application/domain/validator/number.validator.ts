import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'

export class NumberValidator {
    public static validate(value: number, fieldName: string): void | ValidationException {
        if (value !== undefined && (value === null || isNaN(value))) {
            throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                fieldName.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
        } else if (value < 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                fieldName.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
        }
    }
}
