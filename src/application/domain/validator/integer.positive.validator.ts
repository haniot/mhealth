import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'

export class IntegerPositiveValidator {
    public static validate(value: number, fieldName: string): void | ValidationException {
        if (!(/^[0-9]{1,}$/i).test(String(value))) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.INVALID_FIELD.replace('{0}', fieldName),
                Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
        }
    }
}
