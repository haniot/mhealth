import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { BloodPressure } from '../model/blood.pressure'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { DateTimeValidator } from './date.time.validator'

export class CreateBloodPressureValidator {
    public static validate(item: BloodPressure): void | ValidationException {
        const fields: Array<string> = []

        if (!item.systolic) fields.push('systolic')
        if (!item.diastolic) fields.push('diastolic')
        if (!item.pulse) fields.push('pulse')
        if (!item.unit) fields.push('unit')
        if (!item.type) fields.push('type')
        else MeasurementTypesValidator.validate(item.type)
        if (!item.timestamp) fields.push('timestamp')
        else DateTimeValidator.validate(item.timestamp)
        if (!item.patient_id) fields.push('patient_id')
        else ObjectIdValidator.validate(item.patient_id)
        if (item.device_id) ObjectIdValidator.validate(item.device_id)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'BloodPressure validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
