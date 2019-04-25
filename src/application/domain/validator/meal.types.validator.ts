import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { MealTypes } from '../utils/meal.types'

export class MealTypesValidator {
    public static validate(value: string): void | ValidationException {
        if (!Object.values(MealTypes).includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`meal: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(MealTypes).join(', ').concat('.')))
        }
    }
}
