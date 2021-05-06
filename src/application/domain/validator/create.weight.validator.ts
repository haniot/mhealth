import { ValidationException } from '../exception/validation.exception'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { ObjectIdValidator } from './object.id.validator'
import { Weight } from '../model/weight'
import { DateTimeValidator } from './date.time.validator'
import { ChoiceTypesValidator } from './choice.types.validator'

export class CreateWeightValidator {
    public static validate(item: Weight): void | ValidationException {
        const fields: Array<string> = []

        if (!item.value) fields.push('value')
        if (!item.unit) fields.push('unit')
        if (!item.type) fields.push('type')
        else MeasurementTypesValidator.validate(item.type)
        if (!item.timestamp) fields.push('timestamp')
        else DateTimeValidator.validate(item.timestamp)
        if (!item.patient_id) fields.push('patient_id')
        else ObjectIdValidator.validate(item.patient_id)
        if (item.device_id) ObjectIdValidator.validate(item.device_id)
        if (item.annual_variation) ChoiceTypesValidator.validate(item.annual_variation)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'Weight validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
