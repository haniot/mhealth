import { ValidationException } from '../exception/validation.exception'
import { PhysicalActivity } from '../model/physical.activity'
import { PhysicalActivityLevelsValidator } from './physical.activity.levels.validator'
import { Strings } from '../../../utils/strings'
import { CreateActivityValidator } from './create.activity.validator'
import { StringValidator } from './string.validator'
import { HeartRateZoneValidator } from './heart.rate.zone.validator'
import { NumberPositiveValidator } from './number.positive.validator'
import { IntegerPositiveValidator } from './integer.positive.validator'

export class CreatePhysicalActivityValidator {
    public static validate(activity: PhysicalActivity): void | ValidationException {
        const fields: Array<string> = []

        const regZone = new RegExp(/^0*[1-9][0-9]*$/i) // 1-n

        try {
            CreateActivityValidator.validate(activity)
        } catch (err: any) {
            if (err.message !== 'REQUIRED_FIELDS') throw err
            fields.push(err.description.split(','))
        }

        if (activity.name === undefined) fields.push('name')
        else StringValidator.validate(activity.name, 'name')

        if (activity.calories === undefined) fields.push('calories')
        else NumberPositiveValidator.validate(activity.calories, 'calories')

        if (activity.steps !== undefined) {
            IntegerPositiveValidator.validate(activity.steps, 'steps')
        }

        if (activity.distance !== undefined) {
            IntegerPositiveValidator.validate(activity.distance, 'distance')
        }

        if (activity.levels && activity.levels.length > 0) PhysicalActivityLevelsValidator.validate(activity.levels)

        if (activity.heart_rate_average !== undefined) {
            if (!(regZone.test(String(activity.heart_rate_average)))) {
                throw new ValidationException(
                    Strings.ERROR_MESSAGE.INVALID_FIELD.replace('{0}', 'heart_rate_average'),
                    Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO
                )
            }
        }

        if (activity.heart_rate_zones !== undefined) HeartRateZoneValidator.validate(activity.heart_rate_zones)

        if (fields.length > 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.REQUIRED_FIELDS,
                fields.join(', ').concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
        }
    }
}
