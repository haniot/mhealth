import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { Config } from '../../../src/utils/config'
import { SleepRepoModel } from '../../../src/infrastructure/database/schema/sleep.schema'
import { IEventBus } from '../../../src/infrastructure/port/event.bus.interface'
import { EventBusRabbitMQMock } from '../../mocks/eventbus/eventbus.rabbitmq.mock'
import { ConnectionRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { ConnectionFactoryRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { NightAwakeningTask } from '../../../src/background/task/night.awakening.task'
import { ISleepRepository } from '../../../src/application/port/sleep.repository.interface'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { SleepPatternDataSet } from '../../../src/application/domain/model/sleep.pattern.data.set'
import { Phases } from '../../../src/application/domain/utils/phases'
import { expect } from 'chai'

const eventBus: IEventBus = new EventBusRabbitMQMock(
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ())
)
const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const sleepRepository: ISleepRepository = DIContainer.get(Identifier.SLEEP_REPOSITORY)
const nightAwakeningTask: NightAwakeningTask =
    new NightAwakeningTask(eventBus, sleepRepository, DIContainer.get(Identifier.LOGGER))

describe('NIGHT AWAKENING TASK', () => {
    // Mock pattern.data_set objects.
    // Sleep pattern data set with two night awakenings.
    const dataSetItemTwoAwk: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemTwoAwk.start_time = '2020-10-20T04:00:00.000Z'
    dataSetItemTwoAwk.name = Phases.AWAKE
    dataSetItemTwoAwk.duration = 420000 // 7min milliseconds

    const dataSetItemTwoAwk2: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemTwoAwk2.start_time = '2020-10-20T06:00:00.000Z'
    dataSetItemTwoAwk2.name = Phases.AWAKE
    dataSetItemTwoAwk2.duration = 420000 // 7min in milliseconds

    const dataSetWithTwoAwk: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSetWithTwoAwk.push(dataSetItemTwoAwk)
    dataSetWithTwoAwk.push(dataSetItemTwoAwk2)

    // Sleep pattern data set with one night awakening.
    const dataSetItemOneAwk: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemOneAwk.start_time = '2020-10-21T04:00:00.000Z'
    dataSetItemOneAwk.name = Phases.AWAKE
    dataSetItemOneAwk.duration = 420000 // 7min milliseconds

    const dataSetItemOneAwk2: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemOneAwk2.start_time = '2020-10-21T05:00:00.000Z'
    dataSetItemOneAwk2.name = Phases.AWAKE
    dataSetItemOneAwk2.duration = 420000 // 7min in milliseconds

    const dataSetWithOneAwk: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSetWithOneAwk.push(dataSetItemOneAwk)
    dataSetWithOneAwk.push(dataSetItemOneAwk2)

    // Sleep pattern data set without night awakenings.
    const dataSetItemWithoutAwk: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemWithoutAwk.start_time = '2020-10-22T02:00:00.000Z'
    dataSetItemWithoutAwk.name = Phases.AWAKE
    dataSetItemWithoutAwk.duration = 420000 // 7min milliseconds

    const dataSetItemWithoutAwk2: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemWithoutAwk2.start_time = '2020-10-22T03:00:00.000Z'
    dataSetItemWithoutAwk2.name = Phases.AWAKE
    dataSetItemWithoutAwk2.duration = 420000 // 7min in milliseconds

    const dataSetWithoutAwk: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSetWithoutAwk.push(dataSetItemWithoutAwk)
    dataSetWithoutAwk.push(dataSetItemWithoutAwk2)

    // Sleep pattern data set for RPC timed out error.
    const dataSetItemRpcError: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemRpcError.start_time = '2020-10-01T03:00:00.000Z'
    dataSetItemRpcError.name = Phases.AWAKE
    dataSetItemRpcError.duration = 420000 // 7min milliseconds

    const dataSetRpcError: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSetRpcError.push(dataSetItemRpcError)

    // Mock Sleep objects.
    // Sleep with two night awakenings.
    const sleepWithTwoAwk: Sleep = new SleepMock()
    sleepWithTwoAwk.pattern!.data_set = dataSetWithTwoAwk

    // Sleep with one night awakening.
    const sleepWithOneAwk: Sleep = new SleepMock()
    sleepWithOneAwk.pattern!.data_set = dataSetWithOneAwk

    // Sleep without night awakenings.
    const sleepWithoutAwk: Sleep = new SleepMock()
    sleepWithoutAwk.night_awakening = undefined
    sleepWithoutAwk.pattern!.data_set = dataSetWithoutAwk

    const sleepRpcError: Sleep = new SleepMock()
    sleepRpcError.pattern!.data_set = dataSetRpcError

    // Starts DB connection and deletes all sleep.
    before(async () => {
        try {
            const mongoConfigs = Config.getMongoConfig()
            await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

            await deleteAllSleep()
        } catch (err) {
            throw new Error('Failure on NightAwakeningTask test: ' + err.message)
        }
    })

    // Deletes all sleep and stops DB connection.
    after(async () => {
        try {
            await deleteAllSleep()

            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on NightAwakeningTask test: ' + err.message)
        }
    })

    describe('calculateNightAwakening(sleep: Sleep)', () => {
        context('When night awakening is successfully calculated', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    const result = await sleepRepository.create(sleepWithTwoAwk)
                    sleepWithTwoAwk.id = result.id

                    const result2 = await sleepRepository.create(sleepWithOneAwk)
                    sleepWithOneAwk.id = result2.id

                    const result3 = await sleepRepository.create(sleepWithoutAwk)
                    sleepWithoutAwk.id = result3.id
                } catch (err) {
                    throw new Error('Failure on NightAwakeningTask test: ' + err.message)
                }
            })

            it('should return the Sleep updated with two night awakenings', async () => {
                const sleepUp: Sleep = await nightAwakeningTask.calculateNightAwakening(sleepWithTwoAwk)
                expect(sleepUp.night_awakening?.length).to.eql(2)
                expect(sleepUp.night_awakening![0].start_time).to.eql('01:00:00')
                expect(sleepUp.night_awakening![0].end_time).to.eql('01:07:00')
                expect(sleepUp.night_awakening![0].steps).to.eql(7)
                expect(sleepUp.night_awakening![1].start_time).to.eql('03:00:00')
                expect(sleepUp.night_awakening![1].end_time).to.eql('03:07:00')
                expect(sleepUp.night_awakening![1].steps).to.eql(7)
            })

            it('should return the Sleep updated with one night awakening', async () => {
                const sleepUp: Sleep = await nightAwakeningTask.calculateNightAwakening(sleepWithOneAwk)
                expect(sleepUp.night_awakening?.length).to.eql(1)
                expect(sleepUp.night_awakening![0].start_time).to.eql('01:00:00')
                expect(sleepUp.night_awakening![0].end_time).to.eql('01:07:00')
                expect(sleepUp.night_awakening![0].steps).to.eql(7)
            })

            it('should return the Sleep without night awakenings', async () => {
                const sleepUp: Sleep = await nightAwakeningTask.calculateNightAwakening(sleepWithoutAwk)
                expect(sleepUp.night_awakening).to.be.undefined
            })
        })

        context('When night awakening is not successfully calculated', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    const result = await sleepRepository.create(sleepRpcError)
                    sleepRpcError.id = result.id
                } catch (err) {
                    throw new Error('Failure on NightAwakeningTask test: ' + err.message)
                }
            })

            it('should return a rpc timed out error', async () => {
                try {
                    const sleepUp: Sleep = await nightAwakeningTask.calculateNightAwakening(sleepRpcError)
                    expect(sleepUp.night_awakening).to.be.undefined
                } catch (err) {
                    expect(err.message).to.eql('rpc timed out')
                }
            })
        })
    })
})

async function deleteAllSleep() {
    return SleepRepoModel.deleteMany({})
}
