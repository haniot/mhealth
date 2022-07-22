// import { expect } from 'chai'
// import { FitbitDevice } from '../../../src/application/domain/model/fitbit.device'
// import { IBackgroundTask } from '../../../src/application/port/background.task.interface'
// import { IFitbitDeviceRepository } from '../../../src/application/port/fitbit.device.repository.interface'
// import { RpcServerEventBusTask } from '../../../src/background/task/rpc.server.event.bus.task'
// import { DIContainer } from '../../../src/di/di'
// import { Identifier } from '../../../src/di/identifiers'
// import { ConnectionFactoryRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
// import { ConnectionRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.rabbitmq'
// import { EventBusRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
// import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
// import { Config } from '../../../src/utils/config'
// import { ILogger } from '../../../src/utils/custom.logger'
// import { Strings } from '../../../src/utils/strings'
// import { FitbitDeviceMock } from '../../mocks/models/fitbit.device.mock'
// import { DefaultFunctions } from '../../mocks/utils/default.functions'
// import { repoUtils } from '../utils/repository.utils'

// const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
// let eventBus: EventBusRabbitMQ = new EventBusRabbitMQ(
//     new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
//     new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
//     new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
//     new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ())
// )
// const fitbitDeviceRepository: IFitbitDeviceRepository = DIContainer.get(Identifier.FITBIT_DEVICE_REPOSITORY)
// const logger: ILogger = DIContainer.get(Identifier.LOGGER)
// let rpcServerEventBusTask: IBackgroundTask = new RpcServerEventBusTask(eventBus, fitbitDeviceRepository, logger)
// const rabbitConfigs = Config.getRabbitConfig()
// const mongoConfigs = Config.getMongoConfig()

// describe('RPC SERVER EVENT BUS TASK', () => {
//     // Timeout function for control of execution.
//     const timeout = (milliseconds) => {
//         return new Promise(resolve => setTimeout(resolve, milliseconds))
//     }

//     /**
//      * Mocks
//      */
//     // Fitbit Device
//     const userId = DefaultFunctions.generateObjectId()
//     const fitbitDevice: FitbitDevice = new FitbitDeviceMock().generate()
//     fitbitDevice.last_sync = new Date('2022-07-01').toISOString()
//     fitbitDevice.user_id = userId
//     const otherFitbitDevice: FitbitDevice = new FitbitDeviceMock().generate()
//     otherFitbitDevice.name = 'Other Fitbit Device'
//     otherFitbitDevice.type = 'SCALE'
//     otherFitbitDevice.last_sync = new Date('2022-07-10').toISOString()
//     otherFitbitDevice.user_id = userId
//     const otherFitbitDevice2: FitbitDevice = new FitbitDeviceMock().generate()
//     otherFitbitDevice2.name = 'Other Fitbit Device 2'
//     otherFitbitDevice2.type = 'SCALE'

//     // Starts DB connection, deletes all Devices, starts RabbitMQ connections and RpcServerEventBusTask.
//     before(async () => {
//         try {
//             await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

//             await repoUtils.deleteAllDevices()

//             await eventBus.connectionRpcServer.open(rabbitConfigs.uri, rabbitConfigs.options)
//             await eventBus.connectionRpcClient.open(rabbitConfigs.uri, rabbitConfigs.options)

//             rpcServerEventBusTask.run()

//             await timeout(2000)
//         } catch (err: any) {
//             throw new Error('Failure on RpcServerEventBusTask test: ' + err.message)
//         }
//     })

//     // Deletes all Devices, stops DB connection and RpcServerEventBusTask.
//     after(async () => {
//         try {
//             await repoUtils.deleteAllDevices()

//             await dbConnection.dispose()

//             await rpcServerEventBusTask.stop()

//             await timeout(2000)
//         } catch (err: any) {
//             throw new Error('Failure on RpcServerEventBusTask test: ' + err.message)
//         }
//     })

//     /**
//      * PROVIDERS
//      */
//     describe('Provider fitbitdevices.find', () => {
//         context('when successfully retrieving fitbit devices through a simple query', () => {
//             before(async () => {
//                 try {
//                     await repoUtils.deleteAllDevices()

//                     // Creates FitbitDevices.
//                     const fitbitDeviceCreated = await repoUtils.createFitbitDevice(fitbitDevice)
//                     fitbitDevice.id = fitbitDeviceCreated?.id

//                     const otherFitbitDeviceCreated = await repoUtils.createFitbitDevice(otherFitbitDevice)
//                     otherFitbitDevice.id = otherFitbitDeviceCreated?.id

//                     const otherFitbitDevice2Created = await repoUtils.createFitbitDevice(otherFitbitDevice2)
//                     otherFitbitDevice2.id = otherFitbitDevice2Created?.id
//                 } catch (err: any) {
//                     throw new Error('Failure on Provider fitbitdevices.find test: ' + err.message)
//                 }
//             })

//             after(async () => {
//                 try {
//                     await repoUtils.deleteAllDevices()
//                 } catch (err: any) {
//                     throw new Error('Failure on Provider fitbitdevices.find test: ' + err.message)
//                 }
//             })

//             it('should return all fitbit devices (array with three fitbit devices)', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '')
//                     .then(result => {
//                         expect(result.length).to.eql(3)
//                         done()
//                     })
//                     .catch(done)
//             })

//             it('should return two fitbit devices (page 1 with a maximum of 2 fitbit devices)', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?page=1&limit=2')
//                     .then(result => {
//                         expect(result.length).to.eql(2)
//                         done()
//                     })
//                     .catch(done)
//             })

//             it('should return fitbit devices that are of SCALE type (array with two fitbitDevice)', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?type=SCALE')
//                     .then(result => {
//                         expect(result.length).to.eql(2)
//                         expect(result[0].type).to.eql('SCALE')
//                         expect(result[1].type).to.eql('SCALE')
//                         done()
//                     })
//                     .catch(done)
//             })

//             it('should return fitbit devices that have the last_sync between a time interval (array with two fitbitDevice)',
//                 (done) => {
//                     eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?last_sync=gte:2022-07-01T00:00:00.000Z&' +
//                         'last_sync=lte:2022-07-10T23:59:59.999Z')
//                         .then(result => {
//                             expect(result.length).to.eql(2)
//                             expect(result[0].name).to.eql('Other Fitbit Device')
//                             expect(result[1].name).to.eql('Default Fitbit Device')
//                             done()
//                         })
//                         .catch(done)
//                 })

//             it('should return fitbit devices associated with a user_id (array with two fitbitDevice)', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', `?user_id=${userId}`)
//                     .then(result => {
//                         expect(result.length).to.eql(2)
//                         expect(result[0].user_id).to.eql(userId)
//                         expect(result[1].user_id).to.eql(userId)
//                         done()
//                     })
//                     .catch(done)
//             })

//             it('should return fitbit devices that have a particular string at the beginning of name ' +
//                 '(array with one fitbit device)', (done) => {
//                     eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?name=Default*')
//                         .then(result => {
//                             expect(result.length).to.eql(1)
//                             expect(result[0].name).to.eql('Default Fitbit Device')
//                             done()
//                         })
//                         .catch(done)
//                 })

//             it('should return fitbit devices that have a particular string at the end of name ' +
//                 '(array with one fitbit device)', (done) => {
//                     eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?name=*2')
//                         .then(result => {
//                             expect(result.length).to.eql(1)
//                             expect(result[0].name).to.eql('Other Fitbit Device 2')
//                             done()
//                         })
//                         .catch(done)
//                 })

//             it('should return fitbit devices that have a particular string anywhere in name ' +
//                 '(array with two fitbit devices)', (done) => {
//                     eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?name=*Other*')
//                         .then(result => {
//                             expect(result.length).to.eql(2)
//                             expect(result[0].name).to.eql('Other Fitbit Device 2')
//                             expect(result[1].name).to.eql('Other Fitbit Device')
//                             done()
//                         })
//                         .catch(done)
//                 })

//             it('should return fitbit device that has the name exactly equal to a given string ' +
//                 '(array with one fitbit device)', (done) => {
//                     eventBus
//                         .executeResource('ds.app.rpc', 'fitbitdevices.find', '?name=Other Fitbit Device')
//                         .then(result => {
//                             expect(result.length).to.eql(1)
//                             expect(result[0].name).to.eql('Other Fitbit Device')
//                             done()
//                         })
//                         .catch(done)
//                 })

//             it('should return fitbit devices sorted in descending order by name', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?sort=-name')
//                     .then(result => {
//                         expect(result.length).to.eql(3)
//                         expect(result[0].name).to.eql('Other Fitbit Device 2')
//                         expect(result[1].name).to.eql('Other Fitbit Device')
//                         expect(result[2].name).to.eql('Default Fitbit Device')
//                         done()
//                     })
//                     .catch(done)
//             })
//         })

//         context('when trying to retrieve fitbit devices through invalid query', () => {
//             before(async () => {
//                 try {
//                     await repoUtils.deleteAllDevices()

//                     // Creates FitbitDevice.
//                     const fitbitDeviceCreated = await repoUtils.createFitbitDevice(fitbitDevice)
//                     fitbitDevice.id = fitbitDeviceCreated?.id
//                 } catch (err: any) {
//                     throw new Error('Failure on Provider fitbitdevices.find test: ' + err.message)
//                 }
//             })

//             after(async () => {
//                 try {
//                     await repoUtils.deleteAllDevices()
//                 } catch (err: any) {
//                     throw new Error('Failure on Provider fitbitdevices.find test: ' + err.message)
//                 }
//             })

//             it('should return a ValidationException (query with an invalid ObjectID (_id))', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?_id=123')
//                     .then(() => {
//                         done(new Error('The find method of the repository should not function normally'))
//                     })
//                     .catch((err) => {
//                         try {
//                             expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT))
//                             done()
//                         } catch (err) {
//                             done(err)
//                         }
//                     })
//             })

//             it('should return a ValidationException (query with an invalid date (created_at))', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '?created_at=invalidCreatedAt')
//                     .then(() => {
//                         done(new Error('The find method of the repository should not function normally'))
//                     })
//                     .catch((err) => {
//                         try {
//                             expect(err.message).to.eql('Error: '.concat(Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT
//                                 .replace('{0}', 'invalidCreatedAt')))
//                             done()
//                         } catch (err) {
//                             done(err)
//                         }
//                     })
//             })
//         })

//         context('when trying to retrieve fitbit devices through a query unsuccessful (without MongoDB connection)', () => {
//             before(async () => {
//                 try {
//                     await repoUtils.deleteAllDevices()

//                     // Creates FitbitDevice.
//                     const fitbitDeviceCreated = await repoUtils.createFitbitDevice(fitbitDevice)
//                     fitbitDevice.id = fitbitDeviceCreated?.id

//                     await dbConnection.dispose()
//                 } catch (err: any) {
//                     throw new Error('Failure on Provider fitbitdevices.find test: ' + err.message)
//                 }
//             })

//             after(async () => {
//                 try {
//                     await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

//                     await repoUtils.deleteAllDevices()
//                 } catch (err: any) {
//                     throw new Error('Failure on Provider fitbitdevices.find test: ' + err.message)
//                 }
//             })

//             it('should return a MongoClient connection error', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '')
//                     .then(() => {
//                         done(new Error('The find method of the repository should not function normally'))
//                     })
//                     .catch((err) => {
//                         try {
//                             expect(err.message).to.eql('Error: Client must be connected before running operations')
//                             done()
//                         } catch (err) {
//                             done(err)
//                         }
//                     })
//             })
//         })

//         context('when trying to retrieve fitbit devices without a connection from the RPC Server', () => {
//             before(async () => {
//                 try {
//                     await repoUtils.deleteAllDevices()

//                     // Creates FitbitDevice.
//                     const fitbitDeviceCreated = await repoUtils.createFitbitDevice(fitbitDevice)
//                     fitbitDevice.id = fitbitDeviceCreated?.id

//                     await eventBus.connectionRpcServer.dispose()
//                 } catch (err: any) {
//                     throw new Error('Failure on Provider fitbitdevices.find test: ' + err.message)
//                 }
//             })

//             after(async () => {
//                 try {
//                     await repoUtils.deleteAllDevices()

//                     eventBus = new EventBusRabbitMQ(
//                         new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
//                         new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
//                         new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
//                         new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ())
//                     )

//                     await eventBus.connectionRpcServer.open(rabbitConfigs.uri, rabbitConfigs.options)
//                     await eventBus.connectionRpcClient.open(rabbitConfigs.uri, rabbitConfigs.options)

//                     rpcServerEventBusTask = new RpcServerEventBusTask(eventBus, fitbitDeviceRepository, logger)
//                     rpcServerEventBusTask.run()

//                     await timeout(2000)
//                 } catch (err: any) {
//                     throw new Error('Failure on Provider fitbitdevices.find test: ' + err.message)
//                 }
//             })

//             it('should return a rpc timeout error', (done) => {
//                 eventBus.executeResource('ds.app.rpc', 'fitbitdevices.find', '')
//                     .then(() => {
//                         done(new Error('RPC should not function normally'))
//                     })
//                     .catch((err) => {
//                         try {
//                             expect(err.message).to.eql('rpc timed out')
//                             done()
//                         } catch (err) {
//                             done(err)
//                         }
//                     })
//             })
//         })
//     })
// })
