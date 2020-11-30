import { ValidationException } from '../exception/validation.exception'
import { SleepPatternDataSet } from '../model/sleep.pattern.data.set'
import { Strings } from '../../../utils/strings'
import { Phases } from '../utils/phases'
import { SleepType } from '../utils/sleep.type'
import { Stages } from '../utils/stages'
import { IntegerPositiveValidator } from './integer.positive.validator'
import { DateTimeValidator } from './date.time.validator'

export class SleepPatternDataSetValidator {
    public static validate(dataset: Array<SleepPatternDataSet>, sleepType: SleepType): void | ValidationException {
        const fields: Array<string> = []
        const phasesPatternTypes: Array<string> = Object.values(Phases)
        const stagesPatternTypes: Array<string> = Object.values(Stages)

        if (!dataset.length) {
            throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS, 'pattern.data_set must not be empty!')
        }

        dataset.forEach((data: SleepPatternDataSet) => {
            // validate null
            if (!data.start_time) fields.push('pattern.data_set.start_time')
            else DateTimeValidator.validate(data.start_time)
            if (data.name === undefined) fields.push('pattern.data_set.name')
            else if (sleepType === SleepType.CLASSIC && !phasesPatternTypes.includes(data.name)) {
                    throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                        'The names of the allowed data_set patterns are: '.concat(phasesPatternTypes.join(', ').concat('.')))
            }
            else if (sleepType === SleepType.STAGES && !stagesPatternTypes.includes(data.name)) {
                    throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                        'The names of the allowed data_set patterns are: '.concat(stagesPatternTypes.join(', ').concat('.')))
            }
            if (data.duration === undefined) fields.push('pattern.data_set.duration')
            else IntegerPositiveValidator.validate(data.duration, 'pattern.data_set.duration')
        })

        if (fields.length > 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.REQUIRED_FIELDS,
                fields.join(', ').concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
        }
    }
}
