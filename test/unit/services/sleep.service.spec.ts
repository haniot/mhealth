import HttpStatus from 'http-status-codes'
import { assert } from 'chai'
import { IQuery } from '../../../src/application/port/query.interface'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { Strings } from '../../../src/utils/strings'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { ISleepService } from '../../../src/application/port/sleep.service.interface'
import { SleepService } from '../../../src/application/service/sleep.service'
import { ISleepRepository } from '../../../src/application/port/sleep.repository.interface'
import { SleepPattern } from '../../../src/application/domain/model/sleep.pattern'
import { SleepPatternDataSet } from '../../../src/application/domain/model/sleep.pattern.data.set'
import { MultiStatus } from '../../../src/application/domain/model/multi.status'
import { ObjectID } from 'bson'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { SleepRepositoryMock } from '../../mocks/repositories/sleep.repository.mock'
import { SleepType } from '../../../src/application/domain/utils/sleep.type'

describe('Services: SleepService', () => {
    const sleep: Sleep = new SleepMock()
    let incorrectSleep: Sleep = new Sleep()

    // For GET route
    const sleepArr: Array<SleepMock> = new Array<SleepMock>()
    for (let i = 0; i < 3; i++) {
        sleepArr.push(new SleepMock())
    }

    /**
     * For POST route with multiple sleep objects
     */
        // Array with correct sleep objects
    const correctSleepArr: Array<Sleep> = new Array<SleepMock>()
    for (let i = 0; i < 3; i++) {
        correctSleepArr.push(new SleepMock())
    }

    // Incorrect sleep objects
    const incorrectSleepJSON: any = {
        id: new ObjectID(),
        start_time: sleep.start_time,
        end_time: sleep.end_time,
        duration: sleep.duration,
        pattern: undefined,
        type: undefined,
        patient_id: new ObjectID()
    }

    const incorrectSleep1: Sleep = new Sleep()        // Without all required fields

    const incorrectSleep2: Sleep = new Sleep().fromJSON(incorrectSleepJSON)    // Without Sleep fields
    incorrectSleep2.patient_id = incorrectSleepJSON.patient_id

    const incorrectSleep3: Sleep = new SleepMock()    // start_time with a date newer than end_time
    incorrectSleep3.start_time = '2018-12-15T12:52:59Z'
    incorrectSleep3.end_time = '2018-12-14T13:12:37Z'

    // The duration is incompatible with the start_time and end_time parameters
    const incorrectSleep4: Sleep = new SleepMock()
    incorrectSleep4.duration = 11780000

    const incorrectSleep5: Sleep = new SleepMock()    // The duration is negative
    incorrectSleep5.duration = -11780000

    const incorrectSleep6: Sleep = new SleepMock()    // patient_id is invalid
    incorrectSleep6.patient_id = '5a62be07de34500146d9c5442'

    incorrectSleepJSON.type = 'classics'              // Sleep type is invalid
    const incorrectSleep7: Sleep = new Sleep().fromJSON(incorrectSleepJSON)
    incorrectSleep7.patient_id = incorrectSleepJSON.patient_id

    const incorrectSleep8: Sleep = new SleepMock()    // Missing data_set of pattern
    incorrectSleep8.pattern = new SleepPattern()

    const incorrectSleep9: Sleep = new SleepMock()    // The pattern has an empty data_set array
    incorrectSleep9.pattern!.data_set = new Array<SleepPatternDataSet>()

    const incorrectSleep10: Sleep = new SleepMock()    // Missing fields of some item from the data_set array of pattern
    const dataSetItemSleep9: SleepPatternDataSet = new SleepPatternDataSet()
    incorrectSleep10.pattern!.data_set = [dataSetItemSleep9]

    // There is a negative duration on some item from the data_set array of pattern
    const incorrectSleep11: Sleep = new SleepMock()
    const dataSetItemSleep10: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemSleep10.start_time = sleep.start_time!
    dataSetItemSleep10.name = incorrectSleep11.pattern!.data_set[0].name
    dataSetItemSleep10.duration = -(Math.floor(Math.random() * 5 + 1) * 60000)
    incorrectSleep11.pattern!.data_set = [dataSetItemSleep10]

    // The sleep pattern data set array has an invalid item with an invalid name
    const incorrectSleep12: Sleep = new SleepMock()
    const wrongDataSetItemJSON: any = {
        start_time: '2018-08-18T01:30:30Z',
        name: 'restlesss',
        duration: Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min
    }
    incorrectSleep12.pattern!.data_set = [new SleepPatternDataSet().fromJSON(wrongDataSetItemJSON)]

    // The sleep pattern data set array has an invalid item with an invalid name and the sleep type is "stages"
    const wrongSleepJSON: any = {
        id: new ObjectID(),
        start_time: sleep.start_time,
        end_time: sleep.end_time,
        duration: sleep.duration,
        pattern: new SleepPattern(),
        type: SleepType.STAGES,
        patient_id: new ObjectID()
    }
    const incorrectSleep13: Sleep = new Sleep().fromJSON(wrongSleepJSON)
    incorrectSleep13.patient_id = wrongSleepJSON.patient_id
    const wrongDataSetItem13JSON: any = {
        start_time: '2018-08-18T01:30:30Z',
        name: 'deeps',
        duration: Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min
    }
    incorrectSleep13.pattern!.data_set = new Array<SleepPatternDataSet>()
    incorrectSleep13.pattern!.data_set[0] = new SleepPatternDataSet().fromJSON(wrongDataSetItem13JSON)

    // Array with correct and incorrect sleep objects
    const mixedSleepArr: Array<Sleep> = new Array<SleepMock>()
    mixedSleepArr.push(new SleepMock())
    mixedSleepArr.push(incorrectSleep1)

    // Array with only incorrect sleep objects
    const incorrectSleepArr: Array<Sleep> = new Array<SleepMock>()
    incorrectSleepArr.push(incorrectSleep1)
    incorrectSleepArr.push(incorrectSleep2)
    incorrectSleepArr.push(incorrectSleep3)
    incorrectSleepArr.push(incorrectSleep4)
    incorrectSleepArr.push(incorrectSleep5)
    incorrectSleepArr.push(incorrectSleep6)
    incorrectSleepArr.push(incorrectSleep7)
    incorrectSleepArr.push(incorrectSleep8)
    incorrectSleepArr.push(incorrectSleep9)
    incorrectSleepArr.push(incorrectSleep10)
    incorrectSleepArr.push(incorrectSleep11)
    incorrectSleepArr.push(incorrectSleep12)
    incorrectSleepArr.push(incorrectSleep13)

    const sleepRepo: ISleepRepository = new SleepRepositoryMock()

    const sleepService: ISleepService = new SleepService(sleepRepo)

    /**
     * Method: add(sleep: Sleep | Array<Sleep>) with Sleep argument)
     */
    describe('add(sleep: Sleep | Array<Sleep>) with Sleep argument)', () => {
        context('when the Sleep is correct and it still does not exist in the repository', () => {
            it('should return the Sleep that was added', () => {
                return sleepService.add(sleep)
                    .then((result: Sleep | Array<Sleep>) => {
                        result = result as Sleep
                        assert.propertyVal(result, 'id', sleep.id)
                        assert.propertyVal(result, 'start_time', sleep.start_time)
                        assert.propertyVal(result, 'end_time', sleep.end_time)
                        assert.propertyVal(result, 'duration', sleep.duration)
                        assert.propertyVal(result, 'patient_id', sleep.patient_id)
                        assert.propertyVal(result, 'pattern', sleep.pattern)
                        assert.propertyVal(result, 'type', sleep.type)
                    })
            })
        })

        context('when the Sleep is correct but is not successfully created in the database', () => {
            it('should return undefined', () => {
                sleep.id = '507f1f77bcf86cd799439013'           // Make return undefined in create method

                return sleepService.add(sleep)
                    .then((result) => {
                        assert.equal(result, undefined)
                    })
            })
        })

        context('when the Sleep is correct but already exists in the repository', () => {
            it('should throw a ConflictException', () => {
                sleep.id = '507f1f77bcf86cd799439011'            // Make return true in checkExist method

                return sleepService.add(sleep)
                    .catch(error => {
                        assert.propertyVal(error, 'message', Strings.SLEEP.ALREADY_REGISTERED)
                    })
            })
        })

        context('when the Sleep is incorrect (missing all fields)', () => {
            it('should throw a ValidationException', () => {
                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(err, 'description', 'start_time, end_time, duration, patient_id, type, ' +
                            'pattern'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when the Sleep is incorrect (missing sleep fields)', () => {
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
                incorrectSleep = new Sleep().fromJSON(sleepJSON)
                incorrectSleep.patient_id = sleepJSON.patient_id

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(err, 'description', 'type, pattern'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when the Sleep is incorrect (start_time with a date newer than end_time)', () => {
            it('should throw a ValidationException', () => {
                incorrectSleep = new SleepMock()
                incorrectSleep.start_time = '2018-12-15T12:52:59Z'
                incorrectSleep.end_time = '2018-12-14T13:12:37Z'

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'The end_time parameter can not contain ' +
                            'an older date than that the start_time parameter!')
                    })
            })
        })

        context('when the Sleep is incorrect (the duration is incompatible with the start_time and end_time parameters)', () => {
            it('should throw a ValidationException', () => {
                incorrectSleep = new SleepMock()
                incorrectSleep.duration = 11780000

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'duration value does not match values ' +
                            'passed in start_time and end_time parameters!')
                    })
            })
        })

        context('when the Sleep is incorrect (the duration is negative)', () => {
            it('should throw a ValidationException', () => {
                incorrectSleep = new SleepMock()
                incorrectSleep.duration = -11780000

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELD
                            .replace('{0}', 'duration'))
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                    })
            })
        })

        context('when the Sleep is incorrect (patient_id is invalid)', () => {
            it('should throw a ValidationException', () => {
                incorrectSleep = new SleepMock()
                incorrectSleep.patient_id = '5a62be07de34500146d9c5442'           // Make patient_id invalid

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the Sleep is incorrect (type is invalid)', () => {
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
                incorrectSleep = new Sleep().fromJSON(sleepJSON)

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'The names of the allowed Sleep Pattern ' +
                            'types are: classic, stages.')
                    })
            })
        })

        context('when the Sleep is incorrect (missing data_set of pattern)', () => {
            it('should throw a ValidationException', () => {
                incorrectSleep = new SleepMock()
                incorrectSleep.patient_id = '5a62be07de34500146d9c544'           // Make patient_id valid
                incorrectSleep.pattern = new SleepPattern()

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(err, 'description', 'pattern.data_set is required!')
                    })
            })
        })

        context('when the Sleep is incorrect (the pattern has an empty data_set array)', () => {
            it('should throw a ValidationException', () => {
                incorrectSleep.pattern!.data_set = new Array<SleepPatternDataSet>()

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'pattern.data_set must not be empty!')
                    })
            })
        })

        context('when the Sleep is incorrect (missing fields of some item from the data_set array of pattern)', () => {
            it('should throw a ValidationException', () => {
                const dataSetItemTest: SleepPatternDataSet = new SleepPatternDataSet()

                incorrectSleep.pattern!.data_set = [dataSetItemTest]

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(err, 'description', 'pattern.data_set.start_time, ' +
                            'pattern.data_set.name, pattern.data_set.duration'
                                .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when the Sleep is incorrect (there is a negative duration on some item from the data_set array of pattern)',
            () => {
                it('should throw a ValidationException', () => {
                    const dataSetItemTest: SleepPatternDataSet = new SleepPatternDataSet()
                    dataSetItemTest.start_time = sleep.start_time!
                    dataSetItemTest.name = incorrectSleep.pattern!.data_set[0].name
                    dataSetItemTest.duration = -(Math.floor(Math.random() * 5 + 1) * 60000)
                    incorrectSleep.pattern!.data_set = [dataSetItemTest]

                    return sleepService.add(incorrectSleep)
                        .catch(err => {
                            assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELD
                                .replace('{0}', 'pattern.data_set.duration'))
                            assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                        })
                })
            })

        context('when the Sleep is incorrect (the sleep pattern data set array has an invalid item with an invalid name)', () => {
            it('should throw a ValidationException', () => {
                const dataSetItemJSON: any = {
                    start_time: '2018-08-18T01:30:30Z',
                    name: 'restlesss',
                    duration: Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min
                }
                incorrectSleep.pattern!.data_set = [new SleepPatternDataSet().fromJSON(dataSetItemJSON)]

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        if (incorrectSleep.type === SleepType.CLASSIC)
                            assert.propertyVal(err, 'description', 'The names of the allowed ' +
                                'data_set patterns are: awake, asleep, restless.')
                        else
                            assert.propertyVal(err, 'description', 'The names of the allowed ' +
                                'data_set patterns are: deep, light, rem, awake.')
                    })
            })
        })

        context('when the Sleep is incorrect (the sleep pattern data set array has an invalid item with an invalid name ' +
            'and the sleep type is "stages")', () => {
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
                incorrectSleep = new Sleep().fromJSON(sleepJSON)
                const dataSetItemJSON: any = {
                    start_time: '2018-08-18T01:30:30Z',
                    name: 'deeps',
                    duration: Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min
                }
                incorrectSleep.pattern!.data_set = new Array<SleepPatternDataSet>()
                incorrectSleep.pattern!.data_set[0] = new SleepPatternDataSet().fromJSON(dataSetItemJSON)

                return sleepService.add(incorrectSleep)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'The names of the allowed ' +
                            'data_set patterns are: deep, light, rem, awake.')
                    })
            })
        })
    })

    /**
     * Method "add(sleep: Sleep | Array<Sleep>)" with Array<Sleep> argument
     */
    describe('add(sleep: Sleep | Array<Sleep>) with Array<Sleep> argument', () => {
        context('when all the sleep objects of the array are correct and they still do not exist in the repository', () => {
            it('should create each Sleep and return a response of type MultiStatus<Sleep> with the description ' +
                'of success in sending each one of them', () => {
                return sleepService.add(correctSleepArr)
                    .then((result: Sleep | MultiStatus<Sleep>) => {
                        result = result as MultiStatus<Sleep>

                        for (let i = 0; i < result.success.length; i++) {
                            assert.propertyVal(result.success[i], 'code', HttpStatus.CREATED)
                            assert.propertyVal(result.success[i].item, 'id', correctSleepArr[i].id)
                            assert.propertyVal(result.success[i].item, 'start_time', correctSleepArr[i].start_time)
                            assert.propertyVal(result.success[i].item, 'end_time', correctSleepArr[i].end_time)
                            assert.propertyVal(result.success[i].item, 'duration', correctSleepArr[i].duration)
                            assert.propertyVal(result.success[i].item, 'patient_id', correctSleepArr[i].patient_id)
                            assert.propertyVal(result.success[i].item, 'pattern', correctSleepArr[i].pattern)
                            assert.propertyVal(result.success[i].item, 'type', correctSleepArr[i].type)
                        }

                        assert.isEmpty(result.error)
                    })
            })
        })

        context('when all the sleep objects of the array are correct but already exists in the repository', () => {
            it('should return a response of type MultiStatus<Sleep> with the description of conflict in each one of ' +
                'them', () => {
                correctSleepArr.forEach(elem => {
                    elem.id = '507f1f77bcf86cd799439011'
                })

                return sleepService.add(correctSleepArr)
                    .then((result: Sleep | MultiStatus<Sleep>) => {
                        result = result as MultiStatus<Sleep>

                        for (let i = 0; i < result.error.length; i++) {
                            assert.propertyVal(result.error[i], 'code', HttpStatus.CONFLICT)
                            assert.propertyVal(result.error[i], 'message', Strings.SLEEP.ALREADY_REGISTERED)
                            assert.propertyVal(result.error[i].item, 'id', correctSleepArr[i].id)
                            assert.propertyVal(result.error[i].item, 'start_time', correctSleepArr[i].start_time)
                            assert.propertyVal(result.error[i].item, 'end_time', correctSleepArr[i].end_time)
                            assert.propertyVal(result.error[i].item, 'duration', correctSleepArr[i].duration)
                            assert.propertyVal(result.error[i].item, 'patient_id', correctSleepArr[i].patient_id)
                            assert.propertyVal(result.error[i].item, 'pattern', correctSleepArr[i].pattern)
                            assert.propertyVal(result.error[i].item, 'type', correctSleepArr[i].type)
                        }

                        assert.isEmpty(result.success)
                    })
            })
        })

        context('when there are correct and incorrect sleep objects in the array', () => {
            it('should create each correct Sleep and return a response of type MultiStatus<Sleep> with the description of success ' +
                'and error in each one of them', () => {
                return sleepService.add(mixedSleepArr)
                    .then((result: Sleep | MultiStatus<Sleep>) => {
                        result = result as MultiStatus<Sleep>

                        assert.propertyVal(result.success[0], 'code', HttpStatus.CREATED)
                        assert.propertyVal(result.success[0].item, 'id', mixedSleepArr[0].id)
                        assert.propertyVal(result.success[0].item, 'start_time', mixedSleepArr[0].start_time)
                        assert.propertyVal(result.success[0].item, 'end_time', mixedSleepArr[0].end_time)
                        assert.propertyVal(result.success[0].item, 'duration', mixedSleepArr[0].duration)
                        assert.propertyVal(result.success[0].item, 'patient_id', mixedSleepArr[0].patient_id)
                        assert.propertyVal(result.success[0].item, 'pattern', mixedSleepArr[0].pattern)
                        assert.propertyVal(result.success[0].item, 'type', mixedSleepArr[0].type)

                        assert.propertyVal(result.error[0], 'code', HttpStatus.BAD_REQUEST)
                        assert.propertyVal(result.error[0], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[0], 'description', 'start_time, end_time, ' +
                            'duration, patient_id, type, pattern'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when all the sleep objects of the array are incorrect', () => {
            it('should return a response of type MultiStatus<Sleep> with the description of error in each one of them', () => {
                return sleepService.add(incorrectSleepArr)
                    .then((result: Sleep | MultiStatus<Sleep>) => {
                        result = result as MultiStatus<Sleep>

                        assert.propertyVal(result.error[0], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[0], 'description', 'start_time, end_time, ' +
                            'duration, patient_id, type, pattern'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        assert.propertyVal(result.error[1], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[1], 'description', 'type, pattern'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        assert.propertyVal(result.error[2], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[2], 'description', 'The end_time parameter ' +
                            'can not contain an older date than that the start_time parameter!')
                        assert.propertyVal(result.error[3], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[3], 'description', 'duration value does ' +
                            'not match values passed in start_time and end_time parameters!')
                        assert.propertyVal(result.error[4], 'message', Strings.ERROR_MESSAGE.INVALID_FIELD
                            .replace('{0}', 'duration'))
                        assert.propertyVal(result.error[4], 'description', Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                        assert.propertyVal(result.error[5], 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        assert.propertyVal(result.error[5], 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                        assert.propertyVal(result.error[6], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[6], 'description', 'The names of the allowed ' +
                            'Sleep Pattern types are: classic, stages.')
                        assert.propertyVal(result.error[7], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[7], 'description', 'pattern.data_set is required!')
                        assert.propertyVal(result.error[8], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[8], 'description', 'pattern.data_set must not be empty!')
                        assert.propertyVal(result.error[9], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[9], 'description', 'pattern.data_set.start_time, ' +
                            'pattern.data_set.name, pattern.data_set.duration'
                                .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        assert.propertyVal(result.error[10], 'message', Strings.ERROR_MESSAGE.INVALID_FIELD
                            .replace('{0}', 'pattern.data_set.duration'))
                        assert.propertyVal(result.error[10], 'description', Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                        assert.propertyVal(result.error[11], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        if (result.error[11].item.type === SleepType.CLASSIC) {
                            assert.propertyVal(result.error[11], 'description', 'The names of the allowed ' +
                                'data_set patterns are: awake, asleep, restless.')
                        } else {
                            assert.propertyVal(result.error[11], 'description', 'The names of the allowed ' +
                                'data_set patterns are: deep, light, rem, awake.')
                        }
                        assert.propertyVal(result.error[12], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[12], 'description', 'The names of the allowed ' +
                            'data_set patterns are: deep, light, rem, awake.')

                        for (let i = 0; i < result.error.length; i++) {
                            assert.propertyVal(result.error[i], 'code', HttpStatus.BAD_REQUEST)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'id', incorrectSleepArr[i].id)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'start_time', incorrectSleepArr[i].start_time)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'end_time', incorrectSleepArr[i].end_time)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'duration', incorrectSleepArr[i].duration)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'patient_id', incorrectSleepArr[i].patient_id)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'pattern', incorrectSleepArr[i].pattern)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'type', incorrectSleepArr[i].type)
                        }

                        assert.isEmpty(result.success)
                    })
            })
        })
    })

    /**
     * Method: getByIdAndPatient(sleepId: string, patientId: string, query: IQuery)
     */
    describe('getByIdAndPatient(sleepId: string, patientId: string, query: IQuery)', () => {
        context('when there is sleep with the received parameters', () => {
            it('should return the Sleep that was found', () => {
                sleep.id = '507f1f77bcf86cd799439011'            // Make mock return a sleep
                const query: IQuery = new Query()
                query.filters = {
                    _id: sleep.id,
                    patient_id: sleep.patient_id
                }

                return sleepService.getByIdAndPatient(sleep.id!, sleep.patient_id, query)
                    .then(result => {
                        assert(result, 'result must not be undefined')
                    })
            })
        })

        context('when there is no sleep with the received parameters', () => {
            it('should return undefined', () => {
                sleep.id = '5a62be07de34500146d9c544'            // Make mock return undefined
                const query: IQuery = new Query()
                query.filters = {
                    _id: sleep.id,
                    patient_id: sleep.patient_id
                }

                return sleepService.getByIdAndPatient(sleep.id!, sleep.patient_id, query)
                    .then(result => {
                        assert.isUndefined(result)
                    })
            })
        })

        context('when the sleep id is invalid', () => {
            it('should throw a ValidationException', async () => {
                sleep.id = '5a62be07de34500146d9c5442'       // Make sleep id invalid
                const query: IQuery = new Query()
                query.filters = {
                    _id: sleep.id,
                    patient_id: sleep.patient_id
                }

                try {
                    await sleepService.getByIdAndPatient(sleep.id!, sleep.patient_id, query)
                } catch (err) {
                    assert.propertyVal(err, 'message', Strings.SLEEP.PARAM_ID_NOT_VALID_FORMAT)
                    assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                }
            })
        })

        context('when the sleep patient_id is invalid', () => {
            it('should throw a ValidationException', async () => {
                sleep.patient_id = '5a62be07de34500146d9c5442'     // Make patient_id invalid
                const query: IQuery = new Query()
                query.filters = {
                    _id: sleep.id,
                    patient_id: sleep.patient_id
                }

                try {
                    await sleepService.getByIdAndPatient(sleep.id!, sleep.patient_id, query)
                } catch (err) {
                    assert.propertyVal(err, 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                    assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                }
            })
        })
    })

    /**
     * Method: getAllByPatient(patientId: string, query: IQuery)
     */
    describe('getAllByPatient(patientId: string, query: IQuery)', () => {
        context('when there is at least one sleep associated with that patientId', () => {
            it('should return a Sleep array', () => {
                sleep.patient_id = '5a62be07de34500146d9c544'      // Make patient_id valid again
                const query: IQuery = new Query()
                query.filters = {
                    patient_id: sleep.patient_id
                }

                return sleepService.getAllByPatient(sleep.patient_id, query)
                    .then(result => {
                        assert(result, 'result must not be undefined')
                    })
            })
        })

        context('when there is no sleep with the received parameters', () => {
            it('should return an empty array', () => {
                sleep.patient_id = '507f1f77bcf86cd799439011'        // Make mock return an empty array
                const query: IQuery = new Query()
                query.filters = {
                    patient_id: sleep.patient_id
                }

                return sleepService.getAllByPatient(sleep.patient_id, query)
                    .then(result => {
                        assert.isArray(result)
                        assert.isEmpty(result)
                    })
            })
        })

        context('when the sleep patient_id is invalid', () => {
            it('should throw a ValidationException', async () => {
                sleep.patient_id = '5a62be07de34500146d9c5442'     // Make patient_id invalid again
                const query: IQuery = new Query()
                query.filters = {
                    _id: sleep.id,
                    patient_id: sleep.patient_id
                }

                try {
                    await sleepService.getAllByPatient(sleep.patient_id, query)
                } catch (err) {
                    assert.propertyVal(err, 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                    assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                }
            })
        })
    })

    /**
     * Method: removeByPatient(sleepId: string, patientId: string)
     */
    describe('removeByPatient(sleepId: string, patientId: string)', () => {
        context('when there is sleep with the received parameters', () => {
            it('should return true', () => {
                sleep.id = '507f1f77bcf86cd799439011'            // Make mock return true
                sleep.patient_id = '5a62be07de34500146d9c544'     // Make patient_id valid again

                return sleepService.removeByPatient(sleep.id!, sleep.patient_id)
                    .then(result => {
                        assert.equal(result, true)
                    })
            })
        })

        context('when there is no sleep with the received parameters', () => {
            it('should return false', () => {
                sleep.id = '5a62be07de34500146d9c544'            // Make mock return false

                return sleepService.removeByPatient(sleep.id!, sleep.patient_id)
                    .then(result => {
                        assert.equal(result, false)
                    })
            })
        })

        context('when the sleep is incorrect (patient_id is invalid)', () => {
            it('should throw a ValidationException', () => {
                incorrectSleep.patient_id = '5a62be07de34500146d9c5442'     // Make patient_id invalid

                return sleepService.removeByPatient(incorrectSleep.id!, incorrectSleep.patient_id)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the sleep is incorrect (id is invalid)', () => {
            it('should throw a ValidationException', () => {
                incorrectSleep = new SleepMock()
                incorrectSleep.id = '5a62be07de34500146d9c5442'       // Make sleep id invalid

                return sleepService.removeByPatient(incorrectSleep.id!, incorrectSleep.patient_id)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.SLEEP.PARAM_ID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('countSleep(patientId: string)', () => {
        context('when there is at least one sleep object associated with the patient received', () => {
            it('should return how many sleep objects are associated with such patient in the database', () => {
                return sleepService.count(new Query().fromJSON({ filters: { patient_id: sleep.patient_id } }))
                    .then(res => {
                        assert.equal(res, 1)
                    })
            })
        })
    })
})
