import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'
import { CreateWaistCircumferenceValidator } from '../../../src/application/domain/validator/create.waist.circumference.validator'

describe('Validators: CreateWaistCircumferenceValidator', () => {
    const measurement: WaistCircumference = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
    measurement.patient_id = DefaultEntityMock.WAIST_CIRCUMFERENCE.patient_id

    it('should return undefined when the validation was successful', () => {
        const result = CreateWaistCircumferenceValidator.validate(measurement)
        assert.isUndefined(result)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass value', () => {
            measurement.value = undefined
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'WaistCircumference validation: value required!')
            } finally {
                measurement.value = DefaultEntityMock.WAIST_CIRCUMFERENCE.value
            }
        })
        it('should throw an error for does not pass unit', () => {
            measurement.unit = undefined
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'WaistCircumference validation: unit required!')
            } finally {
                measurement.unit = DefaultEntityMock.WAIST_CIRCUMFERENCE.unit
            }
        })
        it('should throw an error for does not pass type', () => {
            measurement.type = undefined
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'WaistCircumference validation: type required!')
            }
        })
        it('should throw an error for does pass invalid type', () => {
            measurement.type = 'invalid'
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalid'))
                assert.propertyVal(err, 'description',
                    Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC.concat(Object.values(MeasurementTypes).join(', ').concat('.')))
            } finally {
                measurement.type = DefaultEntityMock.WAIST_CIRCUMFERENCE.type
            }
        })
        it('should throw an error for does not pass timestamp', () => {
            measurement.timestamp = undefined
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'WaistCircumference validation: timestamp required!')
            }
        })
        it('should throw an error for does pass invalid timestamp', () => {
            measurement.timestamp = '12-04-2012'
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '12-04-2012'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            } finally {
                measurement.timestamp = DefaultEntityMock.WAIST_CIRCUMFERENCE.timestamp
            }
        })
        it('should throw an error for does not pass patient_id', () => {
            measurement.patient_id = undefined
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'WaistCircumference validation: patient_id required!')
            }
        })
        it('should throw an error for does pass invalid patient_id', () => {
            measurement.patient_id = '123'
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                measurement.patient_id = DefaultEntityMock.WAIST_CIRCUMFERENCE.patient_id
            }
        })
        it('should throw an error for does not pass device_id', () => {
            measurement.device_id = undefined
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'WaistCircumference validation: device_id required!')
            }
        })
        it('should throw an error for does pass invalid device_id', () => {
            measurement.device_id = '123'
            try {
                CreateWaistCircumferenceValidator.validate(measurement)
            } catch (err: any) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })
})
