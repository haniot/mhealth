import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { CreateWeightValidator } from '../../../src/application/domain/validator/create.weight.validator'
import { Weight } from '../../../src/application/domain/model/weight'
import { Fat } from '../../../src/application/domain/model/fat'
import { assert } from 'chai'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { Strings } from '../../../src/utils/strings'

describe('Validators: CreateWeightValidator', () => {
    const measurement: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
    measurement.fat = new Fat().fromJSON({
        ...DefaultEntityMock.WEIGHT.fat,
        type: DefaultEntityMock.FAT.type,
        timestamp: DefaultEntityMock.WEIGHT.timestamp,
        user_id: DefaultEntityMock.WEIGHT.device_id,
        device_id: DefaultEntityMock.WEIGHT.device_id
    })

    it('should return undefined when the validation was successful', () => {
        const result = CreateWeightValidator.validate(measurement)
        assert.equal(result, undefined)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass value', () => {
            measurement.value = undefined
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Weight validation: value required!')
            } finally {
                measurement.value = DefaultEntityMock.WEIGHT.value
            }
        })
        it('should throw an error for does not pass unit', () => {
            measurement.unit = undefined
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Weight validation: unit required!')
            } finally {
                measurement.unit = DefaultEntityMock.WEIGHT.unit
            }
        })
        it('should throw an error for does not pass type', () => {
            measurement.type = undefined
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Weight validation: type required!')
            }
        })
        it('should throw an error for does pass invalid type', () => {
            measurement.type = 'invalid'
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalid'))
                assert.propertyVal(err, 'description',
                    Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC.concat(Object.values(MeasurementTypes).join(', ').concat('.')))
            } finally {
                measurement.type = DefaultEntityMock.WEIGHT.type
            }
        })
        it('should throw an error for does not pass timestamp', () => {
            measurement.timestamp = undefined
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Weight validation: timestamp required!')
            }
        })
        it('should throw an error for does pass invalid timestamp', () => {
            measurement.timestamp = '12-04-2012'
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Datetime: 12-04-2012 is not in valid ISO 8601 format.')
                assert.propertyVal(err, 'description', 'Date must be in the format: yyyy-MM-dd\'T\'HH:mm:ssZ')
            } finally {
                measurement.timestamp = DefaultEntityMock.WEIGHT.timestamp
            }
        })
        it('should throw an error for does not pass user_id', () => {
            measurement.user_id = undefined
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Weight validation: user_id required!')
            }
        })
        it('should throw an error for does pass invalid user_id', () => {
            measurement.user_id = '123'
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                measurement.user_id = DefaultEntityMock.WEIGHT.user_id
            }
        })
        it('should throw an error for does not pass device_id', () => {
            measurement.device_id = undefined
            measurement.fat = undefined
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Weight validation: device_id required!')
            } finally {
                measurement.fat = new Fat().fromJSON({
                    ...DefaultEntityMock.WEIGHT.fat,
                    type: DefaultEntityMock.FAT.type,
                    timestamp: DefaultEntityMock.WEIGHT.timestamp,
                    user_id: DefaultEntityMock.WEIGHT.device_id,
                    device_id: DefaultEntityMock.WEIGHT.device_id
                })
            }
        })
        it('should throw an error for does pass invalid device_id', () => {
            measurement.device_id = '123'
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                measurement.device_id = DefaultEntityMock.WEIGHT.device_id
            }
        })
        it('should throw an error for does pass invalid fat', () => {
            measurement.fat = new Fat()
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Fat validation: value, unit, timestamp, user_id required!')
            }
        })
    })
})