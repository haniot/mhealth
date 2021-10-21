import HttpStatus from 'http-status-codes'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { expect } from 'chai'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { Strings } from '../../../src/utils/strings'
import { SleepPattern } from '../../../src/application/domain/model/sleep.pattern'
import { SleepRepoModel } from '../../../src/infrastructure/database/schema/sleep.schema'
import { SleepEntityMapper } from '../../../src/infrastructure/entity/mapper/sleep.entity.mapper'
import { ObjectID } from 'bson'
import { SleepPatternDataSet } from '../../../src/application/domain/model/sleep.pattern.data.set'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { SleepType } from '../../../src/application/domain/utils/sleep.type'
import { Config } from '../../../src/utils/config'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: patients.sleep', () => {
    const defaultSleep: Sleep = new SleepMock()
    const otherSleep: Sleep = new SleepMock()
    otherSleep.patient_id = '5a62be07de34500146d9c542'

    /**
     * Mock objects for POST route with multiple sleep objects
     */
        // Array with correct sleep objects
    const correctSleepArr: Array<Sleep> = new Array<SleepMock>()
    for (let i = 0; i < 3; i++) {
        correctSleepArr.push(new SleepMock())
    }

    // Incorrect sleep objects
    const incorrectSleepJSON: any = {
        id: new ObjectID(),
        start_time: defaultSleep.start_time,
        end_time: defaultSleep.end_time,
        duration: defaultSleep.duration,
        pattern: undefined,
        type: undefined,
        patient_id: defaultSleep.patient_id
    }

    // Incorrect sleep objects
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

    incorrectSleepJSON.type = 'classics'              // Sleep type is invalid
    const incorrectSleep6: Sleep = new Sleep().fromJSON(incorrectSleepJSON)
    incorrectSleep6.patient_id = incorrectSleepJSON.patient_id

    const incorrectSleep7: Sleep = new SleepMock()    // Missing data_set of pattern
    incorrectSleep7.pattern = new SleepPattern()

    const incorrectSleep8: Sleep = new SleepMock()    // The pattern has an empty data_set array
    incorrectSleep8.pattern!.data_set = new Array<SleepPatternDataSet>()

    const incorrectSleep9: Sleep = new SleepMock()    // Missing fields of some item from the data_set array of pattern
    const dataSetItemSleep9: SleepPatternDataSet = new SleepPatternDataSet()
    incorrectSleep9.pattern!.data_set = [dataSetItemSleep9]

    // There is a negative duration on some item from the data_set array of pattern
    const incorrectSleep10: Sleep = new SleepMock()
    const dataSetItemSleep10: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemSleep10.start_time = defaultSleep.start_time!
    dataSetItemSleep10.name = incorrectSleep10.pattern!.data_set[0].name
    dataSetItemSleep10.duration = -(Math.floor(Math.random() * 5 + 1) * 60000)
    incorrectSleep10.pattern!.data_set = [dataSetItemSleep10]

    // The sleep pattern data set array has an invalid item with an invalid name
    const incorrectSleep11: Sleep = new SleepMock()
    const wrongDataSetItemJSON: any = {
        start_time: '2018-08-18T01:30:30Z',
        name: 'restlesss',
        duration: Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min
    }
    incorrectSleep11.pattern!.data_set = [new SleepPatternDataSet().fromJSON(wrongDataSetItemJSON)]

    // The sleep pattern data set array has an invalid item with an invalid name and the sleep type is "stages"
    const sleepJSON: any = {
        id: new ObjectID(),
        start_time: defaultSleep.start_time,
        end_time: defaultSleep.end_time,
        duration: defaultSleep.duration,
        pattern: new SleepPattern(),
        type: SleepType.STAGES,
        patient_id: defaultSleep.patient_id
    }
    const incorrectSleep12: Sleep = new Sleep().fromJSON(sleepJSON)
    incorrectSleep12.patient_id = sleepJSON.patient_id
    const wrongDataSetItem12JSON: any = {
        start_time: new Date('2018-08-18T01:30:30Z'),
        name: 'deeps',
        duration: Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min
    }
    incorrectSleep12.pattern!.data_set = new Array<SleepPatternDataSet>()
    incorrectSleep12.pattern!.data_set[0] = new SleepPatternDataSet().fromJSON(wrongDataSetItem12JSON)

    const incorrectSleep13: Sleep = new SleepMock()         // The end_time is invalid
    incorrectSleep13.end_time = '2019-12-35T12:52:59Z'

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

    // Start services
    before(async () => {
        try {
            const mongoConfigs = Config.getMongoConfig()
            await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

            await deleteAllSleep()
        } catch (err: any) {
            throw new Error('Failure on patients.sleep routes test: ' + err.message)
        }
    })

    // Delete all database sleep objects
    after(async () => {
        try {
            await deleteAllSleep()
            await dbConnection.dispose()
        } catch (err: any) {
            throw new Error('Failure on patients.sleep routes test: ' + err.message)
        }
    })
    /**
     * POST route with only one Sleep in the body
     */
    describe('POST /v1/patients/:patient_id/sleep with only one Sleep in the body', () => {
        context('when posting a new Sleep with success', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })
            it('should return status code 201 and the saved Sleep (and show an error log about unable to send ' +
                'SaveSleep event)', () => {
                const body = {
                    start_time: defaultSleep.start_time,
                    end_time: defaultSleep.end_time,
                    duration: defaultSleep.duration,
                    pattern: defaultSleep.pattern,
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.start_time).to.eql(defaultSleep.start_time)
                        expect(res.body.end_time).to.eql(defaultSleep.end_time)
                        expect(res.body.duration).to.eql(defaultSleep.duration)
                        let index = 0
                        for (const elem of defaultSleep.pattern!.data_set) {
                            expect(res.body.pattern.data_set[index].start_time).to.eql(elem.start_time)
                            expect(res.body.pattern.data_set[index].name).to.eql(elem.name)
                            expect(res.body.pattern.data_set[index].duration).to.eql(elem.duration)
                            index++
                        }
                        if (defaultSleep.type === SleepType.CLASSIC) {
                            expect(res.body.pattern.summary).to.have.property('awake')
                            expect(res.body.pattern.summary).to.have.property('asleep')
                            expect(res.body.pattern.summary).to.have.property('restless')
                        } else {
                            expect(res.body.pattern.summary).to.have.property('deep')
                            expect(res.body.pattern.summary).to.have.property('light')
                            expect(res.body.pattern.summary).to.have.property('rem')
                            expect(res.body.pattern.summary).to.have.property('awake')
                        }
                        expect(res.body.type).to.eql(defaultSleep.type)
                        expect(res.body.patient_id).to.eql(defaultSleep.patient_id)
                    })
            })
        })

        context('when a duplicate error occurs', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    await createSleep({
                        start_time: defaultSleep.start_time,
                        end_time: defaultSleep.end_time,
                        duration: defaultSleep.duration,
                        pattern: defaultSleep.pattern!.data_set,
                        type: defaultSleep.type,
                        patient_id: defaultSleep.patient_id
                    })
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })
            it('should return status code 409 and an info message about duplicate items', () => {
                const body = {
                    start_time: defaultSleep.start_time,
                    end_time: defaultSleep.end_time,
                    duration: defaultSleep.duration,
                    pattern: defaultSleep.pattern,
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(err => {
                        expect(err.body.code).to.eql(409)
                        expect(err.body.message).to.eql(Strings.SLEEP.ALREADY_REGISTERED)
                    })
            })
        })

        context('when a validation error occurs (missing all required fields)', () => {
            it('should return status code 400 and info message about the missing fields', () => {
                const body = {}

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(err.body.description).to.eql('start_time, end_time, duration, type, pattern'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when a validation error occurs (missing required field of sleep)', () => {
            it('should return status code 400 and info message about the missing fields', () => {
                const body = {
                    start_time: defaultSleep.start_time,
                    end_time: defaultSleep.end_time,
                    duration: defaultSleep.duration
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(err.body.description).to.eql('type, pattern'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when a validation error occurs (start_time with a date newer than end_time)', () => {
            it('should return status code 400 and info message about the invalid date', () => {
                const body = {
                    start_time: new Date(2020),
                    end_time: new Date(2019),
                    duration: defaultSleep.duration,
                    pattern: defaultSleep.pattern,
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
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
                        start_time: defaultSleep.start_time,
                        end_time: defaultSleep.end_time,
                        duration: Math.floor(Math.random() * 180 + 1) * 60000,
                        pattern: defaultSleep.pattern,
                        type: defaultSleep.type
                    }

                    return request
                        .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
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
                    start_time: '2018-08-35T01:40:30Z',
                    end_time: defaultSleep.end_time,
                    duration: defaultSleep.duration,
                    pattern: defaultSleep.pattern,
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                            .replace('{0}', '2018-08-35T01:40:30Z'))
                    })
            })
        })

        context('when a validation error occurs (the duration is negative)', () => {
            it('should return status code 400 and info message about the invalid duration', () => {
                const body = {
                    start_time: defaultSleep.start_time,
                    end_time: defaultSleep.end_time,
                    duration: -(defaultSleep.duration!),
                    pattern: defaultSleep.pattern,
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELD
                            .replace('{0}', 'duration'))
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                    })
            })
        })

        context('when a validation error occurs (patient_id is invalid)', () => {
            it('should return status code 400 and info message about the invalid patient_id', () => {
                const body = {
                    start_time: defaultSleep.start_time,
                    end_time: defaultSleep.end_time,
                    duration: defaultSleep.duration,
                    pattern: defaultSleep.pattern,
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/123/sleep`)
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

        context('when a validation error occurs (sleep type is invalid)', () => {
            it('should return status code 400 and info message about the invalid patient_id', () => {
                const body = {
                    start_time: incorrectSleep6.start_time,
                    end_time: incorrectSleep6.end_time,
                    duration: incorrectSleep6.duration,
                    pattern: incorrectSleep6.pattern,
                    type: incorrectSleep6.type
                }

                return request
                    .post(`/v1/patients/${incorrectSleep6.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('The names of the allowed Sleep Pattern types are: classic, stages.')
                    })
            })
        })

        context('when a validation error occurs (missing data_set of pattern)', () => {
            it('should return status code 400 and info message about the invalid pattern', () => {
                const body = {
                    start_time: defaultSleep.start_time,
                    end_time: defaultSleep.end_time,
                    duration: defaultSleep.duration,
                    pattern: new SleepPattern(),
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(err.body.description).to.eql('pattern.data_set is required!')
                    })
            })
        })

        context('when a validation error occurs (the pattern has an empty data_set array)', () => {
            it('should return status code 400 and info message about the invalid data_set array of pattern', () => {
                const body = {
                    start_time: defaultSleep.start_time,
                    end_time: defaultSleep.end_time,
                    duration: defaultSleep.duration,
                    pattern: {
                        data_set: []
                    },
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('pattern.data_set must not be empty!')
                    })
            })
        })

        context('when a validation error occurs (missing fields of some item from the data_set array of pattern)', () => {
            it('should return status code 400 and info message about the invalid data_set array of pattern', () => {
                const body = {
                    start_time: defaultSleep.start_time,
                    end_time: defaultSleep.end_time,
                    duration: defaultSleep.duration,
                    pattern: {
                        data_set: [
                            {}
                        ]
                    },
                    type: defaultSleep.type
                }

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(err.body.description).to.eql('pattern.data_set.start_time, pattern.data_set.name, ' +
                            'pattern.data_set.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when a validation error occurs (The sleep pattern data set array has an invalid item with an invalid duration)',
            () => {
                it('should return status code 400 and info message about the invalid data_set array of pattern', () => {
                    const body = {
                        start_time: defaultSleep.start_time,
                        end_time: defaultSleep.end_time,
                        duration: defaultSleep.duration,
                        pattern: {
                            data_set: [
                                {
                                    start_time: '2018-08-18T01:40:30.00Z',
                                    name: defaultSleep.pattern!.data_set[0].name,
                                    duration: `${Math.floor(Math.random() * 5 + 1) * 60000}a`
                                }
                            ]
                        },
                        type: defaultSleep.type
                    }

                    return request
                        .post(`/v1/patients/${incorrectSleep12.patient_id}/sleep`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELD
                                .replace('{0}', 'pattern.data_set.duration'))
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                        })
                })
            })

        context('when a validation error occurs (there is a negative duration on some item from the data_set array of pattern)',
            () => {
                it('should return status code 400 and info message about the invalid data_set array of pattern', () => {
                    const body = {
                        start_time: defaultSleep.start_time,
                        end_time: defaultSleep.end_time,
                        duration: defaultSleep.duration,
                        pattern: {
                            data_set: [
                                {
                                    start_time: '2018-08-18T01:40:30.00Z',
                                    name: defaultSleep.pattern!.data_set[0].name,
                                    duration: -(Math.floor(Math.random() * 5 + 1) * 60000)
                                }
                            ]
                        },
                        type: defaultSleep.type
                    }

                    return request
                        .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELD
                                .replace('{0}', 'pattern.data_set.duration'))
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                        })
                })
            })

        context('when a validation error occurs (The sleep pattern data set array has an invalid item with an invalid name)',
            () => {
                it('should return status code 400 and info message about the invalid data_set array of pattern', () => {
                    const body = {
                        start_time: incorrectSleep11.start_time,
                        end_time: incorrectSleep11.end_time,
                        duration: incorrectSleep11.duration,
                        pattern: incorrectSleep11.pattern,
                        type: incorrectSleep11.type
                    }

                    return request
                        .post(`/v1/patients/${incorrectSleep11.patient_id}/sleep`)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                            if (incorrectSleep11.type === SleepType.CLASSIC)
                                expect(err.body.description).to.eql('The names of the allowed data_set patterns are: ' +
                                    'awake, asleep, restless.')
                            else expect(err.body.description).to.eql('The names of the allowed data_set patterns are: ' +
                                'deep, light, rem, awake.')
                        })
                })
            })

        context('when a validation error occurs (The sleep pattern data set array has an invalid item with an invalid name ' +
            'and the sleep type is "stages")', () => {
            it('should return status code 400 and info message about the invalid data_set array of pattern', () => {
                const body = {
                    start_time: incorrectSleep12.start_time,
                    end_time: incorrectSleep12.end_time,
                    duration: incorrectSleep12.duration,
                    pattern: incorrectSleep12.pattern,
                    type: incorrectSleep12.type
                }

                return request
                    .post(`/v1/patients/${incorrectSleep12.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(err.body.description).to.eql('The names of the allowed data_set patterns are: ' +
                            'deep, light, rem, awake.')
                    })
            })
        })
    })
    /**
     * POST route with a Sleep array in the body
     */
    describe('POST /v1/patients/:patient_id/sleep with a Sleep array in the body', () => {
        context('when all the sleep objects are correct and still do not exist in the repository', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 207, create each Sleep and return a response of type MultiStatus<Sleep> ' +
                'with the description of success in sending each one of them', () => {
                const body: any = []

                correctSleepArr.forEach(sleep => {
                    const bodyElem = {
                        start_time: sleep.start_time,
                        end_time: sleep.end_time,
                        duration: sleep.duration,
                        pattern: sleep.pattern,
                        type: sleep.type
                    }
                    body.push(bodyElem)
                })

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        for (let i = 0; i < res.body.success.length; i++) {
                            expect(res.body.success[i].code).to.eql(HttpStatus.CREATED)
                            expect(res.body.success[i].item).to.have.property('id')
                            expect(res.body.success[i].item.start_time).to.eql(correctSleepArr[i].start_time)
                            expect(res.body.success[i].item.end_time).to.eql(correctSleepArr[i].end_time)
                            expect(res.body.success[i].item.duration).to.eql(correctSleepArr[i].duration)
                            let index = 0
                            for (const elem of correctSleepArr[i].pattern!.data_set) {
                                expect(res.body.success[i].item.pattern.data_set[index].start_time).to.eql(elem.start_time)
                                expect(res.body.success[i].item.pattern.data_set[index].name).to.eql(elem.name)
                                expect(res.body.success[i].item.pattern.data_set[index].duration).to.eql(elem.duration)
                                index++
                            }
                            if (correctSleepArr[i].type === SleepType.CLASSIC) {
                                expect(res.body.success[i].item.pattern.summary).to.have.property('awake')
                                expect(res.body.success[i].item.pattern.summary).to.have.property('asleep')
                                expect(res.body.success[i].item.pattern.summary).to.have.property('restless')
                            } else {
                                expect(res.body.success[i].item.pattern.summary).to.have.property('deep')
                                expect(res.body.success[i].item.pattern.summary).to.have.property('light')
                                expect(res.body.success[i].item.pattern.summary).to.have.property('rem')
                                expect(res.body.success[i].item.pattern.summary).to.have.property('awake')
                            }
                            expect(res.body.success[i].item.type).to.eql(correctSleepArr[i].type)
                            expect(res.body.success[i].item.patient_id).to.eql(correctSleepArr[i].patient_id)
                        }

                        expect(res.body.error.length).to.eql(0)
                    })
            })
        })

        context('when all the sleep objects are correct but already exists in the repository', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    for (const sleep of correctSleepArr) {
                        await createSleep({
                            start_time: sleep.start_time,
                            end_time: sleep.end_time,
                            duration: sleep.duration,
                            pattern: sleep.pattern!.data_set,
                            type: sleep.type,
                            patient_id: sleep.patient_id
                        })
                    }
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })
            it('should return status code 201 and return a response of type MultiStatus<Sleep> with the ' +
                'description of conflict in sending each one of them', () => {
                const body: any = []

                correctSleepArr.forEach(sleep => {
                    const bodyElem = {
                        start_time: sleep.start_time,
                        end_time: sleep.end_time,
                        duration: sleep.duration,
                        pattern: sleep.pattern,
                        type: sleep.type
                    }
                    body.push(bodyElem)
                })

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        for (let i = 0; i < res.body.error.length; i++) {
                            expect(res.body.error[i].code).to.eql(HttpStatus.CONFLICT)
                            expect(res.body.error[i].message).to.eql(Strings.SLEEP.ALREADY_REGISTERED)
                            expect(res.body.error[i].item.start_time).to.eql(correctSleepArr[i].start_time)
                            expect(res.body.error[i].item.end_time).to.eql(correctSleepArr[i].end_time)
                            expect(res.body.error[i].item.duration).to.eql(correctSleepArr[i].duration)
                            let index = 0
                            for (const elem of correctSleepArr[i].pattern!.data_set) {
                                expect(res.body.error[i].item.pattern.data_set[index].start_time).to.eql(elem.start_time)
                                expect(res.body.error[i].item.pattern.data_set[index].name).to.eql(elem.name)
                                expect(res.body.error[i].item.pattern.data_set[index].duration).to.eql(elem.duration)
                                index++
                            }
                            expect(res.body.error[i].item.type).to.eql(correctSleepArr[i].type)
                            expect(res.body.error[i].item.patient_id).to.eql(correctSleepArr[i].patient_id)
                        }

                        expect(res.body.success.length).to.eql(0)
                    })
            })
        })

        context('when there are correct and incorrect sleep objects in the body', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 201 and return a response of type MultiStatus<Sleep> with the ' +
                'description of success and error in each one of them', () => {
                const body: any = []

                mixedSleepArr.forEach(sleep => {
                    const bodyElem = {
                        start_time: sleep.start_time,
                        end_time: sleep.end_time,
                        duration: sleep.duration,
                        pattern: sleep.pattern,
                        type: sleep.type
                    }
                    body.push(bodyElem)
                })

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        // Success item
                        expect(res.body.success[0].code).to.eql(HttpStatus.CREATED)
                        expect(res.body.success[0].item).to.have.property('id')
                        expect(res.body.success[0].item.start_time).to.eql(mixedSleepArr[0].start_time)
                        expect(res.body.success[0].item.end_time).to.eql(mixedSleepArr[0].end_time)
                        expect(res.body.success[0].item.duration).to.eql(mixedSleepArr[0].duration)
                        let index = 0
                        for (const elem of mixedSleepArr[0].pattern!.data_set) {
                            expect(res.body.success[0].item.pattern.data_set[index].start_time).to.eql(elem.start_time)
                            expect(res.body.success[0].item.pattern.data_set[index].name).to.eql(elem.name)
                            expect(res.body.success[0].item.pattern.data_set[index].duration).to.eql(elem.duration)
                            index++
                        }
                        if (mixedSleepArr[0].type === SleepType.CLASSIC) {
                            expect(res.body.success[0].item.pattern.summary).to.have.property('awake')
                            expect(res.body.success[0].item.pattern.summary).to.have.property('asleep')
                            expect(res.body.success[0].item.pattern.summary).to.have.property('restless')
                        } else {
                            expect(res.body.success[0].item.pattern.summary).to.have.property('deep')
                            expect(res.body.success[0].item.pattern.summary).to.have.property('light')
                            expect(res.body.success[0].item.pattern.summary).to.have.property('rem')
                            expect(res.body.success[0].item.pattern.summary).to.have.property('awake')
                        }
                        expect(res.body.success[0].item.type).to.eql(mixedSleepArr[0].type)
                        expect(res.body.success[0].item.patient_id).to.eql(mixedSleepArr[0].patient_id)

                        // Error item
                        expect(res.body.error[0].code).to.eql(HttpStatus.BAD_REQUEST)
                        expect(res.body.error[0].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[0].description).to.eql('start_time, end_time, duration, type, ' +
                            'pattern'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                    })
            })
        })

        context('when all the sleep objects are incorrect', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 201 and return a response of type MultiStatus<Sleep> with the ' +
                'description of error in each one of them', () => {
                const body: any = []

                incorrectSleepArr.forEach(sleep => {
                    const bodyElem = {
                        start_time: sleep.start_time,
                        end_time: sleep.end_time,
                        duration: sleep.duration,
                        pattern: sleep.pattern,
                        type: sleep.type
                    }
                    body.push(bodyElem)
                })

                return request
                    .post(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(207)
                    .then(res => {
                        expect(res.body.error[0].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[0].description).to.eql('start_time, end_time, duration, type, pattern'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        expect(res.body.error[1].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[1].description).to.eql('type, pattern'
                            .concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        expect(res.body.error[2].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[2].description).to.eql('The end_time parameter can not contain ' +
                            'an older date than that the start_time parameter!')
                        expect(res.body.error[3].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[3].description).to.eql('duration value does not match values ' +
                            'passed in start_time and end_time parameters!')
                        expect(res.body.error[4].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELD
                            .replace('{0}', 'duration'))
                        expect(res.body.error[4].description).to.eql(Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                        expect(res.body.error[5].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[5].description).to.eql('The names of the allowed Sleep Pattern types are: ' +
                            'classic, stages.')
                        expect(res.body.error[6].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[6].description).to.eql('pattern.data_set is required!')
                        expect(res.body.error[7].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[7].description).to.eql('pattern.data_set must not be empty!')
                        expect(res.body.error[8].message).to.eql(Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                        expect(res.body.error[8].description).to.eql('pattern.data_set.start_time, pattern.data_set.name, ' +
                            'pattern.data_set.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                        expect(res.body.error[9].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELD
                            .replace('{0}', 'pattern.data_set.duration'))
                        expect(res.body.error[9].description).to.eql(Strings.ERROR_MESSAGE.POSITIVE_INTEGER)
                        expect(res.body.error[10].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        if (incorrectSleep11.type === SleepType.CLASSIC)
                            expect(res.body.error[10].description).to.eql('The names of the allowed data_set patterns are: ' +
                                'awake, asleep, restless.')
                        else
                            expect(res.body.error[10].description).to.eql('The names of the allowed data_set patterns are: ' +
                                'deep, light, rem, awake.')
                        expect(res.body.error[11].message).to.eql(Strings.ERROR_MESSAGE.INVALID_FIELDS)
                        expect(res.body.error[11].description).to.eql('The names of the allowed data_set patterns are: ' +
                            'deep, light, rem, awake.')
                        expect(res.body.error[12].message).to.eql(Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
                            .replace('{0}', '2019-12-35T12:52:59Z'))

                        for (let i = 0; i < res.body.error.length; i++) {
                            expect(res.body.error[i].code).to.eql(HttpStatus.BAD_REQUEST)
                            if (res.body.error[i].item.start_time)
                                expect(res.body.error[i].item.start_time).to.eql(incorrectSleepArr[i].start_time)
                            if (res.body.error[i].item.end_time)
                                expect(res.body.error[i].item.end_time).to.eql(incorrectSleepArr[i].end_time)
                            expect(res.body.error[i].item.duration).to.eql(incorrectSleepArr[i].duration)
                            if (i !== 0 && i !== 1 && i !== 5 && i !== 6 && i !== 8) {
                                let index = 0
                                for (const elem of incorrectSleepArr[i].pattern!.data_set) {
                                    expect(new Date(res.body.error[i].item.pattern.data_set[index].start_time).toISOString())
                                        .to.eql(new Date(elem.start_time).toISOString())
                                    expect(res.body.error[i].item.pattern.data_set[index].name).to.eql(elem.name)
                                    expect(res.body.error[i].item.pattern.data_set[index].duration).to.eql(elem.duration)
                                    index++
                                }
                            }
                            if (res.body.error[i].item.type)
                                expect(res.body.error[i].item.type).to.eql(incorrectSleepArr[i].type)
                            if (i !== 0 && i !== 12)
                                expect(res.body.error[i].item.patient_id).to.eql(incorrectSleepArr[i].patient_id)
                        }

                        expect(res.body.success.length).to.eql(0)
                    })
            })
        })
    })
    /**
     * Route GET all sleep by patient
     */
    describe('GET /v1/patients/:patient_id/sleep', () => {
        context('when get all sleep of a specific patient of the database successfully', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    await createSleep({
                        start_time: defaultSleep.start_time,
                        end_time: defaultSleep.end_time,
                        duration: defaultSleep.duration,
                        pattern: defaultSleep.pattern!.data_set,
                        type: defaultSleep.type,
                        patient_id: defaultSleep.patient_id
                    })
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 200 and a list of all sleep of that specific patient', () => {
                return request
                    .get(`/v1/patients/${defaultSleep.patient_id}/sleep`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.eql(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0].start_time).to.eql(defaultSleep.start_time)
                        expect(res.body[0].end_time).to.eql(defaultSleep.end_time)
                        expect(res.body[0].duration).to.eql(defaultSleep.duration)
                        let index = 0
                        for (const elem of defaultSleep.pattern!.data_set) {
                            expect(res.body[0].pattern.data_set[index].start_time).to.eql(elem.start_time)
                            expect(res.body[0].pattern.data_set[index].name).to.eql(elem.name)
                            expect(res.body[0].pattern.data_set[index].duration).to.eql(elem.duration)
                            index++
                        }
                        expect(res.body[0].type).to.eql(defaultSleep.type)
                        expect(res.body[0].patient_id).to.eql(defaultSleep.patient_id)
                    })
            })
        })

        context('when there are no sleep associated with that specific patient in the database', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 200 and an empty list', () => {
                return request
                    .get(`/v1/patients/${defaultSleep.patient_id}/sleep`)
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
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 400 and an info message about the invalid patient_id', () => {
                return request
                    .get(`/v1/patients/123/sleep`)
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
            let result3

            before(async () => {
                try {
                    await deleteAllSleep()

                    await createSleep({
                        start_time: new Date(1516417200000),
                        end_time: new Date(new Date(1516417200000)
                            .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)),
                        duration: defaultSleep.duration,
                        pattern: defaultSleep.pattern!.data_set,
                        type: defaultSleep.type,
                        patient_id: defaultSleep.patient_id
                    })

                    await createSleep({
                        start_time: new Date(1516449600000),
                        end_time: new Date(new Date(1516449600000)
                            .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)),
                        duration: defaultSleep.duration,
                        pattern: defaultSleep.pattern!.data_set,
                        type: defaultSleep.type,
                        patient_id: defaultSleep.patient_id
                    })

                    result3 = await createSleep({
                        start_time: new Date(1547953200000),
                        end_time: new Date(new Date(1547953200000)
                            .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)),
                        duration: defaultSleep.duration,
                        pattern: defaultSleep.pattern!.data_set,
                        type: defaultSleep.type,
                        patient_id: defaultSleep.patient_id
                    })
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 200 and the result as needed in the query ' +
                '(all sleep records in one day)', () => {
                const url = `/v1/patients/${defaultSleep.patient_id}/sleep`
                    .concat('?start_time=gte:2019-01-20T00:00:00.000Z&end_time=lt:2019-01-20T23:59:59.999Z')
                    .concat('&sort=patient_id&page=1&limit=3')

                return request
                    .get(url)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.eql(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0].start_time).to.eql(result3.start_time!.toISOString())
                        expect(res.body[0].end_time).to.eql(result3.end_time!.toISOString())
                        expect(res.body[0].duration).to.eql(defaultSleep.duration)
                        let index = 0
                        for (const elem of defaultSleep.pattern!.data_set) {
                            expect(res.body[0].pattern.data_set[index].start_time).to.eql(elem.start_time)
                            expect(res.body[0].pattern.data_set[index].name).to.eql(elem.name)
                            expect(res.body[0].pattern.data_set[index].duration).to.eql(elem.duration)
                            index++
                        }
                        expect(res.body[0].type).to.eql(defaultSleep.type)
                        expect(res.body[0].patient_id).to.eql(defaultSleep.patient_id)
                    })
            })

            it('should return status code 200 and an empty list (when no sleep record is found)', () => {
                const url = `/v1/patients/${defaultSleep.patient_id}/sleep`
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
                const url = '/v1/patients/123/sleep'
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
     * Route GET a sleep by patient
     */
    describe('GET /v1/patients/:patient_id/sleep/:sleep_id', () => {
        context('when get a specific sleep of a patient of the database successfully', () => {
            let result

            before(async () => {
                try {
                    await deleteAllSleep()

                    result = await createSleep({
                        start_time: defaultSleep.start_time,
                        end_time: defaultSleep.end_time,
                        duration: defaultSleep.duration,
                        pattern: defaultSleep.pattern!.data_set,
                        type: defaultSleep.type,
                        patient_id: defaultSleep.patient_id
                    })
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })
            it('should return status code 200 and that specific sleep of that patient', () => {
                return request
                    .get(`/v1/patients/${result.patient_id}/sleep/${result.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.start_time).to.eql(result.start_time!.toISOString())
                        expect(res.body.end_time).to.eql(result.end_time!.toISOString())
                        expect(res.body.duration).to.eql(result.duration)
                        let index = 0
                        for (const elem of defaultSleep.pattern!.data_set) {
                            expect(res.body.pattern.data_set[index].start_time).to.eql(elem.start_time)
                            expect(res.body.pattern.data_set[index].name).to.eql(elem.name)
                            expect(res.body.pattern.data_set[index].duration).to.eql(elem.duration)
                            index++
                        }
                        expect(res.body.type).to.eql(result.type)
                        expect(res.body.patient_id).to.eql(result.patient_id.toString())
                    })
            })
        })

        context('when there is no that specific sleep associated with that patient in the database', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 404 and an info message describing that sleep was not found', () => {
                return request
                    .get(`/v1/patients/${defaultSleep.patient_id}/sleep/${defaultSleep.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(err => {
                        expect(err.body.code).to.eql(404)
                        expect(err.body.message).to.eql('Sleep not found!')
                        expect(err.body.description).to.eql('Sleep not found or already removed. A new operation for ' +
                            'the same resource is not required.')
                    })
            })
        })

        context('when the patient_id is invalid', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 400 and an info message about the invalid patient_id', () => {
                return request
                    .get(`/v1/patients/123/sleep/${defaultSleep.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the sleep id is invalid', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 400 and an info message about the invalid sleep id', () => {
                return request
                    .get(`/v1/patients/${defaultSleep.patient_id}/sleep/123`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.SLEEP.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
    /**
     * DELETE route
     */
    describe('DELETE /v1/patients/:patient_id/sleep/:sleep_id', () => {
        context('when the sleep was deleted successfully', () => {
            let result

            before(async () => {
                try {
                    await deleteAllSleep()

                    result = await createSleep({
                        start_time: defaultSleep.start_time,
                        end_time: defaultSleep.end_time,
                        duration: defaultSleep.duration,
                        pattern: defaultSleep.pattern!.data_set,
                        type: defaultSleep.type,
                        patient_id: defaultSleep.patient_id
                    })
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 204 and no content for sleep (and show an error log about unable to send ' +
                'DeleteSleep event)', () => {
                return request
                    .delete(`/v1/patients/${result.patient_id}/sleep/${result.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the sleep is not found', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 204 and no content for sleep', () => {
                return request
                    .delete(`/v1/patients/${defaultSleep.patient_id}/sleep/${defaultSleep.id}`)
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
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 400 and an info message about the invalid patient_id', () => {
                return request
                    .delete(`/v1/patients/123/sleep/${defaultSleep.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })

        context('when the sleep id is invalid', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 400 and an info message about the invalid sleep id', () => {
                return request
                    .delete(`/v1/patients/${defaultSleep.patient_id}/sleep/123`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.SLEEP.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
})

async function createSleep(item): Promise<any> {
    const sleepMapper: SleepEntityMapper = new SleepEntityMapper()
    const resultModel = sleepMapper.transform(item)
    const resultModelEntity = sleepMapper.transform(resultModel)
    return await Promise.resolve(SleepRepoModel.create(resultModelEntity))
}

async function deleteAllSleep() {
    return SleepRepoModel.deleteMany({})
}
