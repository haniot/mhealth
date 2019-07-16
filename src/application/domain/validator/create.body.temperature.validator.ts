import { ValidationException } from '../exception/validation.exception'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { DatetimeValidator } from './date.time.validator'
import { ObjectIdValidator } from './object.id.validator'
import { BodyTemperature } from '../model/body.temperature'

export class CreateBodyTemperatureValidator {
    public static validate(item: BodyTemperature): void | ValidationException {
        const fields: Array<string> = []

        if (!item.value) fields.push('value')
        if (!item.unit) fields.push('unit')
        if (!item.type) fields.push('type')
        else MeasurementTypesValidator.validate(item.type)
        if (!item.timestamp) fields.push('timestamp')
        else DatetimeValidator.validate(item.timestamp)
        if (!item.patient_id) fields.push('patient_id')
        else ObjectIdValidator.validate(item.patient_id)
        if (item.device_id) ObjectIdValidator.validate(item.device_id)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'BodyTemperature validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
