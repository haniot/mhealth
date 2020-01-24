import { ValidationException } from '../exception/validation.exception'
import { Activity } from '../model/activity'
import { Strings } from '../../../utils/strings'
import { ObjectIdValidator } from './object.id.validator'
import { DatetimeValidator } from './date.time.validator'
import { IntegerPositiveValidator } from './integer.positive.validator'

export class CreateActivityValidator {
    public static validate(activity: Activity): void | ValidationException {
        const fields: Array<string> = []
        try {
            // validate null.
            if (!activity.start_time) fields.push('start_time')
            else DatetimeValidator.validate(activity.start_time)
            if (!activity.end_time) fields.push('end_time')
            else DatetimeValidator.validate(activity.end_time)
            if (activity.duration === undefined) fields.push('duration')
            else IntegerPositiveValidator.validate(activity.duration, 'duration')
            if (activity.start_time && activity.end_time && activity.duration) {
                const durationValidate: number = new Date(activity.end_time).getTime() - new Date(activity.start_time).getTime()
                if (durationValidate < 0) {
                    throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                        'The end_time parameter can not contain an older date than that the start_time parameter!')
                }
                if (Number(activity.duration) !== durationValidate) {
                    throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                        'duration value does not match values passed in start_time and end_time parameters!')
                }
            }
            if (!activity.patient_id) fields.push('patient_id')
            else ObjectIdValidator.validate(activity.patient_id, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)

            if (fields.length > 0) throw new ValidationException('REQUIRED_FIELDS', fields.join(', '))
        } catch (err) {
            throw err
        }
    }
}
