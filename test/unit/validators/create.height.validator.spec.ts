import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { CreateHeightValidator } from '../../../src/application/domain/validator/create.height.validator'
import { Height } from '../../../src/application/domain/model/height'

describe('Validators: CreateHeightValidator', () => {
    const measurement: Height = new Height().fromJSON(DefaultEntityMock.HEIGHT)

    it('should return undefined when the validation was successful', () => {
        const result = CreateHeightValidator.validate(measurement)
        assert.isUndefined(result)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass value', () => {
            measurement.value = undefined
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Height validation: value required!')
            } finally {
                measurement.value = DefaultEntityMock.HEIGHT.value
            }
        })
        it('should throw an error for does not pass unit', () => {
            measurement.unit = undefined
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Height validation: unit required!')
            } finally {
                measurement.unit = DefaultEntityMock.HEIGHT.unit
            }
        })
        it('should throw an error for does not pass type', () => {
            measurement.type = undefined
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Height validation: type required!')
            }
        })
        it('should throw an error for does pass invalid type', () => {
            measurement.type = 'invalid'
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalid'))
                assert.propertyVal(err, 'description',
                    Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC.concat(Object.values(MeasurementTypes).join(', ').concat('.')))
            } finally {
                measurement.type = DefaultEntityMock.HEIGHT.type
            }
        })
        it('should throw an error for does not pass timestamp', () => {
            measurement.timestamp = undefined
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Height validation: timestamp required!')
            }
        })
        it('should throw an error for does pass invalid timestamp', () => {
            measurement.timestamp = '12-04-2012'
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Datetime: 12-04-2012 is not in valid ISO 8601 format.')
                assert.propertyVal(err, 'description', 'Date must be in the format: yyyy-MM-dd\'T\'HH:mm:ssZ')
            } finally {
                measurement.timestamp = DefaultEntityMock.HEIGHT.timestamp
            }
        })
        it('should throw an error for does not pass user_id', () => {
            measurement.user_id = undefined
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Height validation: user_id required!')
            }
        })
        it('should throw an error for does pass invalid user_id', () => {
            measurement.user_id = '123'
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                measurement.user_id = DefaultEntityMock.HEIGHT.user_id
            }
        })
        it('should throw an error for does not pass device_id', () => {
            measurement.device_id = undefined
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Height validation: device_id required!')
            }
        })
        it('should throw an error for does pass invalid device_id', () => {
            measurement.device_id = '123'
            try {
                assert.ifError(CreateHeightValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })
})
