import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { Config } from '../../../src/utils/config'
import { SleepRepoModel } from '../../../src/infrastructure/database/schema/sleep.schema'
import { IEventBus } from '../../../src/infrastructure/port/event.bus.interface'
import { EventBusRabbitMQMock } from '../../mocks/eventbus/eventbus.rabbitmq.mock'
import { ConnectionRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { ConnectionFactoryRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { AwakeningsTask } from '../../../src/background/task/awakenings.task'
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
const awakeningsTask: AwakeningsTask = new AwakeningsTask(eventBus, sleepRepository, DIContainer.get(Identifier.LOGGER))

describe('AWAKENINGS TASK', () => {
    // Mock pattern.data_set objects.
    // Sleep pattern data set with two awakenings.
    const dataSetItemTwoAwk: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemTwoAwk.start_time = '2020-10-20T04:00:00.000Z'
    dataSetItemTwoAwk.name = Phases.AWAKE
    dataSetItemTwoAwk.duration = 420000 // 7 min in milliseconds.

    const dataSetItemTwoAwk2: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemTwoAwk2.start_time = '2020-10-20T06:00:00.000Z'
    dataSetItemTwoAwk2.name = Phases.AWAKE
    dataSetItemTwoAwk2.duration = 420000

    const dataSetWithTwoAwk: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSetWithTwoAwk.push(dataSetItemTwoAwk)
    dataSetWithTwoAwk.push(dataSetItemTwoAwk2)

    // Sleep pattern data set with one awakening.
    const dataSetItemOneAwk: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemOneAwk.start_time = '2020-10-21T04:00:00.000Z'
    dataSetItemOneAwk.name = Phases.AWAKE
    dataSetItemOneAwk.duration = 420000

    const dataSetItemOneAwk2: SleepPatternDataSet = new SleepPatternDataSet()
    // It does not enter into the calculation because it does not have at least 7 steps at this time.
    dataSetItemOneAwk2.start_time = '2020-10-21T05:00:00.000Z'
    dataSetItemOneAwk2.name = Phases.AWAKE
    dataSetItemOneAwk2.duration = 420000

    const dataSetWithOneAwk: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSetWithOneAwk.push(dataSetItemOneAwk)
    dataSetWithOneAwk.push(dataSetItemOneAwk2)

    // Sleep pattern data set without awakenings (type other than AWAKE and duration less than 7 minutes).
    const dataSetItemWithoutAwk: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemWithoutAwk.start_time = '2020-10-20T04:00:00.000Z'
    // It does not enter into the calculation because the type is different from AWAKE.
    dataSetItemWithoutAwk.name = Phases.ASLEEP
    dataSetItemWithoutAwk.duration = 420000

    const dataSetItemWithoutAwk2: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemWithoutAwk2.start_time = '2020-10-20T06:00:00.000Z'
    dataSetItemWithoutAwk2.name = Phases.AWAKE
    // It does not enter into the calculation because the duration is less than 7 minutes.
    dataSetItemWithoutAwk2.duration = 419999

    const dataSetWithoutAwk: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSetWithoutAwk.push(dataSetItemWithoutAwk)
    dataSetWithoutAwk.push(dataSetItemWithoutAwk2)

    // Sleep pattern data set without awakenings (hour < 18 or >= 6).
    const otherDataSetItemWithoutAwk: SleepPatternDataSet = new SleepPatternDataSet()
    otherDataSetItemWithoutAwk.start_time = '2020-10-20T20:00:00.000Z'
    otherDataSetItemWithoutAwk.name = Phases.AWAKE
    otherDataSetItemWithoutAwk.duration = 420000

    const otherDataSetItemWithoutAwk2: SleepPatternDataSet = new SleepPatternDataSet()
    otherDataSetItemWithoutAwk2.start_time = '2020-10-20T09:00:00.000Z'
    otherDataSetItemWithoutAwk2.name = Phases.AWAKE
    otherDataSetItemWithoutAwk2.duration = 420000

    const otherDataSetWithoutAwk: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    otherDataSetWithoutAwk.push(otherDataSetItemWithoutAwk)
    otherDataSetWithoutAwk.push(otherDataSetItemWithoutAwk2)

    // Sleep pattern data set for RPC timed out error.
    const dataSetItemRpcError: SleepPatternDataSet = new SleepPatternDataSet()
    dataSetItemRpcError.start_time = '2020-10-01T03:00:00.000Z'
    dataSetItemRpcError.name = Phases.AWAKE
    dataSetItemRpcError.duration = 420000 // 7min milliseconds

    const dataSetRpcError: Array<SleepPatternDataSet> = new Array<SleepPatternDataSet>()
    dataSetRpcError.push(dataSetItemRpcError)

    // Mock Sleep objects.
    // Sleep with two awakenings.
    const sleepWithTwoAwk: Sleep = new SleepMock()
    sleepWithTwoAwk.pattern!.data_set = dataSetWithTwoAwk

    // Sleep with one awakening.
    const sleepWithOneAwk: Sleep = new SleepMock()
    sleepWithOneAwk.pattern!.data_set = dataSetWithOneAwk

    // Sleep without awakenings.
    const sleepWithoutAwk: Sleep = new SleepMock()
    sleepWithoutAwk.awakenings = undefined
    sleepWithoutAwk.pattern!.data_set = dataSetWithoutAwk

    // Other Sleep without awakenings.
    const otherSleepWithoutAwk: Sleep = new SleepMock()
    otherSleepWithoutAwk.awakenings = undefined
    otherSleepWithoutAwk.pattern!.data_set = otherDataSetWithoutAwk

    const sleepRpcError: Sleep = new SleepMock()
    sleepRpcError.pattern!.data_set = dataSetRpcError

    // Starts DB connection and deletes all sleep.
    before(async () => {
        try {
            const mongoConfigs = Config.getMongoConfig()
            await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

            await deleteAllSleep()
        } catch (err) {
            throw new Error('Failure on AwakeningsTask test: ' + err.message)
        }
    })

    // Deletes all sleep and stops DB connection.
    after(async () => {
        try {
            await deleteAllSleep()

            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on AwakeningsTask test: ' + err.message)
        }
    })

    describe('calculateAwakenings(sleep: Sleep)', () => {
        context('When awakenings are successfully calculated', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    const result = await sleepRepository.create(sleepWithTwoAwk)
                    sleepWithTwoAwk.id = result?.id

                    const result2 = await sleepRepository.create(sleepWithOneAwk)
                    sleepWithOneAwk.id = result2?.id

                    const result3 = await sleepRepository.create(sleepWithoutAwk)
                    sleepWithoutAwk.id = result3?.id

                    const result4 = await sleepRepository.create(otherSleepWithoutAwk)
                    otherSleepWithoutAwk.id = result4?.id
                } catch (err) {
                    throw new Error('Failure on AwakeningsTask test: ' + err.message)
                }
            })

            it('should return the Sleep updated with two awakenings', async () => {
                const sleepUp: Sleep = await awakeningsTask.calculateAwakenings(sleepWithTwoAwk)
                expect(sleepUp.awakenings?.length).to.eql(2)
                expect(sleepUp.awakenings![0].start_time).to.eql('01:00:00')
                expect(sleepUp.awakenings![0].end_time).to.eql('01:07:00')
                expect(sleepUp.awakenings![0].duration).to.eql(420000)
                expect(sleepUp.awakenings![0].steps).to.eql(7)
                expect(sleepUp.awakenings![1].start_time).to.eql('03:00:00')
                expect(sleepUp.awakenings![1].end_time).to.eql('03:07:00')
                expect(sleepUp.awakenings![1].duration).to.eql(420000)
                expect(sleepUp.awakenings![1].steps).to.eql(7)
            })

            it('should return the Sleep updated with one awakening', async () => {
                const sleepUp: Sleep = await awakeningsTask.calculateAwakenings(sleepWithOneAwk)
                expect(sleepUp.awakenings?.length).to.eql(1)
                expect(sleepUp.awakenings![0].start_time).to.eql('01:00:00')
                expect(sleepUp.awakenings![0].end_time).to.eql('01:07:00')
                expect(sleepUp.awakenings![0].duration).to.eql(420000)
                expect(sleepUp.awakenings![0].steps).to.eql(7)
            })

            it('should return the Sleep without awakenings (type other than AWAKE or duration less than 7 minutes)',
                async () => {
                    const sleepUp: Sleep = await awakeningsTask.calculateAwakenings(sleepWithoutAwk)
                    expect(sleepUp.awakenings).to.be.undefined
                })

            it('should return the Sleep without awakenings (hour < 18 or >= 6)', async () => {
                const sleepUp: Sleep = await awakeningsTask.calculateAwakenings(otherSleepWithoutAwk)
                expect(sleepUp.awakenings).to.be.undefined
            })
        })

        context('When awakenings are not successfully calculated', () => {
            before(async () => {
                try {
                    await deleteAllSleep()

                    const result = await sleepRepository.create(sleepRpcError)
                    sleepRpcError.id = result?.id
                } catch (err) {
                    throw new Error('Failure on AwakeningsTask test: ' + err.message)
                }
            })

            it('should return a rpc timed out error', async () => {
                try {
                    const sleepUp: Sleep = await awakeningsTask.calculateAwakenings(sleepRpcError)
                    expect(sleepUp.awakenings).to.be.undefined
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
