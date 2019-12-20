import HttpStatus from 'http-status-codes'
import { assert } from 'chai'
import { IQuery } from '../../../src/application/port/query.interface'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { PhysicalActivityService } from '../../../src/application/service/physical.activity.service'
import { IPhysicalActivityRepository } from '../../../src/application/port/physical.activity.repository.interface'
import { Strings } from '../../../src/utils/strings'
import { PhysicalActivity } from '../../../src/application/domain/model/physical.activity'
import { ObjectID } from 'bson'
import { IPhysicalActivityService } from '../../../src/application/port/physical.activity.service.interface'
import { MultiStatus } from '../../../src/application/domain/model/multi.status'
import { HeartRateZone } from '../../../src/application/domain/model/heart.rate.zone'
import { PhysicalActivityMock } from '../../mocks/models/physical.activity.mock'
import { Levels } from '../../../src/application/domain/utils/levels'
import { PhysicalActivityRepositoryMock } from '../../mocks/repositories/physical.activity.repository.mock'
import { HeartRateZoneData } from '../../../src/application/domain/model/heart.rate.zone.data'

describe('Services: PhysicalActivityService', () => {
    const activity: PhysicalActivity = new PhysicalActivityMock()
    const otherActivity: PhysicalActivity = new PhysicalActivityMock()
    otherActivity.start_time = undefined
    otherActivity.end_time = undefined
    otherActivity.duration = undefined
    otherActivity.levels = []
    let incorrectActivity: PhysicalActivity = new PhysicalActivity()

    // Mock through JSON
    const incorrectActivityJSON: any = {
        id: new ObjectID(),
        start_time: activity.start_time,
        end_time: activity.end_time,
        duration: activity.duration,
        patient_id: '5a62be07de34500146d9c544',
        name: 'walk',
        calories: 200,
        steps: 1000,
        distance: 1000,
        levels: [
            {
                name: 'sedentaries',
                duration: Math.floor((Math.random() * 10) * 60000)
            },
            {
                name: Levels.LIGHTLY,
                duration: Math.floor((Math.random() * 10) * 60000)
            },
            {
                name: Levels.FAIRLY,
                duration: Math.floor((Math.random() * 10) * 60000)
            },
            {
                name: Levels.VERY,
                duration: Math.floor((Math.random() * 10) * 60000)
            }
        ]
    }

    // For GET route
    const activitiesArr: Array<PhysicalActivityMock> = new Array<PhysicalActivityMock>()
    for (let i = 0; i < 3; i++) {
        activitiesArr.push(new PhysicalActivityMock())
    }

    /**
     * For POST route with multiple activities
     */
        // Array with correct activities
    const correctActivitiesArr: Array<PhysicalActivity> = new Array<PhysicalActivityMock>()
    for (let i = 0; i < 3; i++) {
        correctActivitiesArr.push(new PhysicalActivityMock())
    }

    // Incorrect activities
    const incorrectActivity1: PhysicalActivity = new PhysicalActivity()        // Without all required fields

    const incorrectActivity2: PhysicalActivity = new PhysicalActivityMock()    // Without PhysicalActivity fields
    incorrectActivity2.name = undefined
    incorrectActivity2.calories = undefined

    const incorrectActivity3: PhysicalActivity = new PhysicalActivityMock()    // start_time with a date newer than end_time
    incorrectActivity3.start_time = activity.start_time
    incorrectActivity3.end_time = '2018-12-14T13:12:37Z'

    // The duration is incompatible with the start_time and end_time parameters
    const incorrectActivity4: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity4.duration = 11780000

    const incorrectActivity5: PhysicalActivity = new PhysicalActivityMock()    // The duration is negative
    incorrectActivity5.duration = -11780000

    const incorrectActivity6: PhysicalActivity = new PhysicalActivityMock()    // patient_id is invalid
    incorrectActivity6.patient_id = '5a62be07de34500146d9c5442'

    const incorrectActivity7: PhysicalActivity = new PhysicalActivityMock()    // The calories parameter is negative
    incorrectActivity7.calories = -200

    const incorrectActivity8: PhysicalActivity = new PhysicalActivityMock()    // The steps parameter is negative
    incorrectActivity8.steps = -1000

    let incorrectActivity9: PhysicalActivity = new PhysicalActivityMock()    // The levels array has an item with an invalid type
    incorrectActivity9 = incorrectActivity9.fromJSON(incorrectActivityJSON)
    incorrectActivity9.patient_id = incorrectActivityJSON.patient_id

    // The levels array has an item that contains empty fields
    let incorrectActivity10: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivityJSON.levels[0].name = undefined
    incorrectActivityJSON.levels[0].duration = undefined
    incorrectActivity10 = incorrectActivity10.fromJSON(incorrectActivityJSON)
    incorrectActivity10.patient_id = incorrectActivityJSON.patient_id

    // The levels array has an item that contains negative duration
    let incorrectActivity11: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivityJSON.levels[0].name = Levels.SEDENTARY
    incorrectActivityJSON.levels[0].duration = -(Math.floor((Math.random() * 10 + 1) * 60000))
    incorrectActivity11 = incorrectActivity11.fromJSON(incorrectActivityJSON)
    incorrectActivity11.patient_id = incorrectActivityJSON.patient_id

    // The PhysicalActivityHeartRate is empty
    const incorrectActivity12: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity12.heart_rate_zones = new HeartRateZone()

    // The PhysicalActivityHeartRate average is negative
    const incorrectActivity13: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity13.heart_rate_average = -120

    // The PhysicalActivityHeartRate is invalid (the "Fat Burn Zone" parameter is empty)
    const incorrectActivity14: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity14.heart_rate_zones!.fat_burn = new HeartRateZoneData()

    // The PhysicalActivityHeartRate is invalid (the "Fat Burn Zone" parameter has a negative duration)
    const incorrectActivity15: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity15.heart_rate_zones!.fat_burn!.duration = -600000

    // Array with correct and incorrect activities
    const mixedActivitiesArr: Array<PhysicalActivity> = new Array<PhysicalActivityMock>()
    mixedActivitiesArr.push(new PhysicalActivityMock())
    mixedActivitiesArr.push(incorrectActivity1)

    // Array with only incorrect activities
    const incorrectActivitiesArr: Array<PhysicalActivity> = new Array<PhysicalActivityMock>()
    incorrectActivitiesArr.push(incorrectActivity1)
    incorrectActivitiesArr.push(incorrectActivity2)
    incorrectActivitiesArr.push(incorrectActivity3)
    incorrectActivitiesArr.push(incorrectActivity4)
    incorrectActivitiesArr.push(incorrectActivity5)
    incorrectActivitiesArr.push(incorrectActivity6)
    incorrectActivitiesArr.push(incorrectActivity7)
    incorrectActivitiesArr.push(incorrectActivity8)
    incorrectActivitiesArr.push(incorrectActivity9)
    incorrectActivitiesArr.push(incorrectActivity10)
    incorrectActivitiesArr.push(incorrectActivity11)
    incorrectActivitiesArr.push(incorrectActivity12)
    incorrectActivitiesArr.push(incorrectActivity13)
    incorrectActivitiesArr.push(incorrectActivity14)
    incorrectActivitiesArr.push(incorrectActivity15)

    const activityRepo: IPhysicalActivityRepository = new PhysicalActivityRepositoryMock()

    const activityService: IPhysicalActivityService = new PhysicalActivityService(activityRepo)

    /**
     * Method "add(activity: PhysicalActivity | Array<PhysicalActivity>) with PhysicalActivity argument"
     */
    describe('add(activity: PhysicalActivity | Array<PhysicalActivity>) with PhysicalActivity argument', () => {
        context('when the physical activity is correct and it still does not exist in the repository', () => {
            it('should return the PhysicalActivity that was added', () => {
                return activityService.add(activity)
                    .then((result: PhysicalActivity | MultiStatus<PhysicalActivity>) => {
                        result = result as PhysicalActivity
                        assert.propertyVal(result, 'id', activity.id)
                        assert.propertyVal(result, 'start_time', activity.start_time)
                        assert.propertyVal(result, 'end_time', activity.end_time)
                        assert.propertyVal(result, 'duration', activity.duration)
                        assert.propertyVal(result, 'patient_id', activity.patient_id)
                        assert.propertyVal(result, 'name', activity.name)
                        assert.propertyVal(result, 'calories', activity.calories)
                        assert.propertyVal(result, 'steps', activity.steps)
                        assert.propertyVal(result, 'distance', activity.distance)
                        assert.propertyVal(result, 'levels', activity.levels)
                        assert.propertyVal(result, 'heart_rate_zones', activity.heart_rate_zones)
                    })
            })
        })

        context('when the physical activity is correct but is not successfully created in the database', () => {
            it('should return undefined', () => {
                activity.id = '507f1f77bcf86cd799439013'            // Make return undefined in create method

                return activityService.add(activity)
                    .then((result) => {
                        assert.equal(result, undefined)
                    })
            })
        })

        context('when the physical activity is correct but already exists in the repository', () => {
            it('should throw a ConflictException', () => {
                activity.id = '507f1f77bcf86cd799439011'            // Make mock return true in checkExist method

                return activityService.add(activity)
                    .catch(error => {
                        assert.propertyVal(error, 'message', Strings.PHYSICAL_ACTIVITY.ALREADY_REGISTERED)
                    })
            })
        })

        context('when the physical activity is incorrect (missing all fields)', () => {
            it('should throw a ValidationException', () => {
                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(err, 'description', 'start_time, end_time, duration, patient_id, ' +
                            'name, calories'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when the physical activity is incorrect (missing physical activity fields)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity = new PhysicalActivityMock()
                incorrectActivity.name = undefined
                incorrectActivity.calories = undefined

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(err, 'description', 'name, calories'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when the physical activity is incorrect (start_time with a date newer than end_time)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity = new PhysicalActivityMock()
                incorrectActivity.start_time = activity.start_time
                incorrectActivity.end_time = '2018-12-14T13:12:37Z'

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'The end_time parameter can not contain ' +
                            'an older date than that the start_time parameter!')
                    })
            })
        })

        context('when the physical activity is incorrect (the duration is incompatible with the start_time and end_time ' +
            'parameters)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity = new PhysicalActivityMock()
                incorrectActivity.duration = 11780000

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'duration value does not match values ' +
                            'passed in start_time and end_time parameters!')
                    })
            })
        })

        context('when the physical activity is incorrect (the duration is negative)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity = new PhysicalActivityMock()
                incorrectActivity.duration = -11780000

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'duration'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when the physical activity is incorrect (patient_id is invalid)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity = new PhysicalActivityMock()
                incorrectActivity.patient_id = '5a62be07de34500146d9c5442'           // Make patient_id invalid

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the physical activity is incorrect (the calories parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity = new PhysicalActivityMock()
                incorrectActivity.calories = -200

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'calories'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when the physical activity is incorrect (the steps parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity.calories = 200
                incorrectActivity.steps = -1000

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'steps'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when the physical activity is incorrect (the steps parameter is negative)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity.steps = 1000
                incorrectActivity.distance = -1000

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'distance'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when the physical activity is incorrect (the levels array has an item with an invalid type)', () => {
            it('should throw a ValidationException', () => {
                // Mock through JSON
                incorrectActivityJSON.levels[0].duration = Math.floor((Math.random() * 10) * 60000)
                incorrectActivity = incorrectActivity.fromJSON(incorrectActivityJSON)

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'The name of level provided "sedentaries" is not supported...')
                        assert.propertyVal(err, 'description', 'The names of the allowed levels are: sedentary, lightly, fairly, very.')
                    })
            })
        })

        context('when the physical activity is incorrect (the levels array has an item that contains empty fields)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivityJSON.levels[0].name = undefined
                incorrectActivityJSON.levels[0].duration = undefined
                incorrectActivity = incorrectActivity.fromJSON(incorrectActivityJSON)

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'The levels array must have values for the ' +
                            'following levels: sedentary, lightly, fairly, very.')
                    })
            })
        })

        context('when the physical activity is incorrect (the levels array has an item that contains negative duration)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivityJSON.levels[0].name = Levels.SEDENTARY
                incorrectActivityJSON.levels[0].duration = -(Math.floor((Math.random() * 10 + 1) * 60000))
                incorrectActivity = incorrectActivity.fromJSON(incorrectActivityJSON)

                return activityService.add(incorrectActivity)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'levels.duration'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when the physical activity is incorrect (the PhysicalActivityHeartRate is empty)', () => {
            it('should throw a ValidationException', () => {
                return activityService.add(incorrectActivity12)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(err, 'description', 'heart_rate_zones.fat_burn, ' +
                            'heart_rate_zones.cardio, heart_rate_zones.peak, heart_rate_zones.out_of_range'
                                .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when the physical activity is incorrect (the PhysicalActivityHeartRate has a negative average parameter)',
            () => {
                it('should throw a ValidationException', () => {
                    return activityService.add(incorrectActivity13)
                        .catch(err => {
                            assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            assert.propertyVal(err, 'description', 'heart_rate_average'
                                .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        })
                })
            })

        context('when the physical activity is incorrect (the "Fat Burn Zone" parameter of PhysicalActivityHeartRate is empty)',
            () => {
                it('should throw a ValidationException', () => {
                    return activityService.add(incorrectActivity14)
                        .catch(err => {
                            assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                            assert.propertyVal(err, 'description', 'heart_rate_zones.fat_burn.min, ' +
                                'heart_rate_zones.fat_burn.max, heart_rate_zones.fat_burn.duration'
                                    .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        })
                })
            })

        context('when the physical activity is incorrect ' +
            '(the "Fat Burn Zone" parameter of PhysicalActivityHeartRate has a negative duration)', () => {
            it('should throw a ValidationException', () => {
                return activityService.add(incorrectActivity15)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(err, 'description', 'heart_rate_zones.fat_burn.duration'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })
    })

    /**
     * Method "add(activity: PhysicalActivity | Array<PhysicalActivity>)" with Array<PhysicalActivity> argument
     */
    describe('add(activity: PhysicalActivity | Array<PhysicalActivity>) with Array<PhysicalActivity> argument', () => {
        context('when all the activities of the array are correct and they still do not exist in the repository', () => {
            it('should create each PhysicalActivity and return a response of type MultiStatus<PhysicalActivity> with the description ' +
                'of success in sending each one of them', () => {
                return activityService.add(correctActivitiesArr)
                    .then((result: PhysicalActivity | MultiStatus<PhysicalActivity>) => {
                        result = result as MultiStatus<PhysicalActivity>

                        for (let i = 0; i < result.success.length; i++) {
                            assert.propertyVal(result.success[i], 'code', HttpStatus.CREATED)
                            assert.propertyVal(result.success[i].item, 'id', correctActivitiesArr[i].id)
                            assert.propertyVal(result.success[i].item, 'start_time', correctActivitiesArr[i].start_time)
                            assert.propertyVal(result.success[i].item, 'end_time', correctActivitiesArr[i].end_time)
                            assert.propertyVal(result.success[i].item, 'duration', correctActivitiesArr[i].duration)
                            assert.propertyVal(result.success[i].item, 'patient_id', correctActivitiesArr[i].patient_id)
                            assert.propertyVal(result.success[i].item, 'name', correctActivitiesArr[i].name)
                            assert.propertyVal(result.success[i].item, 'calories', correctActivitiesArr[i].calories)
                            assert.propertyVal(result.success[i].item, 'steps', correctActivitiesArr[i].steps)
                            assert.propertyVal(result.success[i].item, 'distance', correctActivitiesArr[i].distance)
                            assert.propertyVal(result.success[i].item, 'levels', correctActivitiesArr[i].levels)
                            assert.propertyVal(result.success[i].item, 'heart_rate_zones',
                                correctActivitiesArr[i].heart_rate_zones)
                        }

                        assert.isEmpty(result.error)
                    })
            })
        })

        context('when all the activities of the array are correct but already exists in the repository', () => {
            it('should return a response of type MultiStatus<PhysicalActivity> with the description of conflict in each one of ' +
                'them', () => {
                correctActivitiesArr.forEach(elem => {
                    elem.id = '507f1f77bcf86cd799439011'
                })

                return activityService.add(correctActivitiesArr)
                    .then((result: PhysicalActivity | MultiStatus<PhysicalActivity>) => {
                        result = result as MultiStatus<PhysicalActivity>

                        for (let i = 0; i < result.error.length; i++) {
                            assert.propertyVal(result.error[i], 'code', HttpStatus.CONFLICT)
                            assert.propertyVal(result.error[i], 'message', Strings.PHYSICAL_ACTIVITY.ALREADY_REGISTERED)
                            assert.propertyVal(result.error[i].item, 'id', correctActivitiesArr[i].id)
                            assert.propertyVal(result.error[i].item, 'start_time', correctActivitiesArr[i].start_time)
                            assert.propertyVal(result.error[i].item, 'end_time', correctActivitiesArr[i].end_time)
                            assert.propertyVal(result.error[i].item, 'duration', correctActivitiesArr[i].duration)
                            assert.propertyVal(result.error[i].item, 'patient_id', correctActivitiesArr[i].patient_id)
                            assert.propertyVal(result.error[i].item, 'name', correctActivitiesArr[i].name)
                            assert.propertyVal(result.error[i].item, 'calories', correctActivitiesArr[i].calories)
                            assert.propertyVal(result.error[i].item, 'steps', correctActivitiesArr[i].steps)
                            assert.propertyVal(result.error[i].item, 'distance', correctActivitiesArr[i].distance)
                            assert.propertyVal(result.error[i].item, 'levels', correctActivitiesArr[i].levels)
                            assert.propertyVal(result.error[i].item, 'heart_rate_zones', correctActivitiesArr[i].heart_rate_zones)
                        }

                        assert.isEmpty(result.success)
                    })
            })
        })

        context('when there are correct and incorrect activities in the array', () => {
            it('should create each correct PhysicalActivity and return a response of type MultiStatus<PhysicalActivity> with ' +
                'the description of success and error in each one of them', () => {
                return activityService.add(mixedActivitiesArr)
                    .then((result: PhysicalActivity | MultiStatus<PhysicalActivity>) => {
                        result = result as MultiStatus<PhysicalActivity>

                        assert.propertyVal(result.success[0], 'code', HttpStatus.CREATED)
                        assert.propertyVal(result.success[0].item, 'id', mixedActivitiesArr[0].id)
                        assert.propertyVal(result.success[0].item, 'start_time', mixedActivitiesArr[0].start_time)
                        assert.propertyVal(result.success[0].item, 'end_time', mixedActivitiesArr[0].end_time)
                        assert.propertyVal(result.success[0].item, 'duration', mixedActivitiesArr[0].duration)
                        assert.propertyVal(result.success[0].item, 'patient_id', mixedActivitiesArr[0].patient_id)
                        assert.propertyVal(result.success[0].item, 'name', mixedActivitiesArr[0].name)
                        assert.propertyVal(result.success[0].item, 'calories', mixedActivitiesArr[0].calories)
                        assert.propertyVal(result.success[0].item, 'steps', mixedActivitiesArr[0].steps)
                        assert.propertyVal(result.success[0].item, 'distance', mixedActivitiesArr[0].distance)
                        assert.propertyVal(result.success[0].item, 'levels', mixedActivitiesArr[0].levels)
                        assert.propertyVal(result.success[0].item, 'heart_rate_zones', mixedActivitiesArr[0].heart_rate_zones)

                        assert.propertyVal(result.error[0], 'code', HttpStatus.BAD_REQUEST)
                        assert.propertyVal(result.error[0], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[0], 'description', 'start_time, end_time, ' +
                            'duration, patient_id, name, calories'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when all the activities of the array are incorrect', () => {
            it('should return a response of type MultiStatus<PhysicalActivity> with the description of error in each one of ' +
                'them', () => {
                return activityService.add(incorrectActivitiesArr)
                    .then((result: PhysicalActivity | MultiStatus<PhysicalActivity>) => {
                        result = result as MultiStatus<PhysicalActivity>

                        assert.propertyVal(result.error[0], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[0], 'description', 'start_time, end_time, ' +
                            'duration, patient_id, name, calories'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        assert.propertyVal(result.error[1], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[1], 'description', 'name, calories'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        assert.propertyVal(result.error[2], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[2], 'description', 'The end_time parameter can ' +
                            'not contain an older date than that the start_time parameter!')
                        assert.propertyVal(result.error[3], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[3], 'description', 'duration value does not match ' +
                            'values passed in start_time and end_time parameters!')
                        assert.propertyVal(result.error[4], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[4], 'description', 'duration'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        assert.propertyVal(result.error[5], 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        assert.propertyVal(result.error[5], 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                        assert.propertyVal(result.error[6], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[6], 'description', 'calories'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        assert.propertyVal(result.error[7], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[7], 'description', 'steps'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        assert.propertyVal(result.error[8], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[8], 'description', 'The names of the allowed levels are: ' +
                            'sedentary, lightly, fairly, very.')
                        assert.propertyVal(result.error[9], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[9], 'description', 'The levels array must have ' +
                            'values for the following levels: sedentary, lightly, fairly, very.')
                        assert.propertyVal(result.error[10], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[10], 'description', 'levels.duration'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        assert.propertyVal(result.error[11], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[11], 'description', 'heart_rate_zones.fat_burn, ' +
                            'heart_rate_zones.cardio, heart_rate_zones.peak, heart_rate_zones.out_of_range'
                                .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        assert.propertyVal(result.error[12], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[12], 'description', 'heart_rate_average'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        assert.propertyVal(result.error[13], 'message', Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        assert.propertyVal(result.error[13], 'description', 'heart_rate_zones.fat_burn.min, ' +
                            'heart_rate_zones.fat_burn.max, heart_rate_zones.fat_burn.duration'
                                .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        assert.propertyVal(result.error[14], 'message', Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        assert.propertyVal(result.error[14], 'description', 'heart_rate_zones.fat_burn.duration'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))

                        for (let i = 0; i < result.error.length; i++) {
                            assert.propertyVal(result.error[i], 'code', HttpStatus.BAD_REQUEST)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'id', incorrectActivitiesArr[i].id)
                            if (i !== 0) {
                                assert.propertyVal(result.error[i].item, 'start_time', incorrectActivitiesArr[i].start_time)
                            }
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'end_time', incorrectActivitiesArr[i].end_time)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'duration', incorrectActivitiesArr[i].duration)
                            if (i !== 0) {
                                assert.propertyVal(result.error[i].item, 'patient_id', incorrectActivitiesArr[i].patient_id)
                            }
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'name', incorrectActivitiesArr[i].name)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'calories', incorrectActivitiesArr[i].calories)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'steps', incorrectActivitiesArr[i].steps)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'distance', incorrectActivitiesArr[i].distance)
                            if (i !== 0) assert.propertyVal(result.error[i].item, 'levels', incorrectActivitiesArr[i].levels)
                            if (i !== 0) {
                                assert.propertyVal(result.error[i].item, 'heart_rate_zones',
                                    incorrectActivitiesArr[i].heart_rate_zones)
                            }
                        }

                        assert.isEmpty(result.success)
                    })
            })
        })
    })

    /**
     * Method getByIdAndPatient(activityId: string, patientId: string, query: IQuery)
     */
    describe('getByIdAndPatient(activityId: string, patientId: string, query: IQuery)', () => {
        context('when there is physical activity with the received parameters', () => {
            it('should return the PhysicalActivity that was found', () => {
                activity.id = '507f1f77bcf86cd799439011'            // Make mock return an activity
                const query: IQuery = new Query()
                query.filters = {
                    _id: activity.id,
                    patient_id: activity.patient_id
                }

                return activityService.getByIdAndPatient(activity.id!, activity.patient_id, query)
                    .then(result => {
                        assert(result, 'result must not be undefined')
                    })
            })
        })

        context('when there is no physical activity with the received parameters', () => {
            it('should return undefined', () => {
                activity.id = '5a62be07de34500146d9c544'            // Make mock return undefined
                const query: IQuery = new Query()
                query.filters = {
                    _id: activity.id,
                    patient_id: activity.patient_id
                }

                return activityService.getByIdAndPatient(activity.id!, activity.patient_id, query)
                    .then(result => {
                        assert.isUndefined(result)
                    })
            })
        })

        context('when the physical activity id is invalid', () => {
            it('should throw a ValidationException', async () => {
                activity.id = '5a62be07de34500146d9c5442'       // Make activity id invalid
                const query: IQuery = new Query()
                query.filters = {
                    _id: activity.id,
                    patient_id: activity.patient_id
                }

                try {
                    await activityService.getByIdAndPatient(activity.id!, activity.patient_id, query)
                } catch (err) {
                    assert.propertyVal(err, 'message', Strings.PHYSICAL_ACTIVITY.PARAM_ID_NOT_VALID_FORMAT)
                    assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                }
            })
        })

        context('when the physical activity patient_id is invalid', () => {
            it('should throw a ValidationException', async () => {
                activity.patient_id = '5a62be07de34500146d9c5442'     // Make patient_id invalid
                const query: IQuery = new Query()
                query.filters = {
                    _id: activity.id,
                    patient_id: activity.patient_id
                }

                try {
                    await activityService.getByIdAndPatient(activity.id!, activity.patient_id, query)
                } catch (err) {
                    assert.propertyVal(err, 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                    assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                }
            })
        })
    })

    /**
     * Method getAllByPatient(patientId: string, query: IQuery)
     */
    describe('getAllByPatient(patientId: string, query: IQuery)', () => {
        context('when there is at least one physical activity associated with that patientId', () => {
            it('should return a PhysicalActivity array', () => {
                activity.patient_id = '5a62be07de34500146d9c544'      // Make patient_id valid again
                const query: IQuery = new Query()
                query.filters = {
                    patient_id: activity.patient_id
                }

                return activityService.getAllByPatient(activity.patient_id, query)
                    .then(result => {
                        assert.isArray(result)
                        assert.isNotEmpty(result)
                    })
            })
        })

        context('when there is no physical activity with the received parameters', () => {
            it('should return an empty array', () => {
                activity.patient_id = '507f1f77bcf86cd799439011'        // Make mock return an empty array
                const query: IQuery = new Query()
                query.filters = {
                    patient_id: activity.patient_id
                }

                return activityService.getAllByPatient(activity.patient_id, query)
                    .then(result => {
                        assert.isArray(result)
                        assert.isEmpty(result)
                    })
            })
        })

        context('when the physical activity patient_id is invalid', () => {
            it('should throw a ValidationException', async () => {
                activity.patient_id = '5a62be07de34500146d9c5442'     // Make patient_id invalid again
                const query: IQuery = new Query()
                query.filters = {
                    _id: activity.id,
                    patient_id: activity.patient_id
                }

                try {
                    await activityService.getAllByPatient(activity.patient_id, query)
                } catch (err) {
                    assert.propertyVal(err, 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                    assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                }
            })
        })
    })

    /**
     * Method removeByPatient(activityId: string, patientId: string)
     */
    describe('removeByPatient(activityId: string, patientId: string)', () => {
        context('when there is physical activity with the received parameters', () => {
            it('should return true', () => {
                activity.id = '507f1f77bcf86cd799439011'            // Make mock return true
                activity.patient_id = '5a62be07de34500146d9c544'     // Make patient_id valid again

                return activityService.removeByPatient(activity.id!, activity.patient_id)
                    .then(result => {
                        assert.equal(result, true)
                    })
            })
        })

        context('when there is no physical activity with the received parameters', () => {
            it('should return false', () => {
                activity.id = '5a62be07de34500146d9c544'            // Make mock return false

                return activityService.removeByPatient(activity.id!, activity.patient_id)
                    .then(result => {
                        assert.equal(result, false)
                    })
            })
        })

        context('when the physical activity is incorrect (patient_id is invalid)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity.patient_id = '5a62be07de34500146d9c5442'     // Make patient_id invalid

                return activityService.removeByPatient(incorrectActivity.id!, incorrectActivity.patient_id)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the physical activity is incorrect (id is invalid)', () => {
            it('should throw a ValidationException', () => {
                incorrectActivity = new PhysicalActivityMock()
                incorrectActivity.id = '5a62be07de34500146d9c5442'       // Make activity id invalid

                return activityService.removeByPatient(incorrectActivity.id!, incorrectActivity.patient_id)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.PHYSICAL_ACTIVITY.PARAM_ID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('countActivities(patientId: string)', () => {
        context('when there is at least one physical activity associated with the patient received', () => {
            it('should return how many physical activities are associated with such patient in the database', () => {
                return activityService.countByPatient(activity.patient_id!)
                    .then(res => {
                        assert.equal(res, 1)
                    })
            })
        })
    })
})
