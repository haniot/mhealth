import { ValidationException } from '../exception/validation.exception'
import { HeartRateZoneDataValidator } from './heart.rate.zone.data.validator'
import { Strings } from '../../../utils/strings'
import { HeartRateZone } from '../model/heart.rate.zone'

export class HeartRateZoneValidator {
    public static validate(heartRateZone: HeartRateZone): void | ValidationException {
        const fields: Array<string> = []

        if (!heartRateZone.fat_burn) fields.push('heart_rate_zones.fat_burn')
        else HeartRateZoneDataValidator.validate(heartRateZone.fat_burn, 'fat_burn')

        if (!heartRateZone.cardio) fields.push('heart_rate_zones.cardio')
        else HeartRateZoneDataValidator.validate(heartRateZone.cardio, 'cardio')

        if (!heartRateZone.peak) fields.push('heart_rate_zones.peak')
        else HeartRateZoneDataValidator.validate(heartRateZone.peak, 'peak')

        if (!heartRateZone.out_of_range) fields.push('heart_rate_zones.out_of_range')
        else HeartRateZoneDataValidator.validate(heartRateZone.out_of_range, 'out_of_range')

        if (fields.length > 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.REQUIRED_FIELDS,
                fields.join(', ').concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
        }
    }
}
