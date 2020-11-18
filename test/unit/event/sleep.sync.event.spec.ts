import { assert } from 'chai'
import { EventType } from '../../../src/application/integration-event/event/integration.event'
import { SleepSyncEvent } from '../../../src/application/integration-event/event/sleep.sync.event'
import { SleepMock } from '../../mocks/models/sleep.mock'

describe('Event: SleepSyncEvent', () => {
    context('construct', () => {
        it('should attributes must have default values', () => {
            const obj = new SleepSyncEvent()
            assert.propertyVal(obj, 'event_name', SleepSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', undefined)
            assert.propertyVal(obj, 'sleep', undefined)
        })

        it('should attributes must have values passed as parameter', () => {
            let timestamp = new Date()
            const sleep = new SleepMock()
            let obj = new SleepSyncEvent(timestamp, sleep)
            assert.propertyVal(obj, 'event_name', SleepSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'sleep', sleep)

            timestamp = new Date()
            const sleepList = [new SleepMock(), new SleepMock()]
            obj = new SleepSyncEvent(timestamp, sleepList)
            assert.propertyVal(obj, 'event_name', SleepSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'sleep', sleepList)
        })
    })

    context('toJSON', () => {
        it('should return empty object when there is no sleep attribute', () => {
            const obj = new SleepSyncEvent().toJSON()
            assert.isEmpty(obj)
        })

        it('should return the object with the attributes populated', () => {
            let timestamp = new Date()
            const sleep = new SleepMock()
            let obj = new SleepSyncEvent(timestamp, sleep).toJSON()
            assert.propertyVal(obj, 'event_name', SleepSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.deepEqual(obj.sleep, sleep.toJSON())

            timestamp = new Date()
            const sleepList = [new SleepMock(), new SleepMock()]
            obj = new SleepSyncEvent(timestamp, sleepList).toJSON()
            assert.propertyVal(obj, 'event_name', SleepSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.deepEqual(obj.sleep[0], sleepList[0].toJSON())
            assert.deepEqual(obj.sleep[1], sleepList[1].toJSON())
        })
    })
})
