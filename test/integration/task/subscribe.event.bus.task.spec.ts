import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { IBackgroundTask } from '../../../src/application/port/background.task.interface'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Default } from '../../../src/utils/default'
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
import { BodyFat } from '../../../src/application/domain/model/body.fat'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const rabbitmq: EventBusRabbitMQ = DIContainer.get(Identifier.RABBITMQ_EVENT_BUS)
const subscribeEventBusTask: IBackgroundTask = DIContainer.get(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
const measurementRepository: IMeasurementRepository = DIContainer.get(Identifier.MEASUREMENT_REPOSITORY)

describe('SUBSCRIBE EVENT BUS TASK', () => {
    // Timeout function for control of execution
    const timeout = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // Start DB connection, RabbitMQ connection and SubscribeEventBusTask
    before(async () => {
        try {
            await dbConnection.tryConnect(process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST)

            await deleteAllMeasurements({})

            // Initialize RabbitMQ Publisher connection
            const rabbitUri = process.env.RABBITMQ_URI || Default.RABBITMQ_URI
            const rabbitOptions: any = { interval: 100, receiveFromYourself: true, sslOptions: { ca: [] } }

            await rabbitmq.connectionPub.open(rabbitUri, rabbitOptions)

            rabbitmq.receiveFromYourself = true

            subscribeEventBusTask.run()

            await timeout(2000)
        } catch (err) {
            throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        }
    })

    // Stop DB connection and SubscribeEventBusTask
    after(async () => {
        try {
            await deleteAllMeasurements({})

            await dbConnection.dispose()

            await subscribeEventBusTask.stop()
        } catch (err) {
            throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
        }
    })

    context('when receiving a WeightSyncEvent successfully', () => {
        beforeEach(async () => {
            try {
                await deleteAllMeasurements({})
            } catch (err) {
                throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
            }
        })
        it('should return the weight with updated values if it already exists', (done) => {
            const weight: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
            weight.patient_id = DefaultEntityMock.WEIGHT.patient_id

            measurementRepository.create(weight)
                .then(async weightCreate => {
                    const newWeight: Weight = new Weight().fromJSON(weightCreate)
                    newWeight.value = 60
                    newWeight.body_fat = 19
                    newWeight.patient_id = weightCreate.patient_id

                    await timeout(2000)

                    const weightSyncEvent: WeightSyncEvent = new WeightSyncEvent(new Date(), newWeight)
                    await rabbitmq.publish(weightSyncEvent, WeightSyncEvent.ROUTING_KEY)

                    // Wait for 2000 milliseconds for the task to be executed
                    await timeout(2000)

                    // BodyFat tests
                    const bodyFatQuery: IQuery = new Query()
                    bodyFatQuery.addFilter({ patient_id: weightCreate.patient_id, type: MeasurementTypes.BODY_FAT })

                    const bodyFatResult = await measurementRepository.findOne(bodyFatQuery)

                    expect(bodyFatResult.value).to.eql(newWeight.body_fat)

                    // Weight tests
                    const weightQuery: IQuery = new Query()
                    weightQuery.addFilter({ _id: weightCreate.id, type: MeasurementTypes.WEIGHT })

                    const weightResult = await measurementRepository.findOne(weightQuery)

                    expect(weightResult.value).to.eql(newWeight.value)
                    expect(weightResult.body_fat).to.eql(newWeight.body_fat)

                    done()
                })
                .catch(done)
        })

        it('should return a new weight if there is no resource registered with this information yet', (done) => {
            const weight: Weight = new Weight().fromJSON({
                value: 55,
                unit: MeasurementUnits.WEIGHT,
                type: MeasurementTypes.WEIGHT,
                timestamp: '2018-11-19T14:40:00Z',
                body_fat: 21,
                patient_id: '5a62be07d6f33400146c9b61',
                device_id: '5ca77314bc08ec205689a736'
            })
            weight.patient_id = DefaultEntityMock.WEIGHT.patient_id

            const bodyFat: BodyFat = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
            bodyFat.patient_id = DefaultEntityMock.BODY_FAT.patient_id

            measurementRepository.create(bodyFat)
                .then(async () => {
                    await timeout(2000)

                    const weightSyncEvent: WeightSyncEvent = new WeightSyncEvent(new Date(), weight)
                    await rabbitmq.publish(weightSyncEvent, WeightSyncEvent.ROUTING_KEY)

                    // Wait for 2000 milliseconds for the task to be executed
                    await timeout(2000)

                    // BodyFat tests
                    const bodyFatQuery: IQuery = new Query()
                    bodyFatQuery.addFilter({ patient_id: bodyFat.patient_id, type: MeasurementTypes.BODY_FAT })

                    const bodyFatResult = await measurementRepository.findOne(bodyFatQuery)

                    expect(bodyFatResult.value).to.eql(weight.body_fat)

                    const weightQuery: IQuery = new Query()
                    weightQuery.addFilter({ patient_id: weight.patient_id, type: MeasurementTypes.WEIGHT })

                    const weightResult = await measurementRepository.findOne(weightQuery)

                    expect(weightResult.type).to.eql(weight.type)
                    expect(weightResult.value).to.eql(weight.value)
                    expect(weightResult.unit).to.eql(weight.unit)
                    expect(weightResult.timestamp).to.eql(new Date(weight.timestamp!))
                    expect(weightResult.device_id.toString()).to.eql(weight.device_id)
                    expect(weightResult.body_fat).to.eql(weight.body_fat)
                    expect(weightResult.patient_id.toString()).to.eql(weight.patient_id)

                    done()
                })
                .catch(done)
        })
    })

    context('when receiving a WeightSyncEvent with a Weight array successfully', () => {
        beforeEach(async () => {
            try {
                await deleteAllMeasurements({})
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

                    await timeout(2000)

                    const weightSyncEvent: WeightSyncEvent = new WeightSyncEvent(new Date(), weightArray)
                    await rabbitmq.publish(weightSyncEvent, WeightSyncEvent.ROUTING_KEY)

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

async function deleteAllMeasurements(doc) {
    return await MeasurementRepoModel.deleteMany(doc)
}
