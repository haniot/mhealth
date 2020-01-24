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
            before(() => {
                activityHeartRate.cardio = undefined
            })
            after(() => {
                activityHeartRate.cardio = cardio_aux
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.cardio'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone does not have any of the required parameters', () => {
            before(() => {
                activityHeartRate = new HeartRateZone()
            })
            after(() => {
                activityHeartRate.fat_burn = fat_burn_aux
                activityHeartRate.cardio = cardio_aux
                activityHeartRate.peak = peak_aux
                activityHeartRate.out_of_range = out_of_range_aux
            })
            it('should throw a ValidationException', () => {
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
            before(() => {
                activityHeartRate.out_of_range = new HeartRateZoneData()
            })
            after(() => {
                activityHeartRate.out_of_range = out_of_range_aux
            })
            it('should throw a ValidationException', () => {
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
            before(() => {
                activityHeartRate.fat_burn = new HeartRateZoneData()
            })
            after(() => {
                activityHeartRate.fat_burn = fat_burn_aux
            })
            it('should throw a ValidationException', () => {
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
            before(() => {
                activityHeartRate.cardio = new HeartRateZoneData()
            })
            after(() => {
                activityHeartRate.cardio = cardio_aux
            })
            it('should throw a ValidationException', () => {
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
            before(() => {
                activityHeartRate.peak = new HeartRateZoneData()
            })
            after(() => {
                activityHeartRate.peak = peak_aux
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.peak.min, heart_rate_zones.peak.max, ' +
                        'heart_rate_zones.peak.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone has an invalid "Out of Range Zone" parameter (the min parameter is negative)', () => {
            before(() => {
                activityHeartRate.out_of_range!.min = -30
            })
            after(() => {
                activityHeartRate.out_of_range!.min = 30
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID
                        .replace('{0}', 'heart_rate_zones.out_of_range.min'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO)
                }

            })
        })

        context('when the HeartRateZone has an invalid "Out of Range Zone" parameter (the max parameter is negative)', () => {
            before(() => {
                activityHeartRate.out_of_range!.max = -91
            })
            after(() => {
                activityHeartRate.out_of_range!.max = 91
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID
                        .replace('{0}', 'heart_rate_zones.out_of_range.max'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO)
                }

            })
        })

        context('when the HeartRateZone has an invalid "Out of Range Zone" parameter ' +
            '(the duration parameter is negative)', () => {
            before(() => {
                activityHeartRate.out_of_range!.duration = -60000
            })
            after(() => {
                activityHeartRate.out_of_range!.duration = 60000
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELD
                        .replace('{0}', 'heart_rate_zones.out_of_range.duration'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                }

            })
        })

        context('when the HeartRateZone has an invalid "Fat Burn Zone" parameter (the min parameter is negative)', () => {
            before(() => {
                activityHeartRate.fat_burn!.min = -91
            })
            after(() => {
                activityHeartRate.fat_burn!.min = 91
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID
                        .replace('{0}', 'heart_rate_zones.fat_burn.min'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO)
                }
            })
        })

        context('when the HeartRateZone has an invalid "Fat Burn Zone" parameter (the max parameter is negative)', () => {
            before(() => {
                activityHeartRate.fat_burn!.max = -127
            })
            after(() => {
                activityHeartRate.fat_burn!.max = 127
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID
                        .replace('{0}', 'heart_rate_zones.fat_burn.max'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO)
                }
            })
        })

        context('when the HeartRateZone has an invalid "Fat Burn Zone" parameter (the duration parameter is negative)', () => {
            before(() => {
                activityHeartRate.fat_burn!.duration = -600000
            })
            after(() => {
                activityHeartRate.fat_burn!.duration = 600000
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELD
                        .replace('{0}', 'heart_rate_zones.fat_burn.duration'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                }
            })
        })

        context('when the HeartRateZone has an invalid "Cardio Zone" parameter (the min parameter is negative)', () => {
            before(() => {
                activityHeartRate.cardio!.min = -127
            })
            after(() => {
                activityHeartRate.cardio!.min = 127
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID
                        .replace('{0}', 'heart_rate_zones.cardio.min'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO)
                }
            })
        })

        context('when the HeartRateZone has an invalid "Cardio Zone" parameter (the max parameter is negative)', () => {
            before(() => {
                activityHeartRate.cardio!.max = -154
            })
            after(() => {
                activityHeartRate.cardio!.max = 154
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID
                        .replace('{0}', 'heart_rate_zones.cardio.max'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO)
                }
            })
        })

        context('when the HeartRateZone has an invalid "Cardio Zone" parameter (the duration parameter is negative)', () => {
            before(() => {
                activityHeartRate.cardio!.duration = -60000
            })
            after(() => {
                activityHeartRate.cardio!.duration = 60000
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELD
                        .replace('{0}', 'heart_rate_zones.cardio.duration'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                }
            })
        })

        context('when the HeartRateZone has an invalid "Peak Zone" parameter (the min parameter is negative)', () => {
            before(() => {
                activityHeartRate.peak!.min = -154
            })
            after(() => {
                activityHeartRate.peak!.min = 154
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID
                        .replace('{0}', 'heart_rate_zones.peak.min'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO)
                }
            })
        })

        context('when the HeartRateZone has an invalid "Peak Zone" parameter (the max parameter is negative)', () => {
            before(() => {
                activityHeartRate.peak!.max = -220
            })
            after(() => {
                activityHeartRate.peak!.max = 220
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS_NOT_VALID
                        .replace('{0}', 'heart_rate_zones.peak.max'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.INTEGER_GREATER_ZERO)
                }
            })
        })

        context('when the HeartRateZone has an invalid "Peak Zone" parameter (the duration parameter is negative)', () => {
            before(() => {
                activityHeartRate.peak!.duration = -60000
            })
            after(() => {
                activityHeartRate.peak!.duration = 60000
            })
            it('should throw a ValidationException', () => {
                try {
                    HeartRateZoneValidator.validate(activityHeartRate)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELD
                        .replace('{0}', 'heart_rate_zones.peak.duration'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                }
            })
        })
    })
})
