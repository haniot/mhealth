import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { CreateWeightValidator } from '../../../src/application/domain/validator/create.weight.validator'
import { Weight } from '../../../src/application/domain/model/weight'
import { assert } from 'chai'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { Strings } from '../../../src/utils/strings'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'

describe('Validators: CreateWeightValidator', () => {
    const measurement: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
    measurement.patient_id = DefaultEntityMock.WEIGHT.patient_id

    it('should return undefined when the validation was successful', () => {
        const result = CreateWeightValidator.validate(measurement)
        assert.isUndefined(result)
    })

    it('should return undefined when the validation was successful (without some parameters)', () => {
        measurement.device_id = undefined
        measurement.annual_variation = undefined
        const result = CreateWeightValidator.validate(measurement)
        assert.isUndefined(result)
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
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '12-04-2012'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            } finally {
                measurement.timestamp = DefaultEntityMock.WEIGHT.timestamp
            }
        })
        it('should throw an error for does not pass patient_id', () => {
            measurement.patient_id = undefined
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Weight validation: patient_id required!')
            }
        })
        it('should throw an error for does pass invalid patient_id', () => {
            measurement.patient_id = '123'
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                measurement.patient_id = DefaultEntityMock.WEIGHT.patient_id
            }
        })
        it('should throw an error for does not pass device_id', () => {
            measurement.device_id = undefined
            try {
                CreateWeightValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Weight validation: device_id required!')
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

        context('when the choice type is invalid', () => {
            const choiceTypes: Array<string> = Object.values(ChoiceTypes)

            it('should throw a ValidationException for an unmapped type', () => {
                try {
                    measurement.annual_variation = 'invalidChoiceTypes'
                    CreateWeightValidator.validate(measurement)
                    assert.fail()
                } catch (err) {
                    assert.instanceOf(err, ValidationException)
                    assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('choice: invalidChoiceTypes'))
                    assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                        .concat(`${choiceTypes.join(', ')}.`))
                }
            })
        })
    })
})
