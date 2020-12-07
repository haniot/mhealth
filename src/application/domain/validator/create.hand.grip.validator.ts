import { ValidationException } from '../exception/validation.exception'
import { MeasurementTypesValidator } from './measurement.types.validator'
import { ObjectIdValidator } from './object.id.validator'
import { HandGrip } from '../model/hand.grip'
import { DateTimeValidator } from './date.time.validator'
import { HandTypesValidator } from './hand.types.validator'

export class CreateHandGripValidator {
    public static validate(item: HandGrip): void | ValidationException {
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
        if (!item.hand) fields.push('hand')
        else HandTypesValidator.validate(item.hand)

        if (fields.length) {
            throw new ValidationException('Required fields were not provided...',
                'HandGrip validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
