import { ValidationException } from '../exception/validation.exception'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { ObjectIdValidator } from './object.id.validator'
import { CalfCircumference } from '../model/calf.circumference'
import { DateTimeValidator } from './date.time.validator'
import { BodyMemberSidesValidator } from './body.member.sides.validator'

export class CreateCalfCircumferenceValidator {
    public static validate(item: CalfCircumference): void | ValidationException {
        const fields: Array<string> = []

        if (!item.value) fields.push('value')
        if (!item.unit) fields.push('unit')
        if (!item.type) fields.push('type')
        else MeasurementTypesValidator.validate(item.type)
        if (!item.timestamp) fields.push('timestamp')
        else DateTimeValidator.validate(item.timestamp)
        if (!item.patient_id) fields.push('patient_id')
        else ObjectIdValidator.validate(item.patient_id)
        if (!item.leg) fields.push('leg')
        else BodyMemberSidesValidator.validate(item.leg, 'leg')
        if (item.device_id) ObjectIdValidator.validate(item.device_id)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'CalfCircumference validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
