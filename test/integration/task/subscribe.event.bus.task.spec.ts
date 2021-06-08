import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { IBackgroundTask } from '../../../src/application/port/background.task.interface'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { IQuery } from '../../../src/application/port/query.interface'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { EventBusRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IMeasurementRepository } from '../../../src/application/port/measurement.repository.interface'
import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
import { Weight } from '../../../src/application/domain/model/weight'
import { WeightSyncEvent } from '../../../src/application/integration-event/event/weight.sync.event'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { expect } from 'chai'
import { MeasurementUnits } from '../../../src/application/domain/utils/measurement.units'
import { ActivityRepoModel } from '../../../src/infrastructure/database/schema/activity.schema'
import { SleepRepoModel } from '../../../src/infrastructure/database/schema/sleep.schema'
import { PhysicalActivityMock } from '../../mocks/models/physical.activity.mock'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { IPhysicalActivityRepository } from '../../../src/application/port/physical.activity.repository.interface'
import { ISleepRepository } from '../../../src/application/port/sleep.repository.interface'
import { UserDeleteEvent } from '../../../src/application/integration-event/event/user.delete.event'
import { User } from '../../../src/application/domain/model/user'
import { Config } from '../../../src/utils/config'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { Height } from '../../../src/application/domain/model/height'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const rabbit: EventBusRabbitMQ = DIContainer.get(Identifier.RABBITMQ_EVENT_BUS)
const subscribeEventBusTask: IBackgroundTask = DIContainer.get(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
const measurementRepository: IMeasurementRepository = DIContainer.get(Identifier.MEASUREMENT_REPOSITORY)
const activityRepository: IPhysicalActivityRepository = DIContainer.get(Identifier.ACTIVITY_REPOSITORY)
const sleepRepository: ISleepRepository = DIContainer.get(Identifier.SLEEP_REPOSITORY)

describe('SUBSCRIBE EVENT BUS TASK', () => {
    // Timeout function for control of execution
    const timeout = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // Start DB connection, RabbitMQ connection and SubscribeEventBusTask
    before(async () => {
        try {
            const mongoConfigs = Config.getMongoConfig()
            await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

            await deleteAllMeasurements()
            await deleteAllActivities()
            await deleteAllSleep()

            rabbit.receiveFromYourself = true
            const rabbitConfigs = Config.getRabbitConfig()
            await rabbit.connectionSub.open(rabbitConfigs.uri, rabbitConfigs.options)
            await rabbit.connectionPub.open(rabbitConfigs.uri, rabbitConfigs.options)
            await rabbit.connectionRpcClient.open(rabbitConfigs.uri, rabbitConfigs.options)

            subscribeEventBusTask.run()
            await timeout(2000)
        } catch (err) {
            throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        }
    })

    // Stop DB connection and SubscribeEventBusTask
    after(async () => {
        try {
            await deleteAllMeasurements()
            await deleteAllActivities()
            await deleteAllSleep()

            await dbConnection.dispose()
            await subscribeEventBusTask.stop()
        } catch (err) {
            throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        }
    })

    describe('WeightSyncEvent', () => {
        context('when receiving a WeightSyncEvent successfully', () => {
            beforeEach(async () => {
                try {
                    await deleteAllMeasurements()
                } catch (err) {
                    throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
                }
            })
            it('should return a new weight', (done) => {
                const weight: Weight = new Weight().fromJSON({
                    value: 55,
                    unit: MeasurementUnits.WEIGHT,
                    type: MeasurementTypes.WEIGHT,
                    timestamp: '2018-11-19T23:15:00Z',
                    body_fat: 21,
                    annual_variation: ChoiceTypes.YES,
                    device_id: '5ca77314bc08ec205689a736'
                })
                weight.patient_id = DefaultEntityMock.WEIGHT.patient_id

                const weightSyncEvent: WeightSyncEvent = new WeightSyncEvent(new Date(), weight)
                rabbit.publish(weightSyncEvent, WeightSyncEvent.ROUTING_KEY)
                    .then(async () => {
                        // Wait for 2000 milliseconds for the task to be executed
                        await timeout(5000)
                        const weightQuery: IQuery = new Query()
                        weightQuery.addFilter({ patient_id: weight.patient_id, type: MeasurementTypes.WEIGHT })

                        const weightResult = await measurementRepository.findOne(weightQuery)

                        expect(weightResult).to.have.property('id')
                        expect(weightResult.type).to.eql(weight.type)
                        expect(weightResult.value).to.eql(weight.value)
                        expect(weightResult.unit).to.eql(weight.unit)
                        expect(weightResult.timestamp).to.eql(new Date(weight.timestamp!))
                        expect(weightResult.device_id.toString()).to.eql(weight.device_id)
                        expect(weightResult.patient_id.toString()).to.eql(weight.patient_id)
                        expect(weightResult.body_fat).to.eql(weight.body_fat)
                        expect(weightResult.annual_variation).to.eql(weight.annual_variation)

                        done()
                    })
                    .catch(done)
            })
        })

        context('when receiving a WeightSyncEvent with a Weight array successfully', () => {
            beforeEach(async () => {
                try {
                    await deleteAllMeasurements()
                } catch (err) {
                    throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
                }
            })
            it('should return a new weight object and an updated one', (done) => {
                //
                const weight: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
                weight.patient_id = DefaultEntityMock.WEIGHT.patient_id

                // Weight that will be previously created in the repository and updated via the bus
                const weightToBeUpdated: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
                weightToBeUpdated.patient_id = '7b73cd12e7f22311035d8c51'

                measurementRepository.create(weightToBeUpdated)
                    .then(async weightCreate => {
                        const newWeight: Weight = new Weight().fromJSON(weightCreate)
                        newWeight.value = 60
                        newWeight.body_fat = 19
                        newWeight.patient_id = weightCreate.patient_id

                        const weightArray: Array<Weight> = [weight, newWeight]

                        const weightSyncEvent: WeightSyncEvent = new WeightSyncEvent(new Date(), weightArray)
                        await rabbit.publish(weightSyncEvent, WeightSyncEvent.ROUTING_KEY)

                        // Wait for 2000 milliseconds for the task to be executed
                        await timeout(2000)

                        const query: IQuery = new Query()
                        query.addFilter({ type: MeasurementTypes.WEIGHT })

                        const result = await measurementRepository.find(query)

                        expect(result[0].value).to.eql(weight.value)
                        expect(result[0].body_fat).to.eql(weight.body_fat)
                        expect(result[1].value).to.eql(newWeight.value)
                        expect(result[1].body_fat).to.eql(newWeight.body_fat)

                        done()
                    })
                    .catch(done)
            })
        })
    })

    describe('PhysicalActivitySyncEvent', () => {
        // context('when receiving a PhysicalActivitySyncEvent successfully', () => {
        //     beforeEach(async () => {
        //         try {
        //             await deleteAllActivities()
        //         } catch (err) {
        //             throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        //         }
        //     })
            // it('should return the physical activity with updated values', (done) => {
            //     const physical_activity: PhysicalActivity = new PhysicalActivityMock()
            //     physical_activity.calories = 200
            //     physical_activity.steps = 100
            //     physical_activity.distance = 150
            //
            //     activityRepository.create(physical_activity)
            //         .then(async activityCreate => {
            //             const newActivity: PhysicalActivity = new PhysicalActivity().fromJSON(activityCreate)
            //             newActivity.calories = 100
            //             newActivity.steps = 50
            //             newActivity.distance = 80
            //             newActivity.patient_id = activityCreate.patient_id
            //
            //             const physicalActivitySyncEvent: PhysicalActivitySyncEvent =
            //                 new PhysicalActivitySyncEvent(new Date(), newActivity)
            //             await rabbit.publish(physicalActivitySyncEvent, PhysicalActivitySyncEvent.ROUTING_KEY)
            //
            //             // Wait for 2000 milliseconds for the task to be executed
            //             await timeout(2000)
            //
            //             // PhysicalActivity tests
            //             const query: IQuery = new Query()
            //             query.addFilter({ _id: activityCreate.id })
            //
            //             const result = await activityRepository.findOne(query)
            //
            //             expect(result.calories).to.eql(newActivity.calories)
            //             expect(result.steps).to.eql(newActivity.steps)
            //             expect(result.distance).to.eql(newActivity.distance)
            //
            //             done()
            //         })
            //         .catch(done)
            // })
            //
            // it('should return a new physical activity', (done) => {
            //     const physical_activity: any = new PhysicalActivityMock()
            //
            //     const physicalActivitySyncEvent: any =
            //         new PhysicalActivitySyncEvent(new Date(), physical_activity)
            //
            //     rabbit.publish(physicalActivitySyncEvent, PhysicalActivitySyncEvent.ROUTING_KEY)
            //         .then(async () => {
            //             // Wait for 3000 milliseconds for the task to be executed
            //             await timeout(2000)
            //
            //             const query: IQuery = new Query()
            //             query.addFilter({ patient_id: physical_activity.patient_id })
            //             const result = await activityRepository.findOne(query)
            //
            //             expect(result).to.have.property('id')
            //             expect(new Date(result.start_time!).toISOString()).to.eql(physical_activity.start_time)
            //             expect(new Date(result.end_time!).toISOString()).to.eql(physical_activity.end_time)
            //             expect(result.duration).to.eql(physical_activity.duration)
            //             expect(result.patient_id.toString()).to.eql(physical_activity.patient_id)
            //             expect(result.name).to.eql(physical_activity.name)
            //             expect(result.calories).to.eql(physical_activity.calories)
            //             expect(result.steps).to.eql(physical_activity.steps)
            //             expect(result.distance).to.eql(physical_activity.distance)
            //             expect(result.levels).to.eql(physical_activity.levels)
            //             expect(result.heart_rate_average).to.eql(physical_activity.heart_rate_average)
            //             expect(result.heart_rate_zones).to.eql(physical_activity.heart_rate_zones)
            //
            //             done()
            //         })
            //         .catch(done)
            // })
        // })

        // context('when receiving a PhysicalActivitySyncEvent with a PhysicalActivity array successfully', () => {
        //     beforeEach(async () => {
        //         try {
        //             await deleteAllActivities()
        //         } catch (err) {
        //             throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        //         }
        //     })
        //     it('should return a new physical activity object and an updated one', (done) => {
        //         //
        //         const physical_activity: PhysicalActivity = new PhysicalActivityMock()
        //
        //         // PhysicalActivity that will be previously created in the repository and updated via the bus
        //         const activityToBeUpdated: PhysicalActivity = new PhysicalActivityMock()
        //         activityToBeUpdated.patient_id = '7b73cd12e7f22311035d8c51'
        //
        //         activityRepository.create(activityToBeUpdated)
        //             .then(async activityCreate => {
        //                 const newActivity: PhysicalActivity = new PhysicalActivity().fromJSON(activityCreate)
        //                 newActivity.calories = 100
        //                 newActivity.steps = 50
        //                 newActivity.distance = 80
        //                 newActivity.patient_id = activityCreate.patient_id
        //
        //                 const activitiesArray: Array<PhysicalActivity> = [physical_activity, newActivity]
        //
        //                 const physicalActivitySyncEvent: PhysicalActivitySyncEvent =
        //                     new PhysicalActivitySyncEvent(new Date(), activitiesArray)
        //                 await rabbit.publish(physicalActivitySyncEvent, PhysicalActivitySyncEvent.ROUTING_KEY)
        //
        //                 // Wait for 2000 milliseconds for the task to be executed
        //                 await timeout(2000)
        //
        //                 const result = await activityRepository.find(new Query())
        //                 expect(result[0].calories).to.eql(physical_activity.calories)
        //                 expect(result[0].steps).to.eql(physical_activity.steps)
        //                 expect(result[0].distance).to.eql(physical_activity.distance)
        //                 expect(result[1].calories).to.eql(newActivity.calories)
        //                 expect(result[1].steps).to.eql(newActivity.steps)
        //                 expect(result[1].distance).to.eql(newActivity.distance)
        //
        //                 done()
        //             })
        //             .catch(done)
        //     })
        // })
    })

    describe('SleepSyncEvent', () => {
        // context('when receiving a SleepSyncEvent successfully', () => {
        //     beforeEach(async () => {
        //         try {
        //             await deleteAllSleep()
        //         } catch (err) {
        //             throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        //         }
        //     })
            // it('should return the sleep with updated values', (done) => {
            //     const sleep: Sleep = new SleepMock()
            //     sleep.start_time = new Date(1516417200000).toISOString()
            //     sleep.end_time = new Date(new Date(sleep.start_time)
            //         .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString() // 10-45min in milliseconds
            //     sleep.duration = new Date(sleep.end_time).getTime() - new Date(sleep.start_time).getTime()
            //
            //     sleepRepository.create(sleep)
            //         .then(async sleepCreate => {
            //             const newSleep: Sleep = new Sleep().fromJSON(sleepCreate)
            //             newSleep.start_time = new Date(1516417200000).toISOString()
            //             newSleep.end_time = new Date(new Date(newSleep.start_time)
            //                 .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
            //             newSleep.duration = new Date(newSleep.end_time).getTime() - new Date(newSleep.start_time).getTime()
            //             newSleep.patient_id = sleepCreate.patient_id
            //
            //             const sleepSyncEvent: SleepSyncEvent = new SleepSyncEvent(new Date(), newSleep)
            //             await rabbit.publish(sleepSyncEvent, SleepSyncEvent.ROUTING_KEY)
            //
            //             // Wait for 2000 milliseconds for the task to be executed
            //             await timeout(2000)
            //
            //             // Sleep tests
            //             const query: IQuery = new Query()
            //             query.addFilter({ _id: sleepCreate.id })
            //
            //             const result = await sleepRepository.findOne(query)
            //
            //             expect(new Date(result.start_time!).toISOString()).to.eql(newSleep.start_time)
            //             expect(new Date(result.end_time!).toISOString()).to.eql(newSleep.end_time)
            //             expect(result.duration).to.eql(newSleep.duration)
            //
            //             done()
            //         })
            //         .catch(done)
            // })
            //
            // it('should return a new sleep', (done) => {
            //     const sleep: Sleep = new SleepMock()
            //
            //     const sleepSyncEvent: SleepSyncEvent = new SleepSyncEvent(new Date(), sleep)
            //     rabbit.publish(sleepSyncEvent, SleepSyncEvent.ROUTING_KEY)
            //         .then(async () => {
            //             // Wait for 2000 milliseconds for the task to be executed
            //             await timeout(2000)
            //
            //             const query: IQuery = new Query()
            //             query.addFilter({ patient_id: sleep.patient_id })
            //
            //             const result = await sleepRepository.findOne(query)
            //             expect(result).to.have.property('id')
            //             expect(new Date(result.start_time!).toISOString()).to.eql(sleep.start_time)
            //             expect(new Date(result.end_time!).toISOString()).to.eql(sleep.end_time)
            //             expect(result.duration).to.eql(sleep.duration)
            //             expect(result.patient_id.toString()).to.eql(sleep.patient_id)
            //             let i = 0
            //             for (const elem of result.pattern!.data_set) {
            //                 expect(new Date(elem.start_time).toISOString()).to.eql(sleep.pattern!.data_set[i].start_time)
            //                 expect(elem.name).to.eql(sleep.pattern!.data_set[i].name)
            //                 expect(elem.duration).to.eql(sleep.pattern!.data_set[i].duration)
            //                 i++
            //             }
            //             expect(result.type).to.eql(sleep.type)
            //
            //             done()
            //         })
            //         .catch(done)
            // })
        // })

        // context('when receiving a SleepSyncEvent with a Sleep array successfully', () => {
        //     beforeEach(async () => {
        //         try {
        //             await deleteAllSleep()
        //         } catch (err) {
        //             throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        //         }
        //     })
        //     it('should return a new sleep object and an updated one', (done) => {
        //         //
        //         const sleep: Sleep = new SleepMock()
        //
        //         // Sleep that will be previously created in the repository and updated via the bus
        //         const sleepToBeUpdated: Sleep = new SleepMock()
        //         sleepToBeUpdated.start_time = new Date(1516417200000).toISOString()
        //         sleepToBeUpdated.end_time = new Date(new Date(sleepToBeUpdated.start_time)
        //             .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
        //         sleepToBeUpdated.duration =
        //             new Date(sleepToBeUpdated.end_time).getTime() - new Date(sleepToBeUpdated.start_time).getTime()
        //         sleepToBeUpdated.patient_id = '7b73cd12e7f22311035d8c51'
        //
        //         sleepRepository.create(sleepToBeUpdated)
        //             .then(async sleepCreate => {
        //                 const newSleep: Sleep = new Sleep().fromJSON(sleepCreate)
        //                 newSleep.start_time = new Date(1516417200000).toISOString()
        //                 newSleep.end_time = new Date(new Date(newSleep.start_time)
        //                     .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString()
        //                 newSleep.duration = new Date(newSleep.end_time).getTime() - new Date(newSleep.start_time).getTime()
        //                 newSleep.patient_id = sleepCreate.patient_id
        //
        //                 const sleepArray: Array<Sleep> = [sleep, newSleep]
        //
        //                 const sleepSyncEvent: SleepSyncEvent = new SleepSyncEvent(new Date(), sleepArray)
        //                 await rabbit.publish(sleepSyncEvent, SleepSyncEvent.ROUTING_KEY)
        //
        //                 // Wait for 2000 milliseconds for the task to be executed
        //                 await timeout(2000)
        //
        //                 const result = await sleepRepository.find(new Query())
        //                 expect(new Date(result[0].start_time!).toISOString()).to.eql(sleep.start_time)
        //                 expect(new Date(result[0].end_time!).toISOString()).to.eql(sleep.end_time)
        //                 expect(result[0].duration).to.eql(sleep.duration)
        //                 expect(new Date(result[1].start_time!).toISOString()).to.eql(newSleep.start_time)
        //                 expect(new Date(result[1].end_time!).toISOString()).to.eql(newSleep.end_time)
        //                 expect(result[1].duration).to.eql(newSleep.duration)
        //
        //                 done()
        //             })
        //             .catch(done)
        //     })
        // })
    })

    describe('SUBSCRIBE UserDeleteEvent', () => {
        before(async () => {
            try {
                await deleteAllActivities()
                await deleteAllSleep()
                await deleteAllMeasurements()

                const activity1 = new PhysicalActivityMock()
                const activity2 = new PhysicalActivityMock()
                const sleep = new SleepMock()
                sleep.patient_id = activity1.patient_id
                const weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
                weight.patient_id = activity1.patient_id
                const temp = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
                temp.patient_id = activity1.patient_id
                const bloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
                bloodPressure.patient_id = activity1.patient_id
                const glucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
                glucose.patient_id = activity1.patient_id
                const height = new Height().fromJSON(DefaultEntityMock.HEIGHT)
                height.patient_id = activity1.patient_id
                await Promise.allSettled([
                    activityRepository.create(activity1), activityRepository.create(activity2),
                    sleepRepository.create(sleep), measurementRepository.create(weight),
                    measurementRepository.create(temp), measurementRepository.create(bloodPressure),
                    measurementRepository.create(glucose), measurementRepository.create(height)
                ])
            } catch (err) {
                throw new Error('Failure on Subscribe UserDeleteEvent test: ' + err.message)
            }
        })

        it('should return an empty array for each repository queried', (done) => {
            const user: User = new User().fromJSON({
                id: PhysicalActivityMock.PATIENT_ID, type: UserType.PATIENT
            })
            const userDeleteEvent: UserDeleteEvent = new UserDeleteEvent(new Date(), user)
            rabbit.publish(userDeleteEvent, UserDeleteEvent.ROUTING_KEY)
                .then(async () => {
                    // Wait for 1000 milliseconds for the task to be executed
                    await timeout(8000)
                    const query: IQuery = new Query().fromJSON(
                        { filters: { patient_id: PhysicalActivityMock.PATIENT_ID } }
                    )
                    const activityResult = await activityRepository.find(query)
                    expect(activityResult.length).to.eql(0)

                    const sleepResult = await sleepRepository.find(query)
                    expect(sleepResult.length).to.eql(0)

                    const weightResult = await measurementRepository.find(query)
                    expect(weightResult.length).to.eql(0)
                    done()
                })
                .catch(done)
        })
    })
})

async function deleteAllMeasurements() {
    return MeasurementRepoModel.deleteMany({})
}

async function deleteAllActivities() {
    return ActivityRepoModel.deleteMany({})
}

async function deleteAllSleep() {
    return SleepRepoModel.deleteMany({})
}
