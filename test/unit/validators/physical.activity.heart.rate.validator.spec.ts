import { assert } from 'chai'
import { HeartRateZone } from '../../../src/application/domain/model/heart.rate.zone'
import { Strings } from '../../../src/utils/strings'
import { HeartRateZoneMock } from '../../mocks/models/heart.rate.zone.mock'
import { HeartRateZoneValidator } from '../../../src/application/domain/validator/heart.rate.zone.validator'
import { HeartRateZoneData } from '../../../src/application/domain/model/heart.rate.zone.data'

let activityHeartRate: HeartRateZone = new HeartRateZoneMock()
const out_of_range_aux = activityHeartRate.out_of_range
const fat_burn_aux = activityHeartRate.fat_burn
const cardio_aux = activityHeartRate.cardio
const peak_aux = activityHeartRate.peak

describe('Validators: HeartRateZoneValidator', () => {
    describe('validate(heartRate: HeartRateZone)', () => {
        context('when the weight has all the required parameters, and that they have valid values', () => {
            it('should return undefined representing the success of the validation', () => {
                const result = HeartRateZoneValidator.validate(activityHeartRate)
                assert.equal(result, undefined)
            })
        })

        context('when the HeartRateZone does not have all the required parameters (in this case missing average)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.cardio = undefined
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.cardio'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone does not have any of the required parameters', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate = new HeartRateZone()
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn, heart_rate_zones.cardio, heart_rate_zones.peak, ' +
                        'heart_rate_zones.out_of_range'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone has an invalid "Out of Range Zone" parameter (the parameter is empty)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.out_of_range = new HeartRateZoneData()
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.out_of_range.min, ' +
                        'heart_rate_zones.out_of_range.max, heart_rate_zones.out_of_range.duration'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone has an invalid "Fat Burn Zone" parameter (the parameter is empty)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.out_of_range = out_of_range_aux
                activityHeartRate.fat_burn = new HeartRateZoneData()
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.min, heart_rate_zones.fat_burn.max, ' +
                        'heart_rate_zones.fat_burn.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone has an invalid "Cardio Zone" parameter (the parameter is empty)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.fat_burn = fat_burn_aux
                activityHeartRate.cardio = new HeartRateZoneData()
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.cardio.min, heart_rate_zones.cardio.max, ' +
                        'heart_rate_zones.cardio.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone has an invalid "Peak Zone" parameter (the parameter is empty)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.cardio = cardio_aux
                activityHeartRate.peak = new HeartRateZoneData()
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.peak.min, heart_rate_zones.peak.max, ' +
                        'heart_rate_zones.peak.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
                activityHeartRate.peak = peak_aux
            })
        })

        context('when the HeartRateZone has an invalid "Out of Range Zone" parameter (the min parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.out_of_range!.min = -30
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.out_of_range.min'
                        .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.out_of_range!.min = 30

            })
        })

        context('when the HeartRateZone has an invalid "Out of Range Zone" parameter (the max parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.out_of_range!.max = -91
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.out_of_range.max'
                        .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.out_of_range!.max = 91

            })
        })

        context('when the HeartRateZone has an invalid "Out of Range Zone" parameter ' +
            '(the duration parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.out_of_range!.duration = -60000
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.out_of_range.duration'
                        .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.out_of_range!.duration = 60000

            })
        })

        context('when the HeartRateZone has an invalid "Fat Burn Zone" parameter (the min parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.fat_burn!.min = -91
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.min'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.fat_burn!.min = 91
            })
        })

        context('when the HeartRateZone has an invalid "Fat Burn Zone" parameter (the max parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.fat_burn!.max = -127
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.max'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.fat_burn!.max = 127
            })
        })

        context('when the HeartRateZone has an invalid "Fat Burn Zone" parameter (the duration parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.fat_burn!.duration = -600000
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.duration'
                        .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.fat_burn!.duration = 600000
            })
        })

        context('when the HeartRateZone has an invalid "Cardio Zone" parameter (the min parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.cardio!.min = -127
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.cardio.min'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.cardio!.min = 127
            })
        })

        context('when the HeartRateZone has an invalid "Cardio Zone" parameter (the max parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.cardio!.max = -154
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.cardio.max'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.cardio!.max = 154
            })
        })

        context('when the HeartRateZone has an invalid "Cardio Zone" parameter (the duration parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.cardio!.duration = -60000
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.cardio.duration'
                        .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.cardio!.duration = 60000
            })
        })

        context('when the HeartRateZone has an invalid "Peak Zone" parameter (the min parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.peak!.min = -154
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.peak.min'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.peak!.min = 154
            })
        })

        context('when the HeartRateZone has an invalid "Peak Zone" parameter (the max parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.peak!.max = -220
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.peak.max'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.peak!.max = 220
            })
        })

        context('when the HeartRateZone has an invalid "Peak Zone" parameter (the duration parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                activityHeartRate.peak!.duration = -60000
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.peak.duration'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                activityHeartRate.peak!.duration = 60000
            })
        })
    })
})
