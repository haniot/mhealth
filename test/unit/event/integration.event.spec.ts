import { assert } from 'chai'
import { IntegrationEvent } from '../../../src/application/integration-event/event/integration.event'

describe('Event: IntegrationEvent', () => {
    context('construct', () => {
        it('should attributes must have default values', () => {
            const obj = new IntegrationEventTest('EventName', 'EventType')
            assert.propertyVal(obj, 'event_name', 'EventName')
            assert.propertyVal(obj, 'type', 'EventType')
            assert.propertyVal(obj, 'timestamp', undefined)
        })

        it('should attributes must have values ​​passed as parameter', () => {
            const timestamp = new Date()
            const obj = new IntegrationEventTest('EventName', 'EventType', timestamp)
            assert.propertyVal(obj, 'event_name', 'EventName')
            assert.propertyVal(obj, 'type', 'EventType')
            assert.propertyVal(obj, 'timestamp', timestamp)
        })
    })

    context('toJSON', () => {
        it('should attributes must have default values', () => {
            const obj = new IntegrationEventTest('EventName', 'EventType').toJSON()
            assert.propertyVal(obj, 'event_name', 'EventName')
            assert.propertyVal(obj, 'type', 'EventType')
            assert.propertyVal(obj, 'timestamp', undefined)
        })

        it('should return the object with the attributes populated', () => {
            const timestamp = new Date()
            const obj = new IntegrationEventTest('EventName', 'EventType', timestamp).toJSON()
            assert.propertyVal(obj, 'event_name', 'EventName')
            assert.propertyVal(obj, 'type', 'EventType')
            assert.propertyVal(obj, 'timestamp', timestamp)
        })
    })
})

export class IntegrationEventTest extends IntegrationEvent<any> {

}
