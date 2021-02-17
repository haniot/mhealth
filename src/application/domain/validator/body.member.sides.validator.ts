import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { BodyMemberSides } from '../utils/body.member.sides'

export class BodyMemberSidesValidator {
    public static validate(value: string, field: string): void | ValidationException {
        const bodyMemberSides: Array<string> = Object.values(BodyMemberSides)

        if (!bodyMemberSides.includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`${field}: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(BodyMemberSides).join(', ').concat('.')))
        }
    }
}
