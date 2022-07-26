import { expect } from 'chai'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { IBackgroundTask } from '../../../src/application/port/background.task.interface'
import { ISleepDurationService } from '../../../src/application/port/sleep.duration.service.interface'
import { RpcServerEventBusTask } from '../../../src/background/task/rpc.server.event.bus.task'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { ConnectionFactoryRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { ConnectionRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { EventBusRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Config } from '../../../src/utils/config'
import { ILogger } from '../../../src/utils/custom.logger'
import { Strings } from '../../../src/utils/strings'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { DefaultFunctions } from '../../mocks/utils/default.functions'
import { repoUtils } from '../utils/repository.utils'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
let eventBus: EventBusRabbitMQ = new EventBusRabbitMQ(
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ())
)
const sleepDurationService: ISleepDurationService = DIContainer.get(Identifier.SLEEP_DURATION_SERVICE)
const logger: ILogger = DIContainer.get(Identifier.LOGGER)
let rpcServerEventBusTask: IBackgroundTask = new RpcServerEventBusTask(eventBus, sleepDurationService, logger)
const rabbitConfigs = Config.getRabbitConfig()
const mongoConfigs = Config.getMongoConfig()

describe('RPC SERVER EVENT BUS TASK', () => {
    // Timeout function for control of execution.
    const timeout = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    /**
     * Mocks
     */
    const patientId: string = '5a62be07d6f33400146c9b61'
    // Sleep
    const sleep: Sleep = new SleepMock()
    sleep.start_time = new Date(1651374000000 + Math.floor((Math.random() * 1000))).toISOString()
    sleep.end_time = new Date(new Date(sleep.start_time)
        .setMilliseconds(Math.floor(Math.random() * 7 + 4) * 3.6e+6)).toISOString() // 4-10h in milliseconds
    sleep.patient_id = patientId

    const sleep2: Sleep = new SleepMock()
    sleep2.start_time = new Date(1651546800000 + Math.floor((Math.random() * 1000))).toISOString()
    sleep2.end_time = new Date(new Date(sleep2.start_time)
        .setMilliseconds(Math.floor(Math.random() * 7 + 4) * 3.6e+6)).toISOString() // 4-10h in milliseconds
    sleep2.patient_id = patientId

    const sleep3: Sleep = new SleepMock()
    sleep3.start_time = new Date(1651546800000 + Math.floor((Math.random() * 1000))).toISOString()
    sleep3.end_time = new Date(new Date(sleep3.start_time)
        .setMilliseconds(Math.floor(Math.random() * 7 + 4) * 3.6e+6)).toISOString() // 4-10h in milliseconds
    sleep3.patient_id = patientId

    // Starts DB connection, deletes all Sleep objects, starts RabbitMQ connections and RpcServerEventBusTask.
    before(async () => {
        try {
            await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

            await repoUtils.deleteAllSleep()

            await eventBus.connectionRpcServer.open(rabbitConfigs.uri, rabbitConfigs.options)
            await eventBus.connectionRpcClient.open(rabbitConfigs.uri, rabbitConfigs.options)

            rpcServerEventBusTask.run()

            await timeout(2000)
        } catch (err: any) {
            throw new Error('Failure on RpcServerEventBusTask test: ' + err.message)
        }
    })

    // Deletes all Sleep objects, stops DB connection and RpcServerEventBusTask.
    after(async () => {
        try {
            await repoUtils.deleteAllSleep()

            await dbConnection.dispose()

            await rpcServerEventBusTask.stop()

            await timeout(2000)
        } catch (err: any) {
            throw new Error('Failure on RpcServerEventBusTask test: ' + err.message)
        }
    })

    /**
     * PROVIDERS
     */
    describe('Provider sleepdurations.aggregatebypatient', () => {
        context('when successfully retrieving sleep durations by patient ID, start date and end date', () => {
            before(async () => {
                try {
                    await repoUtils.deleteAllSleep()

                    // Creates Sleep objects.
                    await repoUtils.createSleep(sleep)
                    await repoUtils.createSleep(sleep2)
                    await repoUtils.createSleep(sleep3)
                } catch (err: any) {
                    throw new Error('Failure on Provider sleepdurations.aggregatebypatient test: ' + err.message)
                }
            })

            after(async () => {
                try {
                    await repoUtils.deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on Provider sleepdurations.aggregatebypatient test: ' + err.message)
                }
            })

            it('should return total sleep durations of the day 2022-05-01 (range 2022-04-30 ~ 2022-05-02)', (done) => {
                eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                    patientId, '2022-04-30', '2022-05-02')
                    .then(result => {
                        expect(result.summary.total).to.eql(result.data_set[1].value)
                        expect(result.data_set.length).to.eql(3)
                        expect(result.data_set[0].date).to.eql('2022-04-30')
                        expect(result.data_set[0].value).to.eql(0)
                        expect(result.data_set[1].date).to.eql('2022-05-01')
                        expect(result.data_set[1].value).to.not.eql(0)
                        expect(result.data_set[2].date).to.eql('2022-05-02')
                        expect(result.data_set[2].value).to.eql(0)
                        done()
                    })
                    .catch(done)
            })

            it('should return total sleep durations of the days 2022-05-01 and 2022-05-03 (range 2022-04-30 ~ 2022-05-04)',
                (done) => {
                    eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                        patientId, '2022-04-30', '2022-05-04')
                        .then(result => {
                            expect(result.summary.total).to.eql(result.data_set[1].value + result.data_set[3].value)
                            expect(result.data_set.length).to.eql(5)
                            expect(result.data_set[0].date).to.eql('2022-04-30')
                            expect(result.data_set[0].value).to.eql(0)
                            expect(result.data_set[1].date).to.eql('2022-05-01')
                            expect(result.data_set[1].value).to.not.eql(0)
                            expect(result.data_set[2].date).to.eql('2022-05-02')
                            expect(result.data_set[2].value).to.eql(0)
                            expect(result.data_set[3].date).to.eql('2022-05-03')
                            expect(result.data_set[3].value).to.not.eql(0)
                            expect(result.data_set[4].date).to.eql('2022-05-04')
                            expect(result.data_set[4].value).to.eql(0)
                            done()
                        })
                        .catch(done)
                })

            it('should return data_set with values equal to 0 when patientId is not associated with sleep objects ' +
                'in a given range (range 2022-04-30 ~ 2022-05-02)',
                (done) => {
                    eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                        DefaultFunctions.generateObjectId(), '2022-04-30', '2022-05-02')
                        .then(result => {
                            expect(result.summary.total).to.eql(0)
                            expect(result.data_set.length).to.eql(3)
                            expect(result.data_set[0].date).to.eql('2022-04-30')
                            expect(result.data_set[0].value).to.eql(0)
                            expect(result.data_set[1].date).to.eql('2022-05-01')
                            expect(result.data_set[1].value).to.eql(0)
                            expect(result.data_set[2].date).to.eql('2022-05-02')
                            expect(result.data_set[2].value).to.eql(0)
                            done()
                        })
                        .catch(done)
                })

            it('should return data_set with values equal to 0 for today sleep durations (range today ~ today)', (done) => {
                eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient', patientId, 'today', 'today')
                    .then(result => {
                        expect(result.summary.total).to.eql(0)
                        expect(result.data_set.length).to.eql(1)
                        expect(result.data_set[0].date).to.eql(DefaultFunctions.generateSimpleDate(new Date().toISOString()))
                        expect(result.data_set[0].value).to.eql(0)
                        done()
                    })
                    .catch(done)
            })
        })

        context('when trying to retrieve sleep durations through invalid parameters', () => {
            before(async () => {
                try {
                    await repoUtils.deleteAllSleep()

                    // Creates Sleep object.
                    await repoUtils.createSleep(sleep)
                } catch (err: any) {
                    throw new Error('Failure on Provider sleepdurations.aggregatebypatient test: ' + err.message)
                }
            })

            after(async () => {
                try {
                    await repoUtils.deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on Provider sleepdurations.aggregatebypatient test: ' + err.message)
                }
            })

            it('should return a ValidationException (invalid patient_id))', (done) => {
                eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient', '123', '2022-04-30', '2022-05-02')
                    .then(() => {
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '.concat(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (start date is not in valid format))', (done) => {
                eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                    patientId, '30-04-2022', '2022-05-02')
                    .then(() => {
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.DATE.INVALID_FORMAT
                                .replace('{0}', '30-04-2022')))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (end date is not in valid format ' +
                'because month 02 has no day 29 in the year 2022))', (done) => {
                    eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                        patientId, '2022-02-28', '2022-02-29')
                        .then(() => {
                            done(new Error('The find method of the repository should not function normally'))
                        })
                        .catch((err) => {
                            try {
                                expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.DATE.INVALID_FORMAT
                                    .replace('{0}', '2022-02-29')))
                                done()
                            } catch (err) {
                                done(err)
                            }
                        })
                })

            it('should return a ValidationException (start date is not in valid format because the year is less than 1678',
                (done) => {
                    eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                        patientId, '1677-04-30', '2022-05-02')
                        .then(() => {
                            done(new Error('The find method of the repository should not function normally'))
                        })
                        .catch((err) => {
                            try {
                                expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.DATE.YEAR_NOT_ALLOWED
                                    .replace('{0}', '1677-04-30')))
                                done()
                            } catch (err) {
                                done(err)
                            }
                        })
                })

            it('should return a ValidationException (end date is not in valid format because the year is greater than 2261',
                (done) => {
                    eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                        patientId, '2022-04-30', '2262-05-02')
                        .then(() => {
                            done(new Error('The find method of the repository should not function normally'))
                        })
                        .catch((err) => {
                            try {
                                expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.DATE.YEAR_NOT_ALLOWED
                                    .replace('{0}', '2262-05-02')))
                                done()
                            } catch (err) {
                                done(err)
                            }
                        })
                })

            it('should return a ValidationException (end date is less than start date)', (done) => {
                eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                    patientId, '2022-04-30', '2022-04-29')
                    .then(() => {
                        done(new Error('The find method of the repository should not function normally'))
                    })
                    .catch((err) => {
                        try {
                            expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.DATE.RANGE_INVALID
                                .replace('{0}', '2022-04-30').replace('{1}', '2022-04-29')))
                            done()
                        } catch (err) {
                            done(err)
                        }
                    })
            })

            it('should return a ValidationException (the difference between start and end date is greater than 1 year)',
                (done) => {
                    eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                        patientId, '2022-04-30', '2023-05-01')
                        .then(() => {
                            done(new Error('The find method of the repository should not function normally'))
                        })
                        .catch((err) => {
                            try {
                                expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.DATE.RANGE_INVALID
                                    .replace('{0}', '2022-04-30').replace('{1}', '2023-05-01')))
                                done()
                            } catch (err) {
                                done(err)
                            }
                        })
                })
        })

        context('when trying to retrieve sleep durations by patient ID, start date and end date unsuccessful ' +
            '(without MongoDB connection)', () => {
                before(async () => {
                    try {
                        await repoUtils.deleteAllSleep()

                        // Creates Sleep object.
                        await repoUtils.createSleep(sleep)

                        await dbConnection.dispose()
                    } catch (err: any) {
                        throw new Error('Failure on Provider sleepdurations.aggregatebypatient test: ' + err.message)
                    }
                })

                after(async () => {
                    try {
                        await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

                        await repoUtils.deleteAllSleep()
                    } catch (err: any) {
                        throw new Error('Failure on Provider sleepdurations.aggregatebypatient test: ' + err.message)
                    }
                })

                it('should return a MongoClient connection error', (done) => {
                    eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                        patientId, '2022-04-30', '2022-05-02')
                        .then(() => {
                            done(new Error('The find method of the repository should not function normally'))
                        })
                        .catch((err) => {
                            try {
                                expect(err.message).to.eql('Error: An internal error has occurred in the database!')
                                done()
                            } catch (err) {
                                done(err)
                            }
                        })
                })
            })

        context('when trying to retrieve sleep durations by patient ID, start date and end date' +
            ' without a connection from the RPC Server', () => {
                before(async () => {
                    try {
                        await repoUtils.deleteAllSleep()

                        // Creates Sleep object.
                        await repoUtils.createSleep(sleep)

                        await eventBus.connectionRpcServer.dispose()
                    } catch (err: any) {
                        throw new Error('Failure on Provider sleepdurations.aggregatebypatient test: ' + err.message)
                    }
                })

                after(async () => {
                    try {
                        await repoUtils.deleteAllSleep()

                        eventBus = new EventBusRabbitMQ(
                            new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
                            new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
                            new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
                            new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ())
                        )

                        await eventBus.connectionRpcServer.open(rabbitConfigs.uri, rabbitConfigs.options)
                        await eventBus.connectionRpcClient.open(rabbitConfigs.uri, rabbitConfigs.options)

                        rpcServerEventBusTask = new RpcServerEventBusTask(eventBus, sleepDurationService, logger)
                        rpcServerEventBusTask.run()

                        await timeout(2000)
                    } catch (err: any) {
                        throw new Error('Failure on Provider sleepdurations.aggregatebypatient test: ' + err.message)
                    }
                })

                it('should return a rpc timeout error', (done) => {
                    eventBus.executeResource('mhealth.rpc', 'sleepdurations.aggregatebypatient',
                        patientId, '2022-04-30', '2022-05-02')
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
