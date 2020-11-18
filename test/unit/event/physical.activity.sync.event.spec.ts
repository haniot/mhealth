import { assert } from 'chai'
import { PhysicalActivitySyncEvent } from '../../../src/application/integration-event/event/physical.activity.sync.event'
import { EventType } from '../../../src/application/integration-event/event/integration.event'
import { PhysicalActivityMock } from '../../mocks/models/physical.activity.mock'

describe('Event: PhysicalActivitySyncEvent', () => {
    context('construct', () => {
        it('should attributes must have default values', () => {
            const obj = new PhysicalActivitySyncEvent()
            assert.propertyVal(obj, 'event_name', PhysicalActivitySyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', undefined)
            assert.propertyVal(obj, 'physical_activity', undefined)
        })

        it('should attributes must have values passed as parameter', () => {
            let timestamp = new Date()
            const activity = new PhysicalActivityMock()
            let obj = new PhysicalActivitySyncEvent(timestamp, activity)
            assert.propertyVal(obj, 'event_name', PhysicalActivitySyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'physical_activity', activity)

            timestamp = new Date()
            const activities = [new PhysicalActivityMock(), new PhysicalActivityMock()]
            obj = new PhysicalActivitySyncEvent(timestamp, activities)
            assert.propertyVal(obj, 'event_name', PhysicalActivitySyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'physical_activity', activities)
        })
    })

    context('toJSON', () => {
        it('should return empty object when there is no physical_activity attribute', () => {
            const obj = new PhysicalActivitySyncEvent().toJSON()
            assert.isEmpty(obj)
        })

        it('should return the object with the attributes populated', () => {
            let timestamp = new Date()
            const activity = new PhysicalActivityMock()
            let obj = new PhysicalActivitySyncEvent(timestamp, activity).toJSON()
            assert.propertyVal(obj, 'event_name', PhysicalActivitySyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.deepEqual(obj.physical_activity, activity.toJSON())

            timestamp = new Date()
            const activities = [new PhysicalActivityMock(), new PhysicalActivityMock()]
            obj = new PhysicalActivitySyncEvent(timestamp, activities).toJSON()
            assert.propertyVal(obj, 'event_name', PhysicalActivitySyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.ACTIVITY)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.deepEqual(obj.physical_activity[0], activities[0].toJSON())
            assert.deepEqual(obj.physical_activity[1], activities[1].toJSON())
        })
    })
})
