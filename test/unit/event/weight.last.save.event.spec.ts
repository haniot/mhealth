import { assert } from 'chai'
import { EventType } from '../../../src/application/integration-event/event/integration.event'
import { WeightLastSaveEvent } from '../../../src/application/integration-event/event/weight.last.save.event'
import { WeightMock } from '../../mocks/models/weight.mock'

describe('Event: WeightLastSaveEvent', () => {
    context('construct', () => {
        it('should attributes must have default values', () => {
            const obj = new WeightLastSaveEvent()
            assert.propertyVal(obj, 'event_name', WeightLastSaveEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', undefined)
            assert.propertyVal(obj, 'weight', undefined)
        })

        it('should attributes must have values passed as parameter', () => {
            const timestamp = new Date()
            const weight = new WeightMock()
            const obj = new WeightLastSaveEvent(timestamp, weight)
            assert.propertyVal(obj, 'event_name', WeightLastSaveEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'weight', weight)
        })
    })

    context('toJSON', () => {
        it('should return empty object when there is no weight attribute', () => {
            const obj = new WeightLastSaveEvent().toJSON()
            assert.isEmpty(obj)
        })

        it('should return the object with the attributes populated', () => {
            const timestamp = new Date()
            const weight = new WeightMock()
            const obj = new WeightLastSaveEvent(timestamp, weight).toJSON()
            assert.propertyVal(obj, 'event_name', WeightLastSaveEvent.NAME)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.deepEqual(obj.weight, weight.toJSON())
        })
    })
})
