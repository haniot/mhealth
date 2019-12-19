import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { CreateSleepValidator } from '../../../src/application/domain/validator/create.sleep.validator'
import { SleepPattern } from '../../../src/application/domain/model/sleep.pattern'
import { SleepPatternDataSet } from '../../../src/application/domain/model/sleep.pattern.data.set'
import { ObjectID } from 'bson'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { SleepType } from '../../../src/application/domain/utils/sleep.type'

const sleep: SleepMock = new SleepMock()
const data_set_aux = sleep.pattern!.data_set

describe('Validators: CreateSleepValidator', () => {
    describe('validate(sleep: Sleep)', () => {
        /**
         * Activity parameters
         */
        context('when the sleep has all the required parameters, and that they have valid values', () => {
            it('should return undefined representing the success of the validation', () => {
                const result = CreateSleepValidator.validate(sleep)
                assert.equal(result, undefined)
            })
        })

        context('when the sleep does not have all the required parameters (in this case missing start_time)', () => {
            it('should throw a ValidationException', () => {
                sleep.start_time = undefined
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'start_time'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the sleep does not have any of the required parameters', () => {
            it('should throw a ValidationException', () => {
                sleep.end_time = undefined
                sleep.duration = undefined
                sleep.patient_id = ''
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'start_time, end_time, duration, patient_id'
                        .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('When the sleep has an invalid parameter (start_time with a date newer than end_time)', () => {
            it('should throw a ValidationException', () => {
                sleep.start_time = new Date('2018-08-19T01:40:30Z').toISOString()
                sleep.end_time = new Date('2018-08-18T09:52:30Z').toISOString()
                sleep.duration = 29520000
                sleep.patient_id = '5a62be07de34500146d9c544'
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'The end_time parameter can not contain an older date ' +
                        'than that the start_time parameter!')
                }
            })
        })

        context('When the sleep has a duration that is incompatible with the start_time and end_time parameters', () => {
            it('should throw a ValidationException', () => {
                sleep.start_time = new Date('2018-08-18T01:40:30Z').toISOString()
                sleep.duration = 295200000
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'duration value does not match values passed in start_time ' +
                        'and end_time parameters!')
                }
            })
        })

        context('When the sleep has a negative duration', () => {
            it('should throw a ValidationException', () => {
                sleep.duration = -29520000
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'duration'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                sleep.duration = 29520000
            })
        })

        context('When the activity has an invalid patient_id', () => {
            it('should throw a ValidationException', () => {
                sleep.patient_id = '5a62be07de34500146d9c5442'
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, 'Parameter {patient_id} is not in valid format!')
                    assert.equal(err.description, Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                }
                sleep.patient_id = '5a62be07de34500146d9c544'
            })
        })

        /**
         * Sleep parameters
         */
        context('when the sleep does not have all the required parameters (in this case missing pattern)', () => {
            it('should throw a ValidationException', () => {
                sleep.pattern = undefined
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'pattern'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
            })
        })

        context('when the sleep does not have all the required parameters (in this case missing type and pattern of sleep)',
            () => {
                it('should throw a ValidationException', () => {
                    const sleepJSON: any = {
                        id: new ObjectID(),
                        start_time: sleep.start_time,
                        end_time: sleep.end_time,
                        duration: sleep.duration,
                        pattern: undefined,
                        type: undefined,
                        patient_id: new ObjectID()
                    }
                    const invalidSleep = new Sleep().fromJSON(sleepJSON)
                    invalidSleep.patient_id = sleepJSON.patient_id
                    try {
                        CreateSleepValidator.validate(invalidSleep)
                    } catch (err) {
                        assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.equal(err.description, 'type, pattern'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    }
                })
            })

        context('when the sleep has an invalid type', () => {
            it('should throw a ValidationException', () => {
                const sleepJSON: any = {
                    id: new ObjectID(),
                    start_time: sleep.start_time,
                    end_time: sleep.end_time,
                    duration: sleep.duration,
                    pattern: sleep.pattern,
                    type: 'classics',
                    patient_id: new ObjectID()
                }
                const invalidSleep = new Sleep().fromJSON(sleepJSON)

                try {
                    CreateSleepValidator.validate(invalidSleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'The names of the allowed Sleep Pattern types are: classic, stages.')
                }
            })
        })

        context('when the sleep does not have all the required parameters (in this case missing data_set of pattern)', () => {
            it('should throw a ValidationException', () => {
                sleep.pattern = new SleepPattern()
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'pattern.data_set is required!')
                }
            })
        })

        context('when the sleep has an empty data_set array in your pattern', () => {
            it('should throw a ValidationException', () => {
                sleep.pattern!.data_set = new Array<SleepPatternDataSet>()
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'pattern.data_set must not be empty!')
                }
                sleep.pattern!.data_set = data_set_aux
            })
        })

        context('when the sleep has an invalid data_set array in your pattern (in this case missing start_time from some data_set item)',
            () => {
                it('should throw a ValidationException', () => {
                    const dataSetItemTest: SleepPatternDataSet = new SleepPatternDataSet()
                    dataSetItemTest.name = sleep.pattern!.data_set[0].name
                    dataSetItemTest.duration = Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min milliseconds

                    sleep.pattern!.data_set = [dataSetItemTest]
                    try {
                        CreateSleepValidator.validate(sleep)
                    } catch (err) {
                        assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.equal(err.description, 'pattern.data_set.start_time'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    }
                })
            })

        context('when the sleep has an invalid data_set array in your pattern (in this case missing all elements from some data_set item)',
            () => {
                it('should throw a ValidationException', () => {
                    const dataSetItemTest: SleepPatternDataSet = new SleepPatternDataSet()

                    sleep.pattern!.data_set = [dataSetItemTest]
                    try {
                        CreateSleepValidator.validate(sleep)
                    } catch (err) {
                        assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.equal(err.description, 'pattern.data_set.start_time, pattern.data_set.name, ' +
                            'pattern.data_set.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    }
                })
            })

        context('when the sleep has an invalid data_set array in your pattern (in this case the duration of some ' +
            'data_set item is negative)',
            () => {
                it('should throw a ValidationException', () => {
                    const dataSetItemTest: SleepPatternDataSet = new SleepPatternDataSet()
                    dataSetItemTest.start_time = new Date(sleep.start_time!).toISOString()
                    dataSetItemTest.name = sleep.pattern!.data_set[0].name
                    dataSetItemTest.duration = -60000
                    sleep.pattern!.data_set = [dataSetItemTest]
                    try {
                        CreateSleepValidator.validate(sleep)
                    } catch (err) {
                        assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.equal(err.description, 'pattern.data_set.duration'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    }
                    dataSetItemTest.duration = 60000
                })
            })

        context('when the sleep pattern data set array has an invalid item (invalid name)', () => {
            it('should throw a ValidationException', () => {
                const dataSetItemJSON: any = {
                    start_time: new Date('2018-08-18T01:30:30Z').toISOString(),
                    name: 'restlesss',
                    duration: Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min
                }
                sleep.pattern!.data_set = [new SleepPatternDataSet().fromJSON(dataSetItemJSON)]
                try {
                    CreateSleepValidator.validate(sleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    if (sleep.type === SleepType.CLASSIC)
                        assert.equal(err.description, 'The names of the allowed data_set patterns are: ' +
                            'awake, asleep, restless.')
                    else
                        assert.equal(err.description, 'The names of the allowed data_set patterns are: ' +
                            'deep, light, rem, awake.')
                }
            })
        })

        context('when the sleep pattern data set array has an invalid item (invalid name) and the sleep type is "stages"', () => {
            it('should throw a ValidationException', () => {
                const sleepJSON: any = {
                    id: new ObjectID(),
                    start_time: sleep.start_time,
                    end_time: sleep.end_time,
                    duration: sleep.duration,
                    pattern: new SleepPattern(),
                    type: SleepType.STAGES,
                    patient_id: new ObjectID()
                }
                const invalidSleep = new Sleep().fromJSON(sleepJSON)
                const dataSetItemJSON: any = {
                    start_time: new Date('2018-08-18T01:30:30Z').toISOString(),
                    name: 'deeps',
                    duration: Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min
                }
                invalidSleep.pattern!.data_set = new Array<SleepPatternDataSet>()
                invalidSleep.pattern!.data_set[0] = new SleepPatternDataSet().fromJSON(dataSetItemJSON)
                try {
                    CreateSleepValidator.validate(invalidSleep)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'The names of the allowed data_set patterns are: deep, light, rem, awake.')
                }
            })
        })
    })
})
