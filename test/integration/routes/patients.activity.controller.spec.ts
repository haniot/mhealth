import HttpStatus from 'http-status-codes'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { expect } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { PhysicalActivity } from '../../../src/application/domain/model/physical.activity'
import { ActivityRepoModel } from '../../../src/infrastructure/database/schema/activity.schema'
import { PhysicalActivityEntityMapper } from '../../../src/infrastructure/entity/mapper/physical.activity.entity.mapper'
import { ObjectID } from 'bson'
import { HeartRateZone } from '../../../src/application/domain/model/heart.rate.zone'
import { Default } from '../../../src/utils/default'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { PhysicalActivityMock } from '../../mocks/models/physical.activity.mock'
import { Levels } from '../../../src/application/domain/utils/levels'
import { HeartRateZoneData } from '../../../src/application/domain/model/heart.rate.zone.data'
import { ActivityLevel } from '../../../src/application/domain/model/activityLevel'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: patients.physicalactivities', () => {

    // Mock objects for PhysicalActivity routes
    const defaultActivity: PhysicalActivity = new PhysicalActivityMock()
    const otherActivity: PhysicalActivity = new PhysicalActivityMock()
    otherActivity.patient_id = '5a62be07de34500146d9c542'

    /**
     * Mock objects for POST route with multiple activities
     */
        // Mock through JSON
    const incorrectActivityJSON: any = {
            id: new ObjectID(),
            start_time: defaultActivity.start_time,
            end_time: defaultActivity.end_time,
            duration: defaultActivity.duration,
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
            ],
            heart_rate_average: 107,
            heart_rate_zones: {
                out_of_range: {
                    min: 30,
                    max: 91,
                    duration: 0
                },
                fat_burn: {
                    min: 91,
                    max: 127,
                    duration: 0
                },
                cardio: {
                    min: 127,
                    max: 154,
                    duration: 0
                },
                peak: {
                    min: 154,
                    max: 220,
                    duration: 0
                }
            }
        }

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
    incorrectActivity3.start_time = defaultActivity.start_time
    incorrectActivity3.end_time = '2018-12-14T13:12:37Z'

    // The duration is incompatible with the start_time and end_time parameters
    const incorrectActivity4: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity4.duration = 11780000

    const incorrectActivity5: PhysicalActivity = new PhysicalActivityMock()    // The duration is negative
    incorrectActivity5.duration = -11780000

    const incorrectActivity6: PhysicalActivity = new PhysicalActivityMock()    // The calories parameter is negative
    incorrectActivity6.calories = -200

    const incorrectActivity7: PhysicalActivity = new PhysicalActivityMock()    // The steps parameter is negative
    incorrectActivity7.steps = -1000

    let incorrectActivity8: PhysicalActivity = new PhysicalActivityMock()    // The levels array has an item with an invalid type
    incorrectActivity8 = incorrectActivity8.fromJSON(incorrectActivityJSON)
    incorrectActivity8.patient_id = incorrectActivityJSON.patient_id

    // The levels array has an item that contains empty fields
    let incorrectActivity9: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivityJSON.levels[0].name = undefined
    incorrectActivityJSON.levels[0].duration = undefined
    incorrectActivity9 = incorrectActivity9.fromJSON(incorrectActivityJSON)
    incorrectActivity9.patient_id = incorrectActivityJSON.patient_id

    // The levels array has an item that contains negative duration
    let incorrectActivity10: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivityJSON.levels[0].name = Levels.SEDENTARY
    incorrectActivityJSON.levels[0].duration = -(Math.floor((Math.random() * 10 + 1) * 60000))
    incorrectActivity10 = incorrectActivity10.fromJSON(incorrectActivityJSON)
    incorrectActivity10.patient_id = incorrectActivityJSON.patient_id

    // The PhysicalActivityHeartRate is empty
    const incorrectActivity11: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity11.heart_rate_zones = new HeartRateZone()

    // The PhysicalActivityHeartRate average is negative
    const incorrectActivity12: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity12.heart_rate_average = -120

    // The PhysicalActivityHeartRate is invalid (the "Fat Burn Zone" parameter is empty)
    const incorrectActivity13: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity13.heart_rate_zones!.fat_burn = new HeartRateZoneData()

    // The PhysicalActivityHeartRate is invalid (the "Fat Burn Zone" parameter has a negative duration)
    const incorrectActivity14: PhysicalActivity = new PhysicalActivityMock()
    incorrectActivity14.heart_rate_zones!.fat_burn!.duration = -600000

    const incorrectActivity15: PhysicalActivity = new PhysicalActivityMock()     // The start_time is invalid
    incorrectActivity15.start_time = '2019-12-32T12:52:59Z'

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

    // Start services
    before(async () => {
        try {
            await dbConnection.tryConnect(process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST)

            await deleteAllActivities()
        } catch (err) {
            throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
        }
    })

    // Delete all physical activity objects from the database
    after(async () => {
        try {
            await deleteAllActivities()
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
        }
    })
    /**
     * POST route to PhysicalActivity with only one item of this type in the body
     */
    describe('POST /v1/patients/:patient_id/physicalactivities with only one PhysicalActivity in the body', () => {
        context('when posting a new PhysicalActivity with success', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })
            it('should return status code 201 and the saved PhysicalActivity (and show an error log about unable to send ' +
                'SavePhysicalActivity event)', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: `${defaultActivity.duration}`,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: [
                        {
                            name: Levels.SEDENTARY,
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
                    ],
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.name).to.eql(defaultActivity.name)
                        expect(res.body.start_time).to.eql(defaultActivity.start_time)
                        expect(res.body.end_time).to.eql(defaultActivity.end_time)
                        expect(res.body.duration).to.eql(defaultActivity.duration)
                        expect(res.body.calories).to.eql(defaultActivity.calories)
                        if (res.body.steps) {
                            expect(res.body.steps).to.eql(defaultActivity.steps)
                        }
                        expect(res.body.distance).to.eql(defaultActivity.distance)
                        expect(res.body).to.have.property('levels')
                        expect(res.body.heart_rate_zones).to.be.undefined
                        expect(res.body.patient_id).to.eql(defaultActivity.patient_id)
                    })
            })
        })

        context('when a duplicate error occurs', () => {
            before(async () => {
                try {
                    await deleteAllActivities()

                    await createActivity({
                        name: defaultActivity.name,
                        start_time: defaultActivity.start_time,
                        end_time: defaultActivity.end_time,
                        duration: defaultActivity.duration,
                        calories: defaultActivity.calories,
                        steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                        heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined,
                        patient_id: defaultActivity.patient_id
                    })
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })
            it('should return status code 409 and an info message about duplicate items', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(err => {
                        expect(err.body.code).to.eql(409)
                        expect(err.body.message).to.eql(Strings.PHYSICAL_ACTIVITY.ALREADY_REGISTERED)
                    })
            })
        })

        context('when a validation error occurs (missing all the activity required fields)', () => {
            it('should return status code 400 and info message about the activity missing fields', () => {
                const body = {}

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(err.body.description).to.eql('start_time, end_time, duration, name, calories'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when a validation error occurs (missing all the physical activity required fields)', () => {
            it('should return status code 400 and info message about the physical activity missing fields', () => {
                const body = {
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(err.body.description).to.eql('name, calories'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when a validation error occurs (duration does not have a valid number)', () => {
            it('should return status code 400 and info message about the invalid duration', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: `${defaultActivity.duration}a`,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('duration'.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (start_time with a date newer than end_time)', () => {
            it('should return status code 400 and info message about the invalid date', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: new Date(2020),
                    end_time: new Date(2019),
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('The end_time parameter can not contain an older date ' +
                            'than that the start_time parameter!')
                    })
            })
        })

        context('when a validation error occurs (the duration is incompatible with the start_time and end_time parameters)',
            () => {
                it('should return status code 400 and info message about the invalid duration', () => {
                    const body = {
                        name: defaultActivity.name,
                        start_time: defaultActivity.start_time,
                        end_time: defaultActivity.end_time,
                        duration: Math.floor(Math.random() * 180 + 1) * 60000,
                        calories: defaultActivity.calories,
                        steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                        heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                    }

                    return request
                        .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('duration value does not match values passed in ' +
                                'start_time and end_time parameters!')
                        })
                })
            })

        context('when a validation error occurs (start_time with an invalid day)', () => {
            it('should return status code 400 and info message about the invalid date', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: '2019-12-35T12:52:59Z',
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql('Datetime: 2019-12-35T12:52:59Z'
                            .concat(Strings.ERROR_MESSAGE.INVALID_DATE))
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.INVALID_DATE_DESC)
                    })
            })
        })

        context('when a validation error occurs (the duration is negative)', () => {
            it('should return status code 400 and info message about the invalid duration', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: -(defaultActivity.duration!),
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('duration'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (patient_id is invalid)', () => {
            it('should return status code 400 and info message about the invalid patient_id', () => {
                const body = {
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: -(defaultActivity.calories!),
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/123/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when a validation error occurs (the name parameter is empty)', () => {
            it('should return status code 400 and info message about the invalid parameter of name', () => {
                const body = {
                    name: '',
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('name'.concat(Strings.ERROR_MESSAGE.EMPTY_STRING))
                    })
            })
        })

        context('when a validation error occurs (the name parameter is invalid)', () => {
            it('should return status code 400 and info message about the invalid parameter of name', () => {
                const body = {
                    name: 123,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('name'.concat(Strings.ERROR_MESSAGE.INVALID_STRING))
                    })
            })
        })

        context('when a validation error occurs (the calories parameter is invalid)', () => {
            it('should return status code 400 and info message about the invalid parameter of calories', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: `${defaultActivity.calories}a`,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('calories'.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (the calories parameter is negative)', () => {
            it('should return status code 400 and info message about the invalid parameter of calories', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: -(defaultActivity.calories!),
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('calories'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (the steps parameter is invalid)', () => {
            it('should return status code 400 and info message about the invalid parameter of steps', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: '200a',
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('steps'.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (the steps parameter is negative)', () => {
            it('should return status code 400 and info message about the invalid parameter of steps', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: -200,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('steps'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (the distance parameter is invalid)', () => {
            it('should return status code 400 and info message about the invalid parameter of distance', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: '1000a',
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('distance'.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (the distance parameter is negative)', () => {
            it('should return status code 400 and info message about the invalid parameter of distance', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: -1000,
                    levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('distance'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (the levels array has an item with an invalid type)', () => {
            it('should return status code 400 and info message about the invalid levels array', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
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
                    ],
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('The names of the allowed levels are: ' +
                            'sedentary, lightly, fairly, very.')
                    })
            })
        })

        context('when a validation error occurs (the levels array has an item with an invalid duration)', () => {
            it('should return status code 400 and info message about the invalid levels array', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: [
                        {
                            name: Levels.SEDENTARY,
                            duration: Math.floor((Math.random() * 10) * 60000)
                        },
                        {
                            name: Levels.LIGHTLY,
                            duration: `${Math.floor((Math.random() * 10) * 60000)}a`
                        },
                        {
                            name: Levels.FAIRLY,
                            duration: Math.floor((Math.random() * 10) * 60000)
                        },
                        {
                            name: Levels.VERY,
                            duration: Math.floor((Math.random() * 10) * 60000)
                        }
                    ],
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('levels.duration'.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (the levels array has an item that contains empty fields)', () => {
            it('should return status code 400 and info message about the invalid levels array', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: [
                        {
                            name: undefined,
                            duration: undefined
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
                    ],
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('The levels array must have values for the following ' +
                            'levels: sedentary, lightly, fairly, very.')
                    })
            })
        })

        context('when a validation error occurs (the levels array has an item that contains negative duration)', () => {
            it('should return status code 400 and info message about the invalid levels array', () => {
                const body = {
                    name: defaultActivity.name,
                    start_time: defaultActivity.start_time,
                    end_time: defaultActivity.end_time,
                    duration: defaultActivity.duration,
                    calories: defaultActivity.calories,
                    steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                    distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                    levels: [
                        {
                            name: Levels.SEDENTARY,
                            duration: -(Math.floor((Math.random() * 10 + 1) * 60000))
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
                    ],
                    heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined
                }

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('levels.duration'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                    })
            })
        })

        context('when a validation error occurs (the PhysicalActivityHeartRate is empty)', () => {
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity11.name,
                        start_time: incorrectActivity11.start_time,
                        end_time: incorrectActivity11.end_time,
                        duration: incorrectActivity11.duration,
                        calories: incorrectActivity11.calories,
                        steps: incorrectActivity11.steps ? incorrectActivity11.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity11.levels ? incorrectActivity11.levels : undefined,
                        heart_rate_zones: incorrectActivity11.heart_rate_zones ? incorrectActivity11.heart_rate_zones : undefined
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity11.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_zones.fat_burn, heart_rate_zones.cardio, heart_rate_zones.peak, ' +
                                'heart_rate_zones.out_of_range'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        })
                })
        })

        context('when a validation error occurs (the PhysicalActivityHeartRate has an invalid average parameter)', () => {
            before(() => {
                incorrectActivityJSON.heart_rate_average = 'abc'
            })
            after(() => {
                incorrectActivityJSON.heart_rate_average = 107
            })
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity12.name,
                        start_time: incorrectActivity12.start_time,
                        end_time: incorrectActivity12.end_time,
                        duration: incorrectActivity12.duration,
                        calories: incorrectActivity12.calories,
                        steps: incorrectActivity12.steps ? incorrectActivity12.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity12.levels ? incorrectActivity12.levels : undefined,
                        heart_rate_average: incorrectActivityJSON.heart_rate_average,
                        heart_rate_zones: incorrectActivityJSON.heart_rate_zones
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity12.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_average'.concat(Strings.ERROR_MESSAGE.INVALID_NUMBER))
                        })
                })
        })

        context('when a validation error occurs (the PhysicalActivityHeartRate has a negative average parameter)', () => {
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity12.name,
                        start_time: incorrectActivity12.start_time,
                        end_time: incorrectActivity12.end_time,
                        duration: incorrectActivity12.duration,
                        calories: incorrectActivity12.calories,
                        steps: incorrectActivity12.steps ? incorrectActivity12.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity12.levels ? incorrectActivity12.levels : undefined,
                        heart_rate_average: incorrectActivity12.heart_rate_average,
                        heart_rate_zones: incorrectActivity12.heart_rate_zones ? incorrectActivity12.heart_rate_zones : undefined
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity12.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_average'
                                .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        })
                })
        })

        context('when a validation error occurs (the "Fat Burn Zone" parameter of PhysicalActivityHeartRate is empty)', () => {
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity13.name,
                        start_time: incorrectActivity13.start_time,
                        end_time: incorrectActivity13.end_time,
                        duration: incorrectActivity13.duration,
                        calories: incorrectActivity13.calories,
                        steps: incorrectActivity13.steps ? incorrectActivity13.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity13.levels ? incorrectActivity13.levels : undefined,
                        heart_rate_zones: incorrectActivity13.heart_rate_zones ? incorrectActivity13.heart_rate_zones : undefined
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity13.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_zones.fat_burn.min, ' +
                                'heart_rate_zones.fat_burn.max, heart_rate_zones.fat_burn.duration'
                                    .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        })
                })
        })

        context('when a validation error occurs (the "Fat Burn Zone" parameter of PhysicalActivityHeartRate ' +
            'has an invalid min)', () => {
            before(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.min = 'abc'
            })
            after(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.min = 91
            })
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity14.name,
                        start_time: incorrectActivity14.start_time,
                        end_time: incorrectActivity14.end_time,
                        duration: incorrectActivity14.duration,
                        calories: incorrectActivity14.calories,
                        steps: incorrectActivity14.steps ? incorrectActivity14.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity14.levels ? incorrectActivity14.levels : undefined,
                        heart_rate_zones: incorrectActivityJSON.heart_rate_zones
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity14.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_zones.fat_burn.min' +
                                Strings.ERROR_MESSAGE.INVALID_NUMBER)
                        })
                })
        })

        context('when a validation error occurs (the "Fat Burn Zone" parameter of PhysicalActivityHeartRate ' +
            'has a negative min)', () => {
            before(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.min = -91
            })
            after(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.min = 91
            })
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity14.name,
                        start_time: incorrectActivity14.start_time,
                        end_time: incorrectActivity14.end_time,
                        duration: incorrectActivity14.duration,
                        calories: incorrectActivity14.calories,
                        steps: incorrectActivity14.steps ? incorrectActivity14.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity14.levels ? incorrectActivity14.levels : undefined,
                        heart_rate_zones: incorrectActivityJSON.heart_rate_zones
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity14.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_zones.fat_burn.min' +
                                Strings.ERROR_MESSAGE.NEGATIVE_NUMBER)
                        })
                })
        })

        context('when a validation error occurs (the "Fat Burn Zone" parameter of PhysicalActivityHeartRate ' +
            'has an invalid max)', () => {
            before(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.max = 'abc'
            })
            after(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.max = 127
            })
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity14.name,
                        start_time: incorrectActivity14.start_time,
                        end_time: incorrectActivity14.end_time,
                        duration: incorrectActivity14.duration,
                        calories: incorrectActivity14.calories,
                        steps: incorrectActivity14.steps ? incorrectActivity14.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity14.levels ? incorrectActivity14.levels : undefined,
                        heart_rate_zones: incorrectActivityJSON.heart_rate_zones
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity14.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_zones.fat_burn.max' +
                                Strings.ERROR_MESSAGE.INVALID_NUMBER)
                        })
                })
        })

        context('when a validation error occurs (the "Fat Burn Zone" parameter of PhysicalActivityHeartRate ' +
            'has a negative max)', () => {
            before(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.max = -127
            })
            after(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.max = 127
            })
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity14.name,
                        start_time: incorrectActivity14.start_time,
                        end_time: incorrectActivity14.end_time,
                        duration: incorrectActivity14.duration,
                        calories: incorrectActivity14.calories,
                        steps: incorrectActivity14.steps ? incorrectActivity14.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity14.levels ? incorrectActivity14.levels : undefined,
                        heart_rate_zones: incorrectActivityJSON.heart_rate_zones
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity14.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_zones.fat_burn.max' +
                                Strings.ERROR_MESSAGE.NEGATIVE_NUMBER)
                        })
                })
        })

        context('when a validation error occurs (the "Fat Burn Zone" parameter of PhysicalActivityHeartRate ' +
            'has an invalid duration)', () => {
            before(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.duration = 'abc'
            })
            after(() => {
                incorrectActivityJSON.heart_rate_zones.fat_burn.duration = 0
            })
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity14.name,
                        start_time: incorrectActivity14.start_time,
                        end_time: incorrectActivity14.end_time,
                        duration: incorrectActivity14.duration,
                        calories: incorrectActivity14.calories,
                        steps: incorrectActivity14.steps ? incorrectActivity14.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity14.levels ? incorrectActivity14.levels : undefined,
                        heart_rate_zones: incorrectActivityJSON.heart_rate_zones
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity14.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_zones.fat_burn.duration' +
                                Strings.ERROR_MESSAGE.INVALID_NUMBER)
                        })
                })
        })

        context('when a validation error occurs (the "Fat Burn Zone" parameter of PhysicalActivityHeartRate ' +
            'has a negative duration)', () => {
            it('should return status code 400 and info message about the invalid PhysicalActivityHeartRate parameter',
                () => {
                    const body = {
                        name: incorrectActivity14.name,
                        start_time: incorrectActivity14.start_time,
                        end_time: incorrectActivity14.end_time,
                        duration: incorrectActivity14.duration,
                        calories: incorrectActivity14.calories,
                        steps: incorrectActivity14.steps ? incorrectActivity14.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: incorrectActivity14.levels ? incorrectActivity14.levels : undefined,
                        heart_rate_zones: incorrectActivity14.heart_rate_zones ? incorrectActivity14.heart_rate_zones : undefined
                    }

                    return request
                        .post(`/v1/patients/${incorrectActivity14.patient_id}/physicalactivities`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            expect(err.body.description).to.eql('heart_rate_zones.fat_burn.duration' +
                                Strings.ERROR_MESSAGE.NEGATIVE_NUMBER)
                        })
                })
        })
    })
    /**
     * POST route to PhysicalActivity with an array of such items in the body
     */
    describe('POST /v1/patients/:patient_id/physicalactivities with an array of PhysicalActivity in the body', () => {
        context('when all the activities are correct and still do not exist in the repository', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 207, create each PhysicalActivity and return a response of type ' +
                'MultiStatus<PhysicalActivity> with the description of success in sending each one of them', () => {
                const body: any = []

                correctActivitiesArr.forEach(activity => {
                    const bodyElem = {
                        name: activity.name,
                        start_time: activity.start_time,
                        end_time: activity.end_time,
                        duration: activity.duration,
                        calories: activity.calories,
                        steps: activity.steps ? activity.steps : undefined,
                        distance: activity.distance ? activity.distance : undefined,
                        levels: activity.levels ? activity.levels : undefined,
                    }
                    body.push(bodyElem)
                })

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        for (let i = 0; i < res.body.success.length; i++) {
                            expect(res.body.success[i].code).to.eql(HttpStatus.CREATED)
                            expect(res.body.success[i].item).to.have.property('id')
                            expect(res.body.success[i].item.name).to.eql(correctActivitiesArr[i].name)
                            expect(res.body.success[i].item.start_time).to.eql(correctActivitiesArr[i].start_time)
                            expect(res.body.success[i].item.end_time).to.eql(correctActivitiesArr[i].end_time)
                            expect(res.body.success[i].item.duration).to.eql(correctActivitiesArr[i].duration)
                            expect(res.body.success[i].item.calories).to.eql(correctActivitiesArr[i].calories)
                            if (correctActivitiesArr[i].steps) {
                                expect(res.body.success[i].item.steps).to.eql(correctActivitiesArr[i].steps)
                            }
                            expect(res.body.success[i].item.distance).to.eql(correctActivitiesArr[i].distance)
                            if (correctActivitiesArr[i].levels) {
                                expect(res.body.success[i].item.levels)
                                    .to.eql(correctActivitiesArr[i].levels!.map((elem: ActivityLevel) => elem.toJSON()))
                            }
                            expect(res.body.success[i].item.patient_id).to.eql(correctActivitiesArr[i].patient_id)
                        }

                        expect(res.body.error.length).to.eql(0)
                    })
            })
        })

        context('when all the activities are correct but already exists in the repository', () => {
            before(async () => {
                try {
                    await deleteAllActivities()

                    for (const activity of correctActivitiesArr) {
                        await createActivity({
                            name: activity.name,
                            start_time: activity.start_time,
                            end_time: activity.end_time,
                            duration: activity.duration,
                            calories: activity.calories,
                            steps: activity.steps ? activity.steps : undefined,
                            distance: activity.distance ? activity.distance : undefined,
                            levels: activity.levels ? activity.levels : undefined,
                            heart_rate_zones: activity.heart_rate_zones ? activity.heart_rate_zones : undefined,
                            patient_id: activity.patient_id
                        })
                    }
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })
            it('should return status code 201 and return a response of type MultiStatus<PhysicalActivity> with the ' +
                'description of conflict in sending each one of them', () => {
                const body: any = []

                correctActivitiesArr.forEach(activity => {
                    const bodyElem = {
                        name: activity.name,
                        start_time: activity.start_time,
                        end_time: activity.end_time,
                        duration: activity.duration,
                        calories: activity.calories,
                        steps: activity.steps ? activity.steps : undefined,
                        distance: activity.distance ? activity.distance : undefined,
                        levels: activity.levels ? activity.levels : undefined,
                    }
                    body.push(bodyElem)
                })

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        for (let i = 0; i < res.body.error.length; i++) {
                            expect(res.body.error[i].code).to.eql(HttpStatus.CONFLICT)
                            expect(res.body.error[i].message).to.eql(Strings.PHYSICAL_ACTIVITY.ALREADY_REGISTERED)
                            expect(res.body.error[i].item.name).to.eql(correctActivitiesArr[i].name)
                            expect(res.body.error[i].item.start_time).to.eql(correctActivitiesArr[i].start_time)
                            expect(res.body.error[i].item.end_time).to.eql(correctActivitiesArr[i].end_time)
                            expect(res.body.error[i].item.duration).to.eql(correctActivitiesArr[i].duration)
                            expect(res.body.error[i].item.calories).to.eql(correctActivitiesArr[i].calories)
                            if (correctActivitiesArr[i].steps) {
                                expect(res.body.error[i].item.steps).to.eql(correctActivitiesArr[i].steps)
                            }
                            expect(res.body.error[i].item.distance).to.eql(correctActivitiesArr[i].distance)
                            if (correctActivitiesArr[i].levels) {
                                expect(res.body.error[i].item.levels)
                                    .to.eql(correctActivitiesArr[i].levels!.map((elem: ActivityLevel) => elem.toJSON()))
                            }
                            expect(res.body.error[i].item.patient_id).to.eql(correctActivitiesArr[i].patient_id)
                        }

                        expect(res.body.success.length).to.eql(0)
                    })
            })
        })

        context('when there are correct and incorrect activities in the body', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 201 and return a response of type MultiStatus<PhysicalActivity> with the ' +
                'description of success and error in each one of them', () => {
                const body: any = []

                mixedActivitiesArr.forEach(activity => {
                    const bodyElem = {
                        name: activity.name,
                        start_time: activity.start_time,
                        end_time: activity.end_time,
                        duration: activity.duration,
                        calories: activity.calories,
                        steps: activity.steps ? activity.steps : undefined,
                        distance: activity.distance ? activity.distance : undefined,
                        levels: activity.levels ? activity.levels : undefined,
                    }
                    body.push(bodyElem)
                })

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        // Success item
                        expect(res.body.success[0].code).to.eql(HttpStatus.CREATED)
                        expect(res.body.success[0].item).to.have.property('id')
                        expect(res.body.success[0].item.name).to.eql(mixedActivitiesArr[0].name)
                        expect(res.body.success[0].item.start_time).to.eql(mixedActivitiesArr[0].start_time)
                        expect(res.body.success[0].item.end_time).to.eql(mixedActivitiesArr[0].end_time)
                        expect(res.body.success[0].item.duration).to.eql(mixedActivitiesArr[0].duration)
                        expect(res.body.success[0].item.calories).to.eql(mixedActivitiesArr[0].calories)
                        if (mixedActivitiesArr[0].steps) {
                            expect(res.body.success[0].item.steps).to.eql(mixedActivitiesArr[0].steps)
                        }
                        expect(res.body.success[0].item.distance).to.eql(mixedActivitiesArr[0].distance)
                        if (mixedActivitiesArr[0].levels) {
                            expect(res.body.success[0].item.levels)
                                .to.eql(mixedActivitiesArr[0].levels.map((elem: ActivityLevel) => elem.toJSON()))
                        }
                        expect(res.body.success[0].item.patient_id).to.eql(mixedActivitiesArr[0].patient_id)

                        // Error item
                        expect(res.body.error[0].code).to.eql(HttpStatus.BAD_REQUEST)
                        expect(res.body.error[0].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[0].description).to.eql('start_time, end_time, duration, name, ' +
                            'calories'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when all the activities are incorrect', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 201 and return a response of type MultiStatus<PhysicalActivity> with the ' +
                'description of error in each one of them', () => {
                const body: any = []

                incorrectActivitiesArr.forEach(activity => {
                    const bodyElem = {
                        name: activity.name,
                        start_time: activity.start_time,
                        end_time: activity.end_time,
                        duration: activity.duration,
                        calories: activity.calories,
                        steps: activity.steps ? activity.steps : undefined,
                        distance: activity.distance ? activity.distance : undefined,
                        levels: activity.levels ? activity.levels : undefined,
                        heart_rate_average: activity.heart_rate_average,
                        heart_rate_zones: activity.heart_rate_zones ? activity.heart_rate_zones : undefined
                    }
                    body.push(bodyElem)
                })

                return request
                    .post(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        expect(res.body.error[0].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[0].description).to.eql('start_time, end_time, duration, name, ' +
                            'calories'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        expect(res.body.error[1].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[1].description).to.eql('name, calories'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        expect(res.body.error[2].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[2].description).to.eql('The end_time parameter can not contain an ' +
                            'older date than that the start_time parameter!')
                        expect(res.body.error[3].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[3].description).to.eql('duration value does not match values passed ' +
                            'in start_time and end_time parameters!')
                        expect(res.body.error[4].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[4].description).to.eql('duration'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        expect(res.body.error[5].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[5].description).to.eql('calories'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        expect(res.body.error[6].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[6].description).to.eql('steps'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        expect(res.body.error[7].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[7].description).to.eql('The names of the allowed levels are: ' +
                            'sedentary, lightly, fairly, very.')
                        expect(res.body.error[8].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[8].description).to.eql('The levels array must have values for ' +
                            'the following levels: sedentary, lightly, fairly, very.')
                        expect(res.body.error[9].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[9].description).to.eql('levels.duration'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        expect(res.body.error[10].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[10].description).to.eql('heart_rate_zones.fat_burn, heart_rate_zones.cardio, ' +
                            'heart_rate_zones.peak, heart_rate_zones.out_of_range'
                                .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        expect(res.body.error[11].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[11].description).to.eql('heart_rate_average'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        expect(res.body.error[12].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[12].description).to.eql('heart_rate_zones.fat_burn.min, ' +
                            'heart_rate_zones.fat_burn.max, heart_rate_zones.fat_burn.duration'
                                .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        expect(res.body.error[13].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[13].description).to.eql('heart_rate_zones.fat_burn.duration'
                            .concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                        expect(res.body.error[14].message).to.eql('Datetime: 2019-12-32T12:52:59Z'
                            .concat(Strings.ERROR_MESSAGE.INVALID_DATE))
                        expect(res.body.error[14].description).to.eql(Strings.ERROR_MESSAGE.INVALID_DATE_DESC)

                        for (let i = 0; i < res.body.error.length; i++) {
                            expect(res.body.error[i].code).to.eql(HttpStatus.BAD_REQUEST)
                            expect(res.body.error[i].item.name).to.eql(incorrectActivitiesArr[i].name)
                            if (res.body.error[i].item.start_time)
                                expect(res.body.error[i].item.start_time)
                                    .to.eql(incorrectActivitiesArr[i].start_time!)
                            if (res.body.error[i].item.end_time)
                                expect(res.body.error[i].item.end_time).to.eql(incorrectActivitiesArr[i].end_time)
                            expect(res.body.error[i].item.duration).to.eql(incorrectActivitiesArr[i].duration)
                            expect(res.body.error[i].item.calories).to.eql(incorrectActivitiesArr[i].calories)
                            if (incorrectActivitiesArr[i].steps) {
                                expect(res.body.error[i].item.steps).to.eql(incorrectActivitiesArr[i].steps)
                            }
                            expect(res.body.error[i].item.distance).to.eql(incorrectActivitiesArr[i].distance)
                            if (i !== 8 && incorrectActivitiesArr[i].levels) {
                                expect(res.body.error[i].item.levels)
                                    .to.eql(incorrectActivitiesArr[i].levels!.map((elem: ActivityLevel) => elem.toJSON()))
                            }
                            if (i !== 0 && i !== 10 && i !== 12 && incorrectActivitiesArr[i].heart_rate_zones) {
                                expect(res.body.error[i].item.heart_rate_zones)
                                    .to.eql(incorrectActivitiesArr[i].heart_rate_zones!.toJSON())
                            }
                            // The toJSON() method does not work very well to test the "heart_rate_zones.fat_burn" object
                            // in this index (because it is empty and the toJSON() result will not match with the return
                            // of the route)
                            if (i === 12) {
                                expect(res.body.error[i].item.heart_rate_average)
                                    .to.eql(incorrectActivitiesArr[i].heart_rate_average)
                                expect(res.body.error[i].item.heart_rate_zones.out_of_range)
                                    .to.eql(incorrectActivitiesArr[i].heart_rate_zones!.out_of_range!.toJSON())
                                expect(res.body.error[i].item.heart_rate_zones.fat_burn)
                                    .to.eql(incorrectActivitiesArr[i].heart_rate_zones!.fat_burn)
                                expect(res.body.error[i].item.heart_rate_zones.cardio)
                                    .to.eql(incorrectActivitiesArr[i].heart_rate_zones!.cardio!.toJSON())
                                expect(res.body.error[i].item.heart_rate_zones.peak)
                                    .to.eql(incorrectActivitiesArr[i].heart_rate_zones!.peak!.toJSON())
                            }
                            if (i !== 0 && i !== 14)
                                expect(res.body.error[i].item.patient_id).to.eql(incorrectActivitiesArr[i].patient_id)
                        }

                        expect(res.body.success.length).to.eql(0)
                    })
            })
        })
    })
    /**
     * Route GET all physical activity by patient
     */
    describe('GET /v1/patients/:patient_id/physicalactivities', () => {
        context('when get all physical activity of a specific patient of the database successfully', () => {
            before(async () => {
                try {
                    await deleteAllActivities()

                    await createActivity({
                        name: defaultActivity.name,
                        start_time: defaultActivity.start_time,
                        end_time: defaultActivity.end_time,
                        duration: defaultActivity.duration,
                        calories: defaultActivity.calories,
                        steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                        patient_id: defaultActivity.patient_id
                    })
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a list of all physical activity of that specific patient', () => {
                return request
                    .get(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.eql(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0].name).to.eql(defaultActivity.name)
                        expect(res.body[0].start_time).to.eql(defaultActivity.start_time)
                        expect(res.body[0].end_time).to.eql(defaultActivity.end_time)
                        expect(res.body[0].duration).to.eql(defaultActivity.duration)
                        expect(res.body[0].calories).to.eql(defaultActivity.calories)
                        if (defaultActivity.steps) {
                            expect(res.body[0].steps).to.eql(defaultActivity.steps)
                        }
                        expect(res.body[0].distance).to.eql(defaultActivity.distance)
                        if (defaultActivity.levels) {
                            expect(res.body[0].levels)
                                .to.eql(defaultActivity.levels.map((elem: ActivityLevel) => elem.toJSON()))
                        }
                        expect(res.body[0].patient_id).to.eql(defaultActivity.patient_id)
                    })
            })
        })

        context('when there are no physical activity associated with that specific patient in the database', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 200 and an empty list', () => {
                return request
                    .get(`/v1/patients/${defaultActivity.patient_id}/physicalactivities`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.eql(0)
                    })
            })
        })

        context('when the patient_id is invalid', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })
            it('should return status code 400 and an info message about the invalid patient_id', () => {
                return request
                    .get(`/v1/patients/123/physicalactivities`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
        /**
         * query-strings-parser library test
         */
        context('when use "query-strings-parser" library', () => {
            let result1

            before(async () => {
                try {
                    await deleteAllActivities()

                    result1 = await createActivity({
                        name: defaultActivity.name,
                        start_time: new Date(1547953200000),
                        end_time: new Date(new Date(1547953200000)
                            .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)),
                        duration: defaultActivity.duration,
                        calories: defaultActivity.calories,
                        steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                        heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined,
                        patient_id: defaultActivity.patient_id
                    })

                    await createActivity({
                        name: defaultActivity.name,
                        start_time: new Date(1516417200000),
                        end_time: new Date(new Date(1516417200000)
                            .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)),
                        duration: defaultActivity.duration,
                        calories: defaultActivity.calories,
                        steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                        heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined,
                        patient_id: new ObjectID()
                    })

                    await createActivity({
                        name: defaultActivity.name,
                        start_time: new Date(1516449600000),
                        end_time: new Date(new Date(1516449600000)
                            .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)),
                        duration: defaultActivity.duration,
                        calories: defaultActivity.calories,
                        steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                        patient_id: defaultActivity.patient_id
                    })
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })
            it('should return status code 200 and the result as needed in the query ' +
                '(all activities performed in one day)', () => {
                const url = `/v1/patients/${defaultActivity.patient_id}/physicalactivities`
                    .concat('?start_time=gte:2019-01-20T00:00:00.000Z&end_time=lt:2019-01-20T23:59:59.999Z')
                    .concat('&sort=patient_id&page=1&limit=3')

                return request
                    .get(url)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.eql(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0].name).to.eql(defaultActivity.name)
                        expect(res.body[0].start_time).to.eql(result1.start_time.toISOString())
                        expect(res.body[0].end_time).to.eql(result1.end_time.toISOString())
                        expect(res.body[0].duration).to.eql(defaultActivity.duration)
                        expect(res.body[0].calories).to.eql(defaultActivity.calories)
                        if (defaultActivity.steps) {
                            expect(res.body[0].steps).to.eql(defaultActivity.steps)
                        }
                        expect(res.body[0].distance).to.eql(defaultActivity.distance)
                        if (defaultActivity.levels) {
                            expect(res.body[0].levels)
                                .to.eql(defaultActivity.levels.map((elem: ActivityLevel) => elem.toJSON()))
                        }
                        expect(res.body[0].patient_id).to.eql(defaultActivity.patient_id)
                    })
            })

            it('should return status code 200 and an empty list (when no physical activity is found)', () => {
                const url = `/v1/patients/${defaultActivity.patient_id}/physicalactivities`
                    .concat('?start_time=gte:2017-01-20T00:00:00.000Z&end_time=lt:2017-01-20T23:59:59.999Z')
                    .concat('&sort=patient_id&page=1&limit=3')

                return request
                    .get(url)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.eql(0)
                    })
            })

            it('should return status code 400 and an error message (when patient_id is invalid)', () => {
                const url = '/v1/patients/123/physicalactivities'
                    .concat('?start_time=gte:2019-01-20T00:00:00.000Z&end_time=lt:2019-01-20T23:59:59.999Z')
                    .concat('&sort=patient_id&page=1&limit=3')

                return request
                    .get(url)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
    /**
     * Route GET a physical activity by patient
     */
    describe('GET /v1/patients/:patient_id/physicalactivities/:physicalactivity_id', () => {
        context('when get a specific physical activity of a patient of the database successfully', () => {
            let result

            before(async () => {
                try {
                    await deleteAllActivities()

                    result = await createActivity({
                        name: defaultActivity.name,
                        start_time: defaultActivity.start_time,
                        end_time: defaultActivity.end_time,
                        duration: defaultActivity.duration,
                        calories: defaultActivity.calories,
                        steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                        patient_id: defaultActivity.patient_id
                    })
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })
            it('should return status code 200 and the specific physical activity of that patient', () => {
                return request
                    .get(`/v1/patients/${result.patient_id}/physicalactivities/${result.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.name).to.eql(defaultActivity.name)
                        expect(res.body.start_time).to.eql(defaultActivity.start_time)
                        expect(res.body.end_time).to.eql(defaultActivity.end_time)
                        expect(res.body.duration).to.eql(defaultActivity.duration)
                        expect(res.body.calories).to.eql(defaultActivity.calories)
                        if (defaultActivity.steps) {
                            expect(res.body.steps).to.eql(defaultActivity.steps)
                        }
                        expect(res.body.distance).to.eql(defaultActivity.distance)
                        if (defaultActivity.levels) {
                            expect(res.body.levels)
                                .to.eql(defaultActivity.levels.map((elem: ActivityLevel) => elem.toJSON()))
                        }
                        expect(res.body.patient_id).to.eql(defaultActivity.patient_id)
                    })
            })
        })

        context('when there is no that specific physical activity associated with that patient in the database', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 404 and an info message describing that physical activity was not found', () => {
                return request
                    .get(`/v1/patients/${defaultActivity.patient_id}/physicalactivities/${defaultActivity.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(err => {
                        expect(err.body.code).to.eql(404)
                        expect(err.body.message).to.eql('Physical Activity not found!')
                        expect(err.body.description).to.eql('Physical Activity not found or already removed. A new ' +
                            'operation for the same resource is not required.')
                    })
            })
        })

        context('when the patient_id is invalid', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 400 and an info message about the invalid patient_id', () => {
                return request
                    .get(`/v1/patients/123/physicalactivities/${defaultActivity.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the physical activity id is invalid', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 400 and an info message about the invalid physical activity id', () => {
                return request
                    .get(`/v1/patients/${defaultActivity.patient_id}/physicalactivities/123`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PHYSICAL_ACTIVITY.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
    /**
     * DELETE route for PhysicalActivity
     */
    describe('DELETE /v1/patients/:patient_id/physicalactivities/:physicalactivity_id', () => {
        context('when the physical activity was deleted successfully', () => {
            let result

            before(async () => {
                try {
                    await deleteAllActivities()

                    result = await createActivity({
                        name: defaultActivity.name,
                        start_time: defaultActivity.start_time,
                        end_time: defaultActivity.end_time,
                        duration: defaultActivity.duration,
                        calories: defaultActivity.calories,
                        steps: defaultActivity.steps ? defaultActivity.steps : undefined,
                        distance: defaultActivity.distance ? defaultActivity.distance : undefined,
                        levels: defaultActivity.levels ? defaultActivity.levels : undefined,
                        heart_rate_zones: defaultActivity.heart_rate_zones ? defaultActivity.heart_rate_zones : undefined,
                        patient_id: defaultActivity.patient_id
                    })
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 204 and no content for physical activity (and show an error log about unable to send ' +
                'DeletePhysicalActivity event)', () => {
                return request
                    .delete(`/v1/patients/${result.patient_id}/physicalactivities/${result.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the physical activity is not found', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 204 and no content for physical activity', () => {
                return request
                    .delete(`/v1/patients/${defaultActivity.patient_id}/physicalactivities/${defaultActivity.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the patient_id is invalid', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })

            it('should return status code 400 and an info message about the invalid patient_id', () => {
                return request
                    .delete(`/v1/patients/123/physicalactivities/${defaultActivity.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the physical activity id is invalid', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on patients.physicalactivities routes test: ' + err.message)
                }
            })
            it('should return status code 400 and an info message about the invalid physical activity id', () => {
                return request
                    .delete(`/v1/patients/${defaultActivity.patient_id}/physicalactivities/123`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PHYSICAL_ACTIVITY.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
})

async function createActivity(item): Promise<any> {
    const activityMapper: PhysicalActivityEntityMapper = new PhysicalActivityEntityMapper()
    const resultModel = activityMapper.transform(item)
    const resultModelEntity = activityMapper.transform(resultModel)
    return await Promise.resolve(ActivityRepoModel.create(resultModelEntity))
}

async function deleteAllActivities() {
    return ActivityRepoModel.deleteMany({})
}
