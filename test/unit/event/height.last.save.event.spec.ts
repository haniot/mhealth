import { assert } from 'chai'
import { EventType } from '../../../src/application/integration-event/event/integration.event'
import { HeightLastSaveEvent } from '../../../src/application/integration-event/event/height.last.save.event'
import { HeightMock } from '../../mocks/models/height.mock'

describe('Event: HeightLastSaveEvent', () => {
    context('construct', () => {
        it('should attributes must have default values', () => {
            const obj = new HeightLastSaveEvent()
            assert.propertyVal(obj, 'event_name', HeightLastSaveEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', undefined)
            assert.propertyVal(obj, 'height', undefined)
        })

        it('should attributes must have values passed as parameter', () => {
            let timestamp = new Date()
            const height = new HeightMock()
            let obj = new HeightLastSaveEvent(timestamp, height)
            assert.propertyVal(obj, 'event_name', HeightLastSaveEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'height', height)
        })
    })

    context('toJSON', () => {
        it('should return empty object when there is no height attribute', () => {
            const obj = new HeightLastSaveEvent().toJSON()
            assert.isEmpty(obj)
        })

        it('should return the object with the attributes populated', () => {
            let timestamp = new Date()
            const height = new HeightMock()
            let obj = new HeightLastSaveEvent(timestamp, height).toJSON()
            assert.propertyVal(obj, 'event_name', HeightLastSaveEvent.NAME)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.deepEqual(obj.height, height.toJSON())
        })
    })
})
