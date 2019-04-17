import { Measurement } from '../model/measurement'
import { ValidationException } from '../exception/validation.exception'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { ObjectIdValidator } from './object.id.validator'

export class CreateMeasurementValidator {
    public static validate(item: Measurement): void | ValidationException {
        const fields: Array<string> = []

        if (!item.unit) fields.push('unit')
        if (!item.type) fields.push('type')
        else MeasurementTypesValidator.validate(item.type)
        if (item.device_id) ObjectIdValidator.validate(item.device_id)
        if (!item.user_id) fields.push('user_id')
        else ObjectIdValidator.validate(item.user_id)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'Measurement validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
