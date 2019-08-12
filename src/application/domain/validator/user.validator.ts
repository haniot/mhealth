import { ValidationException } from '../exception/validation.exception'
import { User } from '../model/user'

export class UserValidator {
    public static validate(item: User): void | ValidationException {
        const fields: Array<string> = []

        if (!item.id) fields.push('id')
        if (!item.type) fields.push('type')

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'User validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
