import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { HeartRateZoneDataMock } from '../../mocks/models/heart.rate.zone.data.mock'
import { HeartRateZoneData } from '../../../src/application/domain/model/heart.rate.zone.data'
import { HeartRateZoneDataValidator } from '../../../src/application/domain/validator/heart.rate.zone.data.validator'

let heartRateZoneData: HeartRateZoneData = new HeartRateZoneDataMock()

describe('Validators: HeartRateZoneDataValidator', () => {
    describe('validate(heartRateZoneData: HeartRateZoneData, heartRateZoneName: string)', () => {
        context('when the weight has all the required parameters, and that they have valid values', () => {
            it('should return undefined representing the success of the validation', () => {
                const result = HeartRateZoneDataValidator.validate(heartRateZoneData, 'fat_burn')
                assert.equal(result, undefined)
            })
        })

        context('when the HeartRateZone does not have all the required parameters (in this case missing average)', () => {
            it('should throw a ValidationException', () => {
                heartRateZoneData.min = undefined
                try {
                    HeartRateZoneDataValidator.validate(heartRateZoneData, 'fat_burn')
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.min'
                        .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone does not have any of the required parameters', () => {
            it('should throw a ValidationException', () => {
                heartRateZoneData = new HeartRateZoneData()
                try {
                    HeartRateZoneDataValidator.validate(heartRateZoneData, 'fat_burn')
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.min, heart_rate_zones.fat_burn.max, ' +
                        'heart_rate_zones.fat_burn.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the HeartRateZone has a negative min value', () => {
            it('should throw a ValidationException', () => {
                heartRateZoneData = new HeartRateZoneDataMock()
                heartRateZoneData.min = -91
                try {
                    HeartRateZoneDataValidator.validate(heartRateZoneData, 'fat_burn')
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.min'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                heartRateZoneData.min = 91
            })
        })

        context('when the HeartRateZone has a negative max value', () => {
            it('should throw a ValidationException', () => {
                heartRateZoneData.max = -127
                try {
                    HeartRateZoneDataValidator.validate(heartRateZoneData, 'fat_burn')
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.max'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                heartRateZoneData.max = 127
            })
        })

        context('when the HeartRateZone has a negative duration value', () => {
            it('should throw a ValidationException', () => {
                heartRateZoneData.duration = -60000
                try {
                    HeartRateZoneDataValidator.validate(heartRateZoneData, 'fat_burn')
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'heart_rate_zones.fat_burn.duration'
                        .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                heartRateZoneData.duration = 60000
            })
        })
    })
})
