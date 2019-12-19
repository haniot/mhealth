import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { NumberValidator } from './number.validator'
import { ActivityLevel } from '../model/activityLevel'
import { Levels } from '../utils/levels'

export class PhysicalActivityLevelsValidator {
    public static validate(levels: Array<ActivityLevel>): void | ValidationException {
        const fields: Array<string> = []
        const levelsTypes = Object.values(Levels)

        if (!levels.length) {
            throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                `The levels array must have values for the following levels: ${levelsTypes.join(', ')}.`)
        }

        levels.forEach((level: ActivityLevel) => {
            // validate null
            if (level.name === undefined) fields.push('levels.name')
            else if (!levelsTypes.includes(level.name)) {
                throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                    `The names of the allowed levels are: ${levelsTypes.join(', ')}.`)
            }
            if (level.duration === undefined) fields.push('levels.duration')
            else NumberValidator.validate(level.duration, 'levels.duration')
        })

        if (levelsTypes.length !== levels.filter(item => levelsTypes.includes(item.name)).length) {
            throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                `The levels array must have values for the following levels: ${levelsTypes.join(', ')}.`)
        }

        if (fields.length > 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.REQUIRED_FIELDS,
                fields.join(', ').concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
        }
    }
}
