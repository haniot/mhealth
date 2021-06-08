import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { ChoiceTypes } from '../utils/choice.types'

export class ChoiceTypesValidator {
    public static validate(value: string): void | ValidationException {
        const choiceTypes: Array<string> = Object.values(ChoiceTypes)

        if (!choiceTypes.includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`choice: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(ChoiceTypes).join(', ').concat('.')))
        }
    }
}
