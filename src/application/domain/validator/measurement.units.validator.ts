import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { MeasurementUnits } from '../utils/measurement.units'

export class MeasurementUnitsValidator {
    public static validate(value: string): void | ValidationException {
        if (!Object.values(MeasurementUnits).includes(value)) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`unit: ${value}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(MeasurementUnits).join(', ').concat('.')))
        }
    }
}
