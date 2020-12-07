import { assert } from 'chai'
import { HandGrip } from '../../../src/application/domain/model/hand.grip'
import { CreateHandGripValidator } from '../../../src/application/domain/validator/create.hand.grip.validator'
import { HandGripMock } from '../../mocks/models/hand.grip.mock'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { Strings } from '../../../src/utils/strings'
import { HandTypes } from '../../../src/application/domain/utils/hand.types'

describe('VALIDATORS: CreateHandGripValidator', () => {
    let handGrip: HandGrip = new HandGripMock().generate()

    afterEach(() => {
        handGrip = new HandGripMock().generate()
    })

    context('when the hand grip is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = CreateHandGripValidator.validate(handGrip)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the hand grip is incomplete', () => {
        it('should throw ValidationException for an incomplete hand grip (missing type)', () => {
            try {
                handGrip.type = undefined
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HandGrip validation: type required!')
            }
        })

        it('should throw ValidationException for an incomplete hand grip (missing all fields)', () => {
            try {
                CreateHandGripValidator.validate(new HandGrip())
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HandGrip validation: value, unit, timestamp, ' +
                    'patient_id, hand required!')
            }
        })
    })

    context('when the hand grip timestamp is in invalid format', () => {
        it('should throw ValidationException for date in invalid format: 01-07-2020', () => {
            try {
                handGrip.timestamp = '01-07-2020'
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '01-07-2020'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            }
        })

        it('should throw ValidationException for date in invalid format: 2020-08-011T10:00:00.000Z', () => {
            try {
                handGrip.timestamp = '2020-08-011T10:00:00.000Z'
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '2020-08-011T10:00:00.000Z'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            }
        })

        it('should throw ValidationException with for in invalid format: 2020-13-10T10:00:00.000Z,' +
            ' because month 13 does not exist', () => {
            try {
                handGrip.timestamp = '2020-13-10T10:00:00.000Z'
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '2020-13-10T10:00:00.000Z'))
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC)
            }
        })

        it('should throw ValidationException for date in invalid format: 2020-06-31T10:00:00.000Z,' +
            ' because month 06 does not have day 31', () => {
            try {
                handGrip.timestamp = '2020-06-31T10:00:00.000Z'
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                    .replace('{0}', '2020-06-31T10:00:00.000Z'))
            }
        })
    })

    context('when the hand grip type is invalid', () => {
        const measurementTypes: Array<string> = Object.values(MeasurementTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                handGrip.type = 'invalidMeasurementType'
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalidMeasurementType'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(measurementTypes.join(', ').concat('.')))
            }
        })
    })

    context('when the hand grip patient_id is invalid', () => {
        it('should throw ValidationException for invalid ObjectId: 123', () => {
            try {
                handGrip.patient_id = '123'
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })

    context('when the hand grip device_id is invalid', () => {
        it('should throw ValidationException for invalid ObjectId: 123', () => {
            try {
                handGrip.device_id = '123'
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })

    context('when the hand_grip hand is invalid', () => {
        const handTypes: Array<string> = Object.values(HandTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                handGrip.hand = 'invalidHandType'
                CreateHandGripValidator.validate(handGrip)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalidHandType'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(handTypes.join(', ').concat('.')))
            }
        })
    })
})
