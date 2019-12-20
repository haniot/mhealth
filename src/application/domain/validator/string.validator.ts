import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'

export class StringValidator {
    public static validate(value: string, fieldName: string): void | ValidationException {
        if (typeof value !== 'string') {
            throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                fieldName.concat(Strings.ERROR_MESSAGE.INVALID_STRING))
        } else if (value.length === 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                fieldName.concat(Strings.ERROR_MESSAGE.EMPTY_STRING))
        }
    }
}
