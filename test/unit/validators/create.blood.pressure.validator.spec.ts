import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { CreateBloodPressureValidator } from '../../../src/application/domain/validator/create.blood.pressure.validator'

describe('Validators: CreateBloodPressureValidator', () => {
    const measurement: BloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)

    it('should return undefined when the validation was successful', () => {
        const result = CreateBloodPressureValidator.validate(measurement)
        assert.isUndefined(result)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass systolic', () => {
            measurement.systolic = undefined
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BloodPressure validation: systolic required!')
            } finally {
                measurement.systolic = DefaultEntityMock.BLOOD_PRESSURE.systolic
            }
        })
        it('should throw an error for does not pass diastolic', () => {
            measurement.diastolic = undefined
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BloodPressure validation: diastolic required!')
            } finally {
                measurement.diastolic = DefaultEntityMock.BLOOD_PRESSURE.diastolic
            }
        })
        it('should throw an error for does not pass unit', () => {
            measurement.unit = undefined
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BloodPressure validation: unit required!')
            } finally {
                measurement.unit = DefaultEntityMock.BLOOD_PRESSURE.unit
            }
        })
        it('should throw an error for does not pass type', () => {
            measurement.type = undefined
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BloodPressure validation: type required!')
            }
        })
        it('should throw an error for does pass invalid type', () => {
            measurement.type = 'invalid'
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalid'))
                assert.propertyVal(err, 'description',
                    Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC.concat(Object.values(MeasurementTypes).join(', ').concat('.')))
            } finally {
                measurement.type = DefaultEntityMock.BLOOD_PRESSURE.type
            }
        })
        it('should throw an error for does not pass timestamp', () => {
            measurement.timestamp = undefined
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BloodPressure validation: timestamp required!')
            }
        })
        it('should throw an error for does pass invalid timestamp', () => {
            measurement.timestamp = '12-04-2012'
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Datetime: 12-04-2012 is not in valid ISO 8601 format.')
                assert.propertyVal(err, 'description', 'Date must be in the format: yyyy-MM-dd\'T\'HH:mm:ssZ')
            } finally {
                measurement.timestamp = DefaultEntityMock.BLOOD_PRESSURE.timestamp
            }
        })
        it('should throw an error for does not pass user_id', () => {
            measurement.user_id = undefined
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BloodPressure validation: user_id required!')
            }
        })
        it('should throw an error for does pass invalid user_id', () => {
            measurement.user_id = '123'
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                measurement.user_id = DefaultEntityMock.BLOOD_PRESSURE.user_id
            }
        })
        it('should throw an error for does not pass device_id', () => {
            measurement.device_id = undefined
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BloodPressure validation: device_id required!')
            }
        })
        it('should throw an error for does pass invalid device_id', () => {
            measurement.device_id = '123'
            try {
                assert.ifError(CreateBloodPressureValidator.validate(measurement))
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })
})
