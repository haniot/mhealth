import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { HandTypes } from '../utils/hand.types'

export class HandTypesValidator {
    public static validate(value: string): void | ValidationException {
        const handTypes: Array<string> = Object.values(HandTypes)

        if (!handTypes.includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`type: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(HandTypes).join(', ').concat('.')))
        }
    }
}
