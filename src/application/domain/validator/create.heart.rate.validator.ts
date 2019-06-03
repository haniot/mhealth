import { ValidationException } from '../exception/validation.exception'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { ObjectIdValidator } from './object.id.validator'
import { HeartRate } from '../model/heart.rate'
import { DatetimeValidator } from './date.time.validator'

export class CreateHeartRateValidator {
    public static validate(item: HeartRate): void | ValidationException {
        const fields: Array<string> = []

        if (!item.dataset || !item.dataset.length) fields.push('dataset')
        else item.dataset.forEach(value => {
            if (!value.value) fields.push('dataset.item.value')
            if (!value.timestamp) fields.push('dataset.item.timestamp')
            else DatetimeValidator.validate(value.timestamp)
        })
        if (!item.unit) fields.push('unit')
        if (!item.type) fields.push('type')
        else MeasurementTypesValidator.validate(item.type)
        if (!item.user_id) fields.push('user_id')
        else ObjectIdValidator.validate(item.user_id)
        if (item.device_id) ObjectIdValidator.validate(item.device_id)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'HeartRate validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
