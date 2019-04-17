import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { MeasurementUnitsValidator } from './measurement.units.validator'
import { Strings } from '../../../utils/strings'
import { DatetimeValidator } from './date.time.validator'
import { BloodPressure } from '../model/blood.pressure'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { MeasurementUnits } from '../utils/measurement.units'

export class CreateBloodPressureValidator {
    public static validate(item: BloodPressure): void | ValidationException {
        const fields: Array<string> = []

        if (!item.systolic) fields.push('systolic')
        if (!item.diastolic) fields.push('diastolic')
        if (!item.unit) fields.push('unit')
        else {
            MeasurementUnitsValidator.validate(item.unit)
            if (item.unit !== MeasurementUnits.BLOOD_PRESSURE) {
                throw new ValidationException(
                    Strings.MEASUREMENT.UNIT_ERROR.concat(`blood pressure: ${item.unit}`),
                    Strings.MEASUREMENT.UNIT_ERROR_DESC.concat(MeasurementUnits.BLOOD_PRESSURE))
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
                'BloodPressure validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
