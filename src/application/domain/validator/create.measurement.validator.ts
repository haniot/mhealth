import { Measurement } from '../model/measurement'
import { ValidationException } from '../exception/validation.exception'
import { MeasurementTypeValidator } from './measurement.type.validator'
import { ContextTypeValidator } from './context.type.validator'
import { DatetimeValidator } from './date.time.validator'
import { ObjectIdValidator } from './object.id.validator'

export class CreateMeasurementValidator {
    public static validate(item: Measurement): void | ValidationException {
        const fields: Array<string> = []

        if (!item.value) fields.push('value')
        if (!item.unit) fields.push('unit')
        if (!item.type) fields.push('type')
        else MeasurementTypeValidator.validate(item.type)
        if (item.measurements && item.measurements.length) item.measurements.forEach(measurement => this.validate(measurement))
        if (item.contexts && item.contexts.length) {
            item.contexts.forEach(context => {
                if (!context.value) fields.push('context.value')
                if (!context.type) fields.push('context.type')
                else ContextTypeValidator.validate(context.type)
            })
        }
        if (item.timestamp) DatetimeValidator.validate(item.timestamp)
        if (item.device_id) ObjectIdValidator.validate(item.device_id)
        if (!item.user_id) fields.push('user_id')
        else ObjectIdValidator.validate(item.user_id)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'Measurement validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
