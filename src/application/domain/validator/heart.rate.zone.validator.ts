import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { HeartRateZone } from '../model/heart.rate.zone'
import { HeartRateZoneData } from '../model/heart.rate.zone.data'
import { IntegerPositiveValidator } from './integer.positive.validator'

export class HeartRateZoneValidator {
    public static validate(heartRateZone: HeartRateZone): void | ValidationException {
        const fields: Array<string> = []

        const invalidFields: Array<string> = []
        const regZone = new RegExp(/^0*[1-9][0-9]*$/i) // 1-n

        const validateZone = (zone: HeartRateZoneData, heartRateZoneName: string) => {
            if (zone.min === undefined) fields.push(`${heartRateZoneName}.min`)
            else if (!(regZone.test(String(zone.min)))) invalidFields.push(`${heartRateZoneName}.min`)

            if (zone.max === undefined) fields.push(`${heartRateZoneName}.max`)
            else if (!(regZone.test(String(zone.max)))) invalidFields.push(`${heartRateZoneName}.max`)

            if (zone.duration !== undefined) {
                IntegerPositiveValidator.validate(zone.duration, `${heartRateZoneName}.duration`)
            } else fields.push(`${heartRateZoneName}.duration`)
        }

        if (!heartRateZone.fat_burn) fields.push('heart_rate_zones.fat_burn')
        else validateZone(heartRateZone.fat_burn, 'heart_rate_zones.fat_burn')

        if (!heartRateZone.cardio) fields.push('heart_rate_zones.cardio')
        else validateZone(heartRateZone.cardio, 'heart_rate_zones.cardio')

        if (!heartRateZone.peak) fields.push('heart_rate_zones.peak')
        else validateZone(heartRateZone.peak, 'heart_rate_zones.peak')

        if (!heartRateZone.out_of_range) fields.push('heart_rate_zones.out_of_range')
        else validateZone(heartRateZone.out_of_range, 'heart_rate_zones.out_of_range')

        if (fields.length > 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.REQUIRED_FIELDS,
                fields.join(', ').concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
        }

        if (invalidFields.length) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID.replace('{0}', invalidFields.join(', ')),
                Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO
            )
        }
    }
}
