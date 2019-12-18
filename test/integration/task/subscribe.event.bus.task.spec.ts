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
        before(async () => {
            try {
                await deleteAllMeasurements({})
            } catch (err) {
                throw new Error('Failure on SubscribeEventBusTask test: ' + err.message)
            }
        })
        it('should return an updated weight', (done) => {
            const weight: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
            weight.patient_id = DefaultEntityMock.WEIGHT.patient_id

            measurementRepository.create(weight)
                .then(async weightCreate => {
                    const newWeight: Weight = new Weight()
                    newWeight.value = 60
                    newWeight.unit = 'kg'
                    newWeight.type = 'weight'
                    newWeight.timestamp = DefaultEntityMock.WEIGHT.timestamp
                    newWeight.body_fat = 19
                    newWeight.patient_id = weightCreate.patient_id

                    await timeout(2000)

                    const weightSyncEvent: WeightSyncEvent = new WeightSyncEvent(new Date(), newWeight)
                    await rabbitmq.publish(weightSyncEvent, WeightSyncEvent.ROUTING_KEY)

                    // Wait for 2000 milliseconds for the task to be executed
                    await timeout(2000)

                    const query: IQuery = new Query()
                    query.addFilter({ _id: weightCreate.id, type: MeasurementTypes.WEIGHT })

                    // const result = await measurementRepository.find(new Query())

                    // expect(result.external_services.fitbit_last_sync).to.eql(new Date(fitbitLastSync.last_sync))
                    // expect(result.external_services.fitbit_status).to.eql(AccessStatusTypes.VALID_TOKEN)

                    done()
                })
                .catch(done)
        })
    })
})

async function deleteAllMeasurements(doc) {
    return await MeasurementRepoModel.deleteMany(doc)
}
