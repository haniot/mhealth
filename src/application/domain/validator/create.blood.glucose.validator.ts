import { ValidationException } from '../exception/validation.exception'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { ObjectIdValidator } from './object.id.validator'
import { BloodGlucose } from '../model/blood.glucose'
import { MealTypesValidator } from './meal.types.validator'
import { DateTimeValidator } from './date.time.validator'

export class CreateBloodGlucoseValidator {
    public static validate(item: BloodGlucose): void | ValidationException {
        const fields: Array<string> = []

        if (!item.value) fields.push('value')
        if (!item.unit) fields.push('unit')
        if (!item.meal) fields.push('meal')
        else MealTypesValidator.validate(item.meal)
        if (!item.type) fields.push('type')
        else MeasurementTypesValidator.validate(item.type)
        if (!item.timestamp) fields.push('timestamp')
        else DateTimeValidator.validate(item.timestamp)
        if (!item.patient_id) fields.push('patient_id')
        else ObjectIdValidator.validate(item.patient_id)
        if (item.device_id) ObjectIdValidator.validate(item.device_id)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'BloodGlucose validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
