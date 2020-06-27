import { assert } from 'chai'
import { EventType } from '../../../src/application/integration-event/event/integration.event'
import { WeightSyncEvent } from '../../../src/application/integration-event/event/weight.sync.event'
import { Weight } from '../../../src/application/domain/model/weight'
import { MeasurementUnits } from '../../../src/application/domain/utils/measurement.units'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'

describe('Event: WeightSyncEvent', () => {

    context('construct', () => {
        it('should attributes must have default values', () => {
            const obj = new WeightSyncEvent()
            assert.propertyVal(obj, 'event_name', WeightSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', undefined)
            assert.propertyVal(obj, 'weight', undefined)
        })

        it('should attributes must have values ​​passed as parameter', () => {
            let timestamp = new Date()
            const weight = defaultWeights[0]
            let obj = new WeightSyncEvent(timestamp, weight)
            assert.propertyVal(obj, 'event_name', WeightSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'weight', weight)

            timestamp = new Date()
            const weights = defaultWeights
            obj = new WeightSyncEvent(timestamp, weights)
            assert.propertyVal(obj, 'event_name', WeightSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.propertyVal(obj, 'weight', weights)
        })
    })

    context('toJSON', () => {
        it('should return empty object when there is no weight attribute', () => {
            const obj = new WeightSyncEvent().toJSON()
            assert.isEmpty(obj)
        })

        it('should return the object with the attributes populated', () => {
            let timestamp = new Date()
            const weight = defaultWeights[1]
            let obj = new WeightSyncEvent(timestamp, weight).toJSON()
            assert.propertyVal(obj, 'event_name', WeightSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.deepEqual(obj.weight, weight.toJSON())

            timestamp = new Date()
            const weights = defaultWeights
            obj = new WeightSyncEvent(timestamp, weights).toJSON()
            assert.propertyVal(obj, 'event_name', WeightSyncEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.MEASUREMENT)
            assert.propertyVal(obj, 'timestamp', timestamp)
            assert.deepEqual(obj.weight[0], weights[0].toJSON())
            assert.deepEqual(obj.weight[1], weights[1].toJSON())
        })
    })
})

const defaultWeights = [
    new Weight().fromJSON(
        {
            id: '5cb4882751b5f21ba364ba6f',
            value: 70.6,
            body_fat: 45.8,
            unit: MeasurementUnits.WEIGHT,
            type: MeasurementTypes.WEIGHT,
            timestamp: new Date().toISOString(),
            patient_id: '5a62be07d6f33400146c9b61'
        }
    ),
    new Weight().fromJSON(
        {
            id: '5cb4882751b5f21ba364ba7b',
            value: 50,
            body_fat: 20,
            unit: MeasurementUnits.WEIGHT,
            type: MeasurementTypes.WEIGHT,
            timestamp: new Date().toISOString(),
            patient_id: '5a62be07d6f33400146c9b61'
        }
    )
]
