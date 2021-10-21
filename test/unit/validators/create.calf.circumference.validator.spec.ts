import { assert } from 'chai'
import { CalfCircumference } from '../../../src/application/domain/model/calf.circumference'
import { CreateCalfCircumferenceValidator } from '../../../src/application/domain/validator/create.calf.circumference.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { Strings } from '../../../src/utils/strings'
import { CalfCircumferenceMock } from '../../mocks/models/calf.circumference.mock'
import { BodyMemberSides } from '../../../src/application/domain/utils/body.member.sides'

describe('VALIDATORS: CreateCalfCircumferenceValidator', () => {
    let calfCircumference: CalfCircumference = new CalfCircumferenceMock().generate()

    afterEach(() => {
        calfCircumference = new CalfCircumferenceMock().generate()
    })

    context('when the calf circumference is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.isUndefined(result)
            } catch (err: any) {
                assert.fail(err)
            }
        })
    })

    context('when the calf circumference is incomplete', () => {
        it('should throw ValidationException for an incomplete calf circumference (missing type)', () => {
            try {
                calfCircumference.type = undefined
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'CalfCircumference validation: type required!')
            }
        })

        it('should throw ValidationException for an incomplete calf circumference (missing all fields)', () => {
            try {
                CreateCalfCircumferenceValidator.validate(new CalfCircumference())
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'CalfCircumference validation: value, unit, timestamp, ' +
                    'patient_id, leg required!')
            }
        })
    })

    context('when the calf circumference timestamp is in invalid format', () => {
        it('should throw ValidationException for date in invalid format: 01-07-2020', () => {
            try {
                calfCircumference.timestamp = '01-07-2020'
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '01-07-2020'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            }
        })

        it('should throw ValidationException for date in invalid format: 2020-08-011T10:00:00.000Z', () => {
            try {
                calfCircumference.timestamp = '2020-08-011T10:00:00.000Z'
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '2020-08-011T10:00:00.000Z'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            }
        })

        it('should throw ValidationException with for in invalid format: 2020-13-10T10:00:00.000Z,' +
            ' because month 13 does not exist', () => {
            try {
                calfCircumference.timestamp = '2020-13-10T10:00:00.000Z'
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '2020-13-10T10:00:00.000Z'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            }
        })

        it('should throw ValidationException for date in invalid format: 2020-06-31T10:00:00.000Z,' +
            ' because month 06 does not have day 31', () => {
            try {
                calfCircumference.timestamp = '2020-06-31T10:00:00.000Z'
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '2020-06-31T10:00:00.000Z'))
            }
        })
    })

    context('when the calf circumference type is invalid', () => {
        const measurementTypes: Array<string> = Object.values(MeasurementTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                calfCircumference.type = 'invalidMeasurementType'
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalidMeasurementType'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(measurementTypes.join(', ').concat('.')))
            }
        })
    })

    context('when the calf circumference patient_id is invalid', () => {
        it('should throw ValidationException for invalid ObjectId: 123', () => {
            try {
                calfCircumference.patient_id = '123'
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })

    context('when the calf circumference device_id is invalid', () => {
        it('should throw ValidationException for invalid ObjectId: 123', () => {
            try {
                calfCircumference.device_id = '123'
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })

    context('when the calf circumference leg is invalid', () => {
        const bodyMemberSides: Array<string> = Object.values(BodyMemberSides)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                calfCircumference.leg = 'invalidLegSide'
                CreateCalfCircumferenceValidator.validate(calfCircumference)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('leg: invalidLegSide'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(bodyMemberSides.join(', ').concat('.')))
            }
        })
    })
})
