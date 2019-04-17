import { ValidationException } from '../exception/validation.exception'
import { MeasurementUnitsValidator } from './measurement.units.validator'
import { Strings } from '../../../utils/strings'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { DatetimeValidator } from './date.time.validator'
import { ObjectIdValidator } from './object.id.validator'
import { Weight } from '../model/weight'
import { MeasurementUnits } from '../utils/measurement.units'

export class CreateWeightValidator {
    public static validate(item: Weight): void | ValidationException {
        const fields: Array<string> = []

        if (!item.value) fields.push('value')
        if (!item.unit) fields.push('unit')
        else {
            MeasurementUnitsValidator.validate(item.unit)
            if (item.unit !== MeasurementUnits.WEIGHT) {
                throw new ValidationException(
                    Strings.MEASUREMENT.UNIT_ERROR.concat(`weight: ${item.unit}`),
                    Strings.MEASUREMENT.UNIT_ERROR_DESC.concat(MeasurementUnits.WEIGHT))
            }
        }
        if (!item.type) fields.push('type')
        else MeasurementTypesValidator.validate(item.type)
        if (!item.timestamp) fields.push('timestamp')
        else DatetimeValidator.validate(item.timestamp)
        if (!item.user_id) fields.push('user_id')
        else ObjectIdValidator.validate(item.user_id)
        if (item.device_id) ObjectIdValidator.validate(item.device_id)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'Weight validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
