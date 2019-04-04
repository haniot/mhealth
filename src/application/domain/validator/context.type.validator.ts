import { ValidationException } from '../exception/validation.exception'
import { ContextTypes } from '../utils/context.types'
import { Strings } from '../../../utils/strings'

export class ContextTypeValidator {
    public static validator(value: string): void | ValidationException {
        if (!Object.values(ContextTypes).includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`context.type: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(ContextTypes).join(', ').concat('.')))
        }
    }
}
