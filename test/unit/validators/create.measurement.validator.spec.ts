import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { CreateMeasurementValidator } from '../../../src/application/domain/validator/create.measurement.validator'

describe('Validators: CreateMeasurementValidator', () => {
    const bodyMass: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT_BODY_MASS)
    // const temperature: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT_TEMPERATURE)

    it('should return undefined when the validation was successful', () => {
        const result = CreateMeasurementValidator.validate(bodyMass)
        assert.equal(result, undefined)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass value', () => {
            bodyMass.value = undefined
            try {
                CreateMeasurementValidator.validate(bodyMass)
            } catch (err) {
                assert.property(err, 'message')
                assert.property(err, 'description')
                assert.equal(err.message, 'Required fields were not provided...')
                assert.equal(err.description, 'Device validation: name required!')
                bodyMass.value = DefaultEntityMock.MEASUREMENT_BODY_MASS.value
            }
        })
        it('should throw an error for does not pass unit')
        it('should throw an error for does not pass type')
        it('should throw an error for does pass invalid type')
        it('should throw an error for does pass invalid measurements')
        it('should throw an error for does pass contexts without type')
        it('should throw an error for does pass contexts with invalid type')
        it('should throw an error for does pass contexts without value')
        it('should throw an error for does pass contexts without value')
        it('should throw an error for does pass invalid timestamp')
        it('should throw an error for does pass invalid device_id')
        it('should throw an error for does not pass user_id')
        it('should throw an error for does pass invalid user_id')
    })
})
