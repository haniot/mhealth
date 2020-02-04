import { assert } from 'chai'
import { CreateActivityValidator } from '../../../src/application/domain/validator/create.activity.validator'
import { Activity } from '../../../src/application/domain/model/activity'
import { Strings } from '../../../src/utils/strings'

const activity: Activity = new Activity()
activity.start_time = '2018-12-14T12:52:59Z'
activity.end_time = '2018-12-14T13:12:37Z'
activity.duration = 1178000
activity.patient_id = '5a62be07de34500146d9c544'

describe('Validators: CreateActivityValidator', () => {
    describe('validate(activity: Activity)', () => {
        context('when the activity has all the required parameters, and that they have valid values', () => {
            it('should return undefined representing the success of the validation', () => {
                const result = CreateActivityValidator.validate(activity)
                assert.equal(result, undefined)
            })
        })

        context('when the activity does not have all the required parameters (in this case missing start_time)', () => {
            it('should throw a ValidationException', () => {
                activity.start_time = undefined
                try {
                    CreateActivityValidator.validate(activity)
                } catch (err) {
                    assert.equal(err.message, 'REQUIRED_FIELDS')
                    assert.equal(err.description, 'start_time')
                }
            })
        })

        context('when the activity does not have any of the required parameters', () => {
            it('should throw a ValidationException', () => {
                activity.end_time = undefined
                activity.duration = undefined
                activity.patient_id = ''
                try {
                    CreateActivityValidator.validate(activity)
                } catch (err) {
                    assert.equal(err.message, 'REQUIRED_FIELDS')
                    assert.equal(err.description, 'start_time, end_time, duration, patient_id')
                }
            })
        })

        context('When the activity has an invalid parameter (start_time with a date newer than end_time)', () => {
            it('should throw a ValidationException', () => {
                activity.start_time = '2018-12-15T12:52:59Z'
                activity.end_time = '2018-12-14T13:12:37Z'
                activity.duration = 1178000
                activity.patient_id = '5a62be07de34500146d9c544'
                try {
                    CreateActivityValidator.validate(activity)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'The end_time parameter can not contain an older date than ' +
                        'that the start_time parameter!')
                }
            })
        })

        context('When the activity has a duration that is incompatible with the start_time and end_time parameters', () => {
            it('should throw a ValidationException', () => {
                activity.start_time = '2018-12-14T12:52:59Z'
                activity.duration = 11780000
                try {
                    CreateActivityValidator.validate(activity)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'duration value does not match values passed in start_time ' +
                        'and end_time parameters!')
                }
            })
        })

        context('When the activity has a negative duration', () => {
            it('should throw a ValidationException', () => {
                activity.duration = -1178000
                try {
                    CreateActivityValidator.validate(activity)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELD
                        .replace('{0}', 'duration'))
                    assert.equal(err.description, Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                }
                activity.duration = 1178000
            })
        })

        context('When the activity has an invalid patient_id', () => {
            it('should throw a ValidationException', () => {
                activity.patient_id = '5a62be07de34500146d9c5442'
                try {
                    CreateActivityValidator.validate(activity)
                } catch (err) {
                    assert.equal(err.message, 'Parameter {patient_id} is not in valid format!')
                    assert.equal(err.description, Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                }
                activity.patient_id = '5a62be07de34500146d9c544'
            })
        })
    })
})
