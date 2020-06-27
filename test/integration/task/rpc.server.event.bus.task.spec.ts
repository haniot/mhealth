import { expect } from 'chai'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { IBackgroundTask } from '../../../src/application/port/background.task.interface'
import { IEventBus } from '../../../src/infrastructure/port/event.bus.interface'
import { Default } from '../../../src/utils/default'
import { IPhysicalActivityRepository } from '../../../src/application/port/physical.activity.repository.interface'
import { ActivityRepoModel } from '../../../src/infrastructure/database/schema/activity.schema'
import { PhysicalActivity } from '../../../src/application/domain/model/physical.activity'
import { SleepRepoModel } from '../../../src/infrastructure/database/schema/sleep.schema'
import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { ActivityTypeMock, PhysicalActivityMock } from '../../mocks/models/physical.activity.mock'
import { Strings } from '../../../src/utils/strings'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { ISleepRepository } from '../../../src/application/port/sleep.repository.interface'
import { Config } from '../../../src/utils/config'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const rabbit: IEventBus = DIContainer.get(Identifier.RABBITMQ_EVENT_BUS)
const rpcServerEventBusTask: IBackgroundTask = DIContainer.get(Identifier.RPC_SERVER_EVENT_BUST_TASK)
const activityRepository: IPhysicalActivityRepository = DIContainer.get(Identifier.ACTIVITY_REPOSITORY)
const sleepRepository: ISleepRepository = DIContainer.get(Identifier.SLEEP_REPOSITORY)

describe('RPC SERVER EVENT BUS TASK', () => {
    // Start DB connection, RabbitMQ connection and ProviderEventBusTask
    before(async () => {
        try {
            const mongoConfigs = Config.getMongoConfig()
            await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

            await deleteAllActivities()
            await deleteAllSleep()
            await deleteAllBodyFats()
            await deleteAllWeights()

            const rabbitConfigs = Config.getRabbitConfig()
            await rabbit.connectionRpcServer.open(rabbitConfigs.uri, rabbitConfigs.options)
            await rabbit.connectionRpcClient.open(rabbitConfigs.uri, rabbitConfigs.options)

            rpcServerEventBusTask.run()
        } catch (err) {
            throw new Error('Failure on ProviderEventBusTask test: ' + err.message)
        }
    })

    // Stop DB connection and ProviderEventBusTask
    after(async () => {
        try {
            await deleteAllActivities()
            await deleteAllSleep()
            await deleteAllBodyFats()
            await deleteAllWeights()

            await dbConnection.dispose()

            await rpcServerEventBusTask.stop()
        } catch (err) {
            throw new Error('Failure on ProviderEventBusTask test: ' + err.message)
        }
    })

    /**
     * PROVIDERS
     */
    describe('Provider PhysicalActivity', () => {
        context('when retrieving physical activities through a query successfully when there is at least ' +
            'one matching activity associated with the patient_id passed in the query', () => {
            before(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on Provider PhysicalActivity test: ' + err.message)
                }
            })
            // Delete all activities from database after each test case
            after(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on Provider PhysicalActivity test: ' + err.message)
                }
            })
            it('should return an array with one physical activity', (done) => {
                const activity: PhysicalActivity = new PhysicalActivityMock()
                activity.patient_id = '5a62be07d6f33400146c9b61'

                activityRepository.create(activity)
                    .then(async () => {
                        const result = await rabbit.executeResource('mhealth.rpc',
                            'physicalactivities.find', '?patient_id=5a62be07d6f33400146c9b61')
                        expect(result.length).to.eql(1)
                        // Comparing the resources
                        expect(result[0]).to.have.property('id')
                        expect(result[0].start_time).to.eql(activity.start_time)
                        expect(result[0].end_time).to.eql(activity.end_time)
                        expect(result[0].duration).to.eql(activity.duration)
                        expect(result[0].patient_id).to.eql(activity.patient_id)
                        expect(result[0].name).to.eql(activity.name)
                        expect(result[0].calories).to.eql(activity.calories)
                        expect(result[0].distance).to.eql(activity.distance)
                        expect(result[0].steps).to.eql(activity.steps)
                        expect(result[0].levels).to.eql(activity.levels!.map(item => item.toJSON()))
                        expect(result[0].calories_link).to.eql(activity.calories_link)
                        expect(result[0].heart_rate_link).to.eql(activity.heart_rate_link)
                        expect(result[0].heart_rate_average).to.eql(activity.heart_rate_average)
                        expect(result[0].heart_rate_zones).to.eql(activity.heart_rate_zones!.toJSON())
                        done()
                    })
                    .catch(done)
            })
        })

        context('when retrieving physical activities through a query successfully when there is at least ' +
            'one matching activity', () => {
            before(async () => {
                try {
                    await deleteAllActivities()

                    const activity1: PhysicalActivity = new PhysicalActivityMock()
                    activity1.start_time = new Date(1516417200000).toISOString()
                    activity1.end_time = new Date(new Date(activity1.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString() // 10-45min in milliseconds
                    activity1.duration = 900000
                    activity1.patient_id = '5a62be07d6f33400146c9b61'
                    activity1.name = ActivityTypeMock.WALK
                    activity1.calories = 90
                    activity1.steps = 500
                    activity1.heart_rate_average = 80

                    const activity2: PhysicalActivity = new PhysicalActivityMock()
                    activity2.start_time = new Date(1516449600000).toISOString()
                    activity2.end_time = new Date(new Date(activity2.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    activity2.duration = 899999
                    activity2.patient_id = '5a62be07d6f33400146c9b61'
                    activity2.name = ActivityTypeMock.RUN
                    activity2.calories = 300
                    activity2.steps = 2100
                    activity2.heart_rate_average = 90

                    const activity3: PhysicalActivity = new PhysicalActivityMock()
                    activity3.start_time = new Date(1516471200000).toISOString()
                    activity3.end_time = new Date(new Date(activity3.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    activity3.duration = 899999
                    activity3.patient_id = '5a62be07de34500146d9c544'
                    activity3.name = ActivityTypeMock.WALK
                    activity3.calories = 120
                    activity3.steps = 700
                    activity3.heart_rate_average = 78

                    const activity4: PhysicalActivity = new PhysicalActivityMock()
                    activity4.start_time = new Date(1547953200000).toISOString()
                    activity4.end_time = new Date(new Date(activity4.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    activity4.duration = 920000
                    activity4.patient_id = '5a62be07de34500146d9c544'
                    activity4.name = ActivityTypeMock.RUN
                    activity4.calories = 230
                    activity4.steps = 1700
                    activity4.heart_rate_average = 105

                    const activity5: PhysicalActivity = new PhysicalActivityMock()
                    activity5.start_time = new Date(1547985600000).toISOString()
                    activity5.end_time = new Date(new Date(activity5.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    activity5.duration = 930000
                    activity5.patient_id = '5a62be07d6f33400146c9b61'
                    activity5.name = ActivityTypeMock.WALK
                    activity5.calories = 100
                    activity5.steps = 550
                    activity5.heart_rate_average = 115

                    const activity6: PhysicalActivity = new PhysicalActivityMock()
                    activity6.start_time = new Date(1548007200000).toISOString()
                    activity6.end_time = new Date(new Date(activity6.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    activity6.duration = 820000
                    activity6.patient_id = '5a62be07de34500146d9c544'
                    activity6.name = ActivityTypeMock.RUN
                    activity6.calories = 180
                    activity6.steps = 1400
                    activity6.heart_rate_average = 110

                    await activityRepository.create(activity1)
                    await activityRepository.create(activity2)
                    await activityRepository.create(activity3)
                    await activityRepository.create(activity4)
                    await activityRepository.create(activity5)
                    await activityRepository.create(activity6)
                } catch (err) {
                    throw new Error('Failure on Provider PhysicalActivity test: ' + err.message)
                }
            })
            after(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on Provider PhysicalActivity test: ' + err.message)
                }
            })
            it('should return an array with six physical activities (regardless of association with a patient)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'physicalactivities.find', '')
                    .then(result => {
                        expect(result.length).to.eql(6)
                        done()
                    })
                    .catch(done)
            })

            it('should return an empty array (no activity matches query)', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?patient_id=5a62be07d6f33400146c9b64')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three physical activities (query all activities by patient_id)', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?patient_id=5a62be07de34500146d9c544')
                    .then(result => {
                        expect(result.length).to.eql(3)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three physical activities (query all activities by name)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'physicalactivities.find', '?name=walk')
                    .then(result => {
                        expect(result.length).to.eql(3)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with two physical activities (query all activities by name and patient_id)', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?name=walk&patient_id=5a62be07d6f33400146c9b61')
                    .then(result => {
                        expect(result.length).to.eql(2)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three physical activities (query all activities performed in one day)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find',
                        '?start_time=gte:2019-01-20T00:00:00.000Z&end_time=lt:2019-01-20T23:59:59.999Z')
                        .then(result => {
                            expect(result.length).to.eql(3)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with two physical activities (query the activities of a patient performed in one day)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find',
                        '?start_time=gte:2019-01-20T00:00:00.000Z' +
                        '&end_time=lt:2019-01-20T23:59:59.999Z' +
                        '&patient_id=5a62be07de34500146d9c544')
                        .then(result => {
                            expect(result.length).to.eql(2)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with three physical activities (query all activities performed in one week)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find',
                        '?start_at=2019-01-20T00:00:00.000Z&period=1w')
                        .then(result => {
                            expect(result.length).to.eql(3)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with two physical activities (query the activities of a patient performed in one week)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find',
                        '?start_at=2019-01-20T00:00:00.000Z&period=1w&patient_id=5a62be07de34500146d9c544')
                        .then(result => {
                            expect(result.length).to.eql(2)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with five physical activities (query all activities that burned 100 calories or more)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find',
                        '?calories=gte:100')
                        .then(result => {
                            expect(result.length).to.eql(5)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with three physical activities ' +
                '(query all activities of a patient that burned 100 calories or more)', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find',
                    '?calories=gte:100&patient_id=5a62be07de34500146d9c544')
                    .then(result => {
                        expect(result.length).to.eql(3)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with four physical activities (query all activities that had 700 steps or more)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find',
                        '?steps=gte:700')
                        .then(result => {
                            expect(result.length).to.eql(4)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with three physical activities ' +
                '(query all activities of a patient that had 700 steps or more)', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find',
                    '?steps=gte:700&patient_id=5a62be07de34500146d9c544')
                    .then(result => {
                        expect(result.length).to.eql(3)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three physical activities ' +
                '(query all activities that have a heart rate average greater than or equal to 100)', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find',
                    '?heart_rate_average=gte:100')
                    .then(result => {
                        expect(result.length).to.eql(3)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with two physical activities ' +
                '(query all activities of a patient that have a heart rate average greater than or equal to 100)', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find',
                    '?heart_rate_average=gte:100&patient_id=5a62be07de34500146d9c544')
                    .then(result => {
                        expect(result.length).to.eql(2)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three physical activities (query all activities lasting 15 minutes or more)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find',
                        '?duration=gte:900000')
                        .then(result => {
                            expect(result.length).to.eql(3)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with one physical activity (query all activities of a patient lasting 15 minutes or more)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find',
                        '?duration=gte:900000&patient_id=5a62be07de34500146d9c544')
                        .then(result => {
                            expect(result.length).to.eql(1)
                            done()
                        })
                        .catch(done)
                })
        })

        context('when trying to retrieve physical activities through invalid query', () => {
            before(async () => {
                try {
                    await deleteAllActivities()

                    const activity: PhysicalActivity = new PhysicalActivityMock()
                    await activityRepository.create(activity)
                } catch (err) {
                    throw new Error('Failure on Provider PhysicalActivity test: ' + err.message)
                }
            })
            // Delete all physical activities from database after each test case
            after(async () => {
                try {
                    await deleteAllActivities()
                } catch (err) {
                    throw new Error('Failure on Provider PhysicalActivity test: ' + err.message)
                }
            })
            it('should return a ValidationException (query with an invalid date (start_time))', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?start_time=invalidStartTime')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '
                                .concat('Datetime: invalidStartTime'.concat(Strings.ERROR_MESSAGE.INVALID_DATE)))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (query with an invalid date (end_time))', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?end_time=invalidEndTime')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '
                                .concat('Datetime: invalidEndTime'.concat(Strings.ERROR_MESSAGE.INVALID_DATE)))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (query with an invalid number (duration))', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?duration=invalidDuration')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message)
                                .to.eql('Error: '.concat('The value \'invalidDuration\' of duration field is not a number.'))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (query with an invalid number (calories))', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?calories=invalidCalories')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '
                                .concat('The value \'invalidCalories\' of calories field is not a number.'))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (query with an invalid number (steps))', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?steps=invalidSteps')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '
                                .concat('The value \'invalidSteps\' of steps field is not a number.'))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (query with an invalid patient id)', (done) => {
                rabbit.executeResource('mhealth.rpc',
                    'physicalactivities.find', '?patient_id=invalidPatientId')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })
        })

        context('when trying to recover physical activities through a query unsuccessful (without MongoDB connection)',
            () => {
                before(async () => {
                    try {
                        await dbConnection.dispose()
                    } catch (err) {
                        throw new Error('Failure on Provider PhysicalActivity test: ' + err.message)
                    }
                })
                after(async () => {
                    try {
                        await dbConnection.tryConnect(process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST)
                    } catch (err) {
                        throw new Error('Failure on Provider PhysicalActivity test: ' + err.message)
                    }
                })
                it('should return a rpc timeout error', (done) => {
                    rabbit.executeResource('mhealth.rpc',
                        'physicalactivities.find', '?patient_id=5a62be07d6f33400146c9b61')
                        .then(() => {
                            done(new Error('RPC should not function normally'))
                        })
                        .catch((err) => {
                            try {
                                expect(err.message).to.eql('rpc timed out')
                                done()
                            } catch (err) {
                                done(err)
                            }
                        })
                })
            })
    })

    describe('Provider Sleep', () => {
        context('when retrieving sleep objects through a query successfully when there is at least ' +
            'one matching sleep associated with the patient_id passed in the query', () => {
            before(async () => {
                try {
                    await deleteAllSleep()
                } catch (err) {
                    throw new Error('Failure on Provider Sleep test: ' + err.message)
                }
            })
            // Delete all sleep objects from database after each test case
            after(async () => {
                try {
                    await deleteAllSleep()
                } catch (err) {
                    throw new Error('Failure on Provider Sleep test: ' + err.message)
                }
            })
            it('should return an array with one sleep', (done) => {
                const sleep: Sleep = new SleepMock()
                sleep.patient_id = '5a62be07d6f33400146c9b61'

                sleepRepository.create(sleep)
                    .then(async () => {
                        const result = await rabbit.executeResource('mhealth.rpc', 'sleep.find',
                            '?patient_id=5a62be07d6f33400146c9b61')
                        expect(result.length).to.eql(1)
                        // Comparing the resources
                        expect(result[0]).to.have.property('id')
                        expect(result[0].start_time).to.eql(sleep.start_time)
                        expect(result[0].end_time).to.eql(sleep.end_time)
                        expect(result[0].duration).to.eql(sleep.duration)
                        expect(result[0].patient_id).to.eql(sleep.patient_id)
                        let index = 0
                        for (const elem of sleep.pattern!.data_set) {
                            expect(result[0].pattern.data_set[index].start_time).to.eql(elem.start_time)
                            expect(result[0].pattern.data_set[index].name).to.eql(elem.name)
                            expect(result[0].pattern.data_set[index].duration).to.eql(elem.duration)
                            index++
                        }
                        expect(result[0].pattern).to.have.property('summary')
                        expect(result[0].type).to.eql(sleep.type)
                        done()
                    })
                    .catch(done)
            })
        })

        context('when retrieving sleep objects through a query successfully when there is at least ' +
            'one matching sleep', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    const sleep1: Sleep = new SleepMock()
                    sleep1.start_time = new Date(1516417200000).toISOString()
                    sleep1.end_time = new Date(new Date(sleep1.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString() // 10-45min in milliseconds
                    sleep1.duration = 28800000
                    sleep1.patient_id = '5a62be07d6f33400146c9b61'

                    const sleep2: Sleep = new SleepMock()
                    sleep2.start_time = new Date(1516449600000).toISOString()
                    sleep2.end_time = new Date(new Date(sleep2.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    sleep2.duration = 27800000
                    sleep2.patient_id = '5a62be07d6f33400146c9b61'

                    const sleep3: Sleep = new SleepMock()
                    sleep3.start_time = new Date(1516471200000).toISOString()
                    sleep3.end_time = new Date(new Date(sleep3.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    sleep3.duration = 28810000
                    sleep3.patient_id = '5a62be07de34500146d9c544'

                    const sleep4: Sleep = new SleepMock()
                    sleep4.start_time = new Date(1547953200000).toISOString()
                    sleep4.end_time = new Date(new Date(sleep4.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    sleep4.duration = 27900000
                    sleep4.patient_id = '5a62be07de34500146d9c544'

                    const sleep5: Sleep = new SleepMock()
                    sleep5.start_time = new Date(1547985600000).toISOString()
                    sleep5.end_time = new Date(new Date(sleep5.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    sleep5.duration = 27895000
                    sleep5.patient_id = '5a62be07d6f33400146c9b61'

                    const sleep6: Sleep = new SleepMock()
                    sleep6.start_time = new Date(1548007200000).toISOString()
                    sleep6.end_time = new Date(new Date(sleep6.start_time)
                        .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
                    sleep6.duration = 28820000
                    sleep6.patient_id = '5a62be07de34500146d9c544'

                    await sleepRepository.create(sleep1)
                    await sleepRepository.create(sleep2)
                    await sleepRepository.create(sleep3)
                    await sleepRepository.create(sleep4)
                    await sleepRepository.create(sleep5)
                    await sleepRepository.create(sleep6)
                } catch (err) {
                    throw new Error('Failure on Provider Sleep test: ' + err.message)
                }
            })
            after(async () => {
                try {
                    await deleteAllSleep()
                } catch (err) {
                    throw new Error('Failure on Provider Sleep test: ' + err.message)
                }
            })
            it('should return an array with six sleep objects (regardless of association with a patient)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find', '')
                    .then(result => {
                        expect(result.length).to.eql(6)
                        done()
                    })
                    .catch(done)
            })

            it('should return an empty array (no sleep matches query)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find',
                    '?patient_id=5a62be07d6f33400146c9b64')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three sleep objects (query sleep records by patient_id)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find',
                    '?patient_id=5a62be07d6f33400146c9b61')
                    .then(result => {
                        expect(result.length).to.eql(3)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three sleep objects (query all sleep records in one day)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find',
                    '?start_time=gte:2019-01-20T00:00:00.000Z&end_time=lt:2019-01-20T23:59:59.999Z')
                    .then(result => {
                        expect(result.length).to.eql(3)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with two sleep objects (query all sleep records of a patient in one day)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find',
                    '?start_time=gte:2019-01-20T00:00:00.000Z' +
                    '&end_time=lt:2019-01-20T23:59:59.999Z' +
                    '&patient_id=5a62be07de34500146d9c544')
                    .then(result => {
                        expect(result.length).to.eql(2)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three sleep objects (query all sleep records in one week)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find',
                    '?start_at=2019-01-20T00:00:00.000Z&period=1w')
                    .then(result => {
                        expect(result.length).to.eql(3)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with two sleep objects (query all sleep records of a patient in one week)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find',
                    '?start_at=2019-01-20T00:00:00.000Z&period=1w&patient_id=5a62be07de34500146d9c544')
                    .then(result => {
                        expect(result.length).to.eql(2)
                        done()
                    })
                    .catch(done)
            })

            it('should return an array with three sleep objects (query all sleep records that lasted 8 hours or more)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc', 'sleep.find',
                        '?duration=gte:28800000')
                        .then(result => {
                            expect(result.length).to.eql(3)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with three sleep objects (query all sleep records that lasted less than 8 hours)',
                (done) => {
                    rabbit.executeResource('mhealth.rpc', 'sleep.find',
                        '?duration=lt:28800000')
                        .then(result => {
                            expect(result.length).to.eql(3)
                            done()
                        })
                        .catch(done)
                })

            it('should return an array with two sleep objects ' +
                '(query all sleep records of a patient that lasted 8 hours or more)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find',
                    '?duration=gte:28800000&patient_id=5a62be07de34500146d9c544')
                    .then(result => {
                        expect(result.length).to.eql(2)
                        done()
                    })
                    .catch(done)
            })
        })

        context('when trying to retrieve sleep objects through invalid query', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    const sleep: Sleep = new SleepMock()

                    await sleepRepository.create(sleep)
                } catch (err) {
                    throw new Error('Failure on Provider Sleep test: ' + err.message)
                }
            })
            // Delete all sleep objects from database after each test case
            after(async () => {
                try {
                    await deleteAllSleep()
                } catch (err) {
                    throw new Error('Failure on Provider Sleep test: ' + err.message)
                }
            })
            it('should return a ValidationException (query with an invalid date (start_time))', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find', '?start_time=invalidStartTime')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '
                                .concat('Datetime: invalidStartTime'.concat(Strings.ERROR_MESSAGE.INVALID_DATE)))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (query with an invalid date (end_time))', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find', '?end_time=invalidEndTime')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '
                                .concat('Datetime: invalidEndTime'.concat(Strings.ERROR_MESSAGE.INVALID_DATE)))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (query with an invalid number (duration))', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find', '?duration=invalidDuration')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '
                                .concat('The value \'invalidDuration\' of duration field is not a number.'))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (query with an invalid patient id)', (done) => {
                rabbit.executeResource('mhealth.rpc', 'sleep.find', '?patient_id=invalidPatientId')
                    .then(result => {
                        expect(result.length).to.eql(0)
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })
        })

        context('when trying to recover sleep objects through a query unsuccessful (without MongoDB connection)',
            () => {
                before(async () => {
                    try {
                        await dbConnection.dispose()
                    } catch (err) {
                        throw new Error('Failure on Provider Sleep test: ' + err.message)
                    }
                })
                after(async () => {
                    try {
                        await dbConnection.tryConnect(process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST)
                    } catch (err) {
                        throw new Error('Failure on Provider Sleep test: ' + err.message)
                    }
                })
                it('should return a rpc timeout error', (done) => {
                    rabbit.executeResource('mhealth.rpc', 'sleep.find',
                        '?patient_id=5a62be07d6f33400146c9b61')
                        .then(() => {
                            done(new Error('RPC should not function normally'))
                        })
                        .catch((err) => {
                            try {
                                expect(err.message).to.eql('rpc timed out')
                                done()
                            } catch (err) {
                                done(err)
                            }
                        })
                })
            })
    })
})

async function deleteAllActivities() {
    return ActivityRepoModel.deleteMany({})
}

async function deleteAllSleep() {
    return SleepRepoModel.deleteMany({})
}

async function deleteAllBodyFats() {
    return MeasurementRepoModel.deleteMany({})
}

async function deleteAllWeights() {
    return MeasurementRepoModel.deleteMany({})
}
