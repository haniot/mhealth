import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { CreateBodyTemperatureValidator } from '../../../src/application/domain/validator/create.body.temperature.validator'

describe('Validators: CreateBodyTemperatureValidator', () => {
    const measurement: BodyTemperature = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
    measurement.patient_id = DefaultEntityMock.BODY_TEMPERATURE.patient_id

    it('should return undefined when the validation was successful', () => {
        const result = CreateBodyTemperatureValidator.validate(measurement)
        assert.isUndefined(result)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass value', () => {
            measurement.value = undefined
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BodyTemperature validation: value required!')
            } finally {
                measurement.value = DefaultEntityMock.BODY_TEMPERATURE.value
            }
        })
        it('should throw an error for does not pass unit', () => {
            measurement.unit = undefined
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BodyTemperature validation: unit required!')
            } finally {
                measurement.unit = DefaultEntityMock.BODY_TEMPERATURE.unit
            }
        })
        it('should throw an error for does not pass type', () => {
            measurement.type = undefined
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BodyTemperature validation: type required!')
            }
        })
        it('should throw an error for does pass invalid type', () => {
            measurement.type = 'invalid'
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalid'))
                assert.propertyVal(err, 'description',
                    Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC.concat(Object.values(MeasurementTypes).join(', ').concat('.')))
            } finally {
                measurement.type = DefaultEntityMock.BODY_TEMPERATURE.type
            }
        })
        it('should throw an error for does not pass timestamp', () => {
            measurement.timestamp = undefined
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BodyTemperature validation: timestamp required!')
            }
        })
        it('should throw an error for does pass invalid timestamp', () => {
            measurement.timestamp = '12-04-2012'
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '12-04-2012'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            } finally {
                measurement.timestamp = DefaultEntityMock.BODY_TEMPERATURE.timestamp
            }
        })
        it('should throw an error for does not pass patient_id', () => {
            measurement.patient_id = undefined
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BodyTemperature validation: patient_id required!')
            }
        })
        it('should throw an error for does pass invalid patient_id', () => {
            measurement.patient_id = '123'
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                measurement.patient_id = DefaultEntityMock.BODY_TEMPERATURE.patient_id
            }
        })
        it('should throw an error for does not pass device_id', () => {
            measurement.device_id = undefined
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'BodyTemperature validation: device_id required!')
            }
        })
        it('should throw an error for does pass invalid device_id', () => {
            measurement.device_id = '123'
            try {
                CreateBodyTemperatureValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })
})
