import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { Strings } from '../../../src/utils/strings'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { Context } from '../../../src/application/domain/model/context'
import { ContextTypes } from '../../../src/application/domain/utils/context.types'
import { UpdateMeasurementValidator } from '../../../src/application/domain/validator/update.measurement.validator'

describe('Validators: CreateMeasurementValidator', () => {
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
    measurement.user_id = undefined
    measurement.device_id = undefined
    measurement.contexts = [new Context().fromJSON({value: 3})]

    it('should return undefined when the validation was successful', () => {
        const result = UpdateMeasurementValidator.validate(measurement)
        assert.equal(result, undefined)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does pass invalid id', () => {
            measurement.id = '123'
            try {
                UpdateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                measurement.id = DefaultEntityMock.MEASUREMENT.id
            }
        })
        it('should throw an error for does pass invalid type', () => {
            measurement.type = 'invalid'
            try {
                UpdateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalid'))
                assert.equal(err.description, Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(MeasurementTypes).join(', ').concat('.')))
                measurement.type = DefaultEntityMock.MEASUREMENT.type
            }
        })

        it('should throw an error for does pass invalid measurements', () => {
            measurement.measurements = [new Measurement()]
            try {
                UpdateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Measurement validation: value, unit, type, user_id required!')
                measurement.measurements = []
            }
        })

        it('should throw an error for does pass contexts with invalid type', () => {
            measurement.contexts = [new Context().fromJSON({ type: 'invalid' })]
            try {
                UpdateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('context.type: invalid'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(ContextTypes).join(', ').concat('.')))
                measurement.contexts = []
            }
        })

        it('should throw an error for does pass invalid timestamp', () => {
            measurement.timestamp = '12-01-2013'
            try {
                UpdateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Datetime: 12-01-2013 is not in valid ISO 8601 format.')
                assert.equal(err.description, 'Date must be in the format: yyyy-MM-dd\'T\'HH:mm:ssZ')
                measurement.timestamp = DefaultEntityMock.MEASUREMENT.timestamp
            }
        })

        it('should throw an error for does pass device_id', () => {
            measurement.device_id = DefaultEntityMock.MEASUREMENT.device_id
            try {
                UpdateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED)
                assert.equal(err.description, Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED_DESC.concat('device_id'))
                measurement.device_id = undefined
            }
        })

        it('should throw an error for does pass user_id', () => {
            measurement.user_id = DefaultEntityMock.MEASUREMENT.user_id
            try {
                UpdateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED)
                assert.equal(err.description, Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED_DESC.concat('user_id'))
            }
        })
    })
})
