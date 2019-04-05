import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { Measurement } from '../model/measurement'
import { DatetimeValidator } from './date.time.validator'
import { ContextTypeValidator } from './context.type.validator'
import { MeasurementTypeValidator } from './measurement.type.validator'
import { ObjectIdValidator } from './object.id.validator'

export class UpdateMeasurementValidator {
    public static validate(item: Measurement): void | ValidationException {
        if (item.id) ObjectIdValidator.validate(item.id)
        if (item.type) MeasurementTypeValidator.validate(item.type)
        if (item.measurements && item.measurements.length) {
            item.measurements.forEach(measurement => {
                this.validate(measurement)
            })
        }
        if (item.contexts && item.contexts.length) {
            item.contexts.forEach(context => {
                if (context.type) ContextTypeValidator.validate(context.type)
            })
        }
        if (item.timestamp) DatetimeValidator.validate(item.timestamp)
        if (item.device_id) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED,
                Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED_DESC.concat('device_id'))
        }
        if (item.user_id) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED,
                Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED_DESC.concat('user_id'))
        }
    }
}
