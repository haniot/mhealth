import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { NumberValidator } from './number.validator'
import { HeartRateZoneData } from '../model/heart.rate.zone.data'

export class HeartRateZoneDataValidator {
    public static validate(heartRateZoneData: HeartRateZoneData, heartRateZoneName: string): void | ValidationException {
        const fields: Array<string> = []

        // Min
        if (heartRateZoneData.min === undefined) fields.push('heart_rate_zones.'.concat(heartRateZoneName).concat('.min'))
        else NumberValidator.validate(heartRateZoneData.min, 'heart_rate_zones.'.concat(heartRateZoneName).concat('.min'))

        // Max
        if (heartRateZoneData.max === undefined) fields.push('heart_rate_zones.'.concat(heartRateZoneName).concat('.max'))
        else NumberValidator.validate(heartRateZoneData.max, 'heart_rate_zones.'.concat(heartRateZoneName).concat('.max'))

        // Duration
        if (heartRateZoneData.duration === undefined) {
            fields.push('heart_rate_zones.'.concat(heartRateZoneName).concat('.duration'))
        }
        else {
            NumberValidator.validate(
                heartRateZoneData.duration, 'heart_rate_zones.'.concat(heartRateZoneName).concat('.duration')
            )
        }

        if (fields.length > 0) {
            throw new ValidationException(Strings.ERROR_MESSAGE.REQUIRED_FIELDS,
                fields.join(', ').concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
        }
    }
}
