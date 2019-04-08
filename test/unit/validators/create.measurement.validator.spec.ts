import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { CreateMeasurementValidator } from '../../../src/application/domain/validator/create.measurement.validator'
import { Strings } from '../../../src/utils/strings'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { Context } from '../../../src/application/domain/model/context'
import { ContextTypes } from '../../../src/application/domain/utils/context.types'

describe('Validators: CreateMeasurementValidator', () => {
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)

    it('should return undefined when the validation was successful', () => {
        const result = CreateMeasurementValidator.validate(measurement)
        assert.equal(result, undefined)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass value', () => {
            measurement.value = undefined
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Measurement validation: value required!')
                measurement.value = DefaultEntityMock.MEASUREMENT.value
            }
        })

        it('should throw an error for does not pass unit', () => {
            measurement.unit = undefined
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Measurement validation: unit required!')
                measurement.unit = DefaultEntityMock.MEASUREMENT.unit
            }
        })

        it('should throw an error for does not pass type', () => {
            measurement.type = undefined
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Measurement validation: type required!')
            }
        })

        it('should throw an error for does pass invalid type', () => {
            measurement.type = 'invalid'
            try {
                CreateMeasurementValidator.validate(measurement)
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
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Measurement validation: value, unit, type, user_id required!')
                measurement.measurements = []
            }
        })

        it('should throw an error for does pass contexts without type', () => {
            measurement.contexts = [new Context()]
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Measurement validation: context.value, context.type required!')
            }
        })

        it('should throw an error for does pass contexts with invalid type', () => {
            measurement.contexts = [new Context().fromJSON({ value: 1, type: 'invalid' })]
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('context.type: invalid'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(ContextTypes).join(', ').concat('.')))
            }
        })

        it('should throw an error for does pass contexts without value', () => {
            measurement.contexts = [new Context().fromJSON({ type: ContextTypes.GLUCOSE_CARBOHYDRATE })]
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Measurement validation: context.value required!')
                measurement.contexts = []
            }
        })

        it('should throw an error for does pass invalid timestamp', () => {
            measurement.timestamp = '12-01-2013'
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Datetime: 12-01-2013 is not in valid ISO 8601 format.')
                assert.equal(err.description, 'Date must be in the format: yyyy-MM-dd\'T\'HH:mm:ssZ')
                measurement.timestamp = DefaultEntityMock.MEASUREMENT.timestamp
            }
        })

        it('should throw an error for does not pass user_id', () => {
            measurement.user_id = undefined
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Measurement validation: user_id required!')
            }
        })

        it('should throw an error for does pass invalid device_id', () => {
            measurement.device_id = '123'
            try {
                CreateMeasurementValidator.validate(measurement)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Some ID provided does not have a valid format!')
                assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                measurement.device_id = DefaultEntityMock.MEASUREMENT.device_id
            }
        })
    })
})
