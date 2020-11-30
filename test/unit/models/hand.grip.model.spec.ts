import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { HandGrip } from '../../../src/application/domain/model/hand.grip'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'

describe('MODELS: HandGrip', () => {
    const handGripJSON: any = DefaultEntityMock.HAND_GRIP

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a HandGrip from a complete json', () => {
                const result: HandGrip = new HandGrip().fromJSON(handGripJSON)

                assert.propertyVal(result, 'id', handGripJSON.id)
                assert.propertyVal(result, 'type', handGripJSON.type)
                assert.propertyVal(result, 'value', handGripJSON.value)
                assert.propertyVal(result, 'unit', handGripJSON.unit)
                assert.propertyVal(result, 'timestamp', handGripJSON.timestamp)
                assert.propertyVal(result, 'device_id', handGripJSON.device_id)
                assert.propertyVal(result, 'patient_id', handGripJSON.patient_id)
            })

            it('should return a HandGrip with some attributes equal to undefined from an empty json', () => {
                const result: HandGrip = new HandGrip().fromJSON({})

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.HAND_GRIP)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a HandGrip with some attributes equal to undefined from an undefined json', () => {
                const result: HandGrip = new HandGrip().fromJSON(undefined)

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.HAND_GRIP)
            })
        })

        context('when the json is a string', () => {
            it('should return a HandGrip from a complete json', () => {
                const result: HandGrip = new HandGrip().fromJSON(JSON.stringify(handGripJSON))

                assert.propertyVal(result, 'id', handGripJSON.id)
                assert.propertyVal(result, 'type', handGripJSON.type)
                assert.propertyVal(result, 'value', handGripJSON.value)
                assert.propertyVal(result, 'unit', handGripJSON.unit)
                assert.propertyVal(result, 'timestamp', handGripJSON.timestamp)
                assert.propertyVal(result, 'device_id', handGripJSON.device_id)
                assert.propertyVal(result, 'patient_id', handGripJSON.patient_id)
            })

            it('should return a HandGrip with some attributes equal to undefined from an empty string', () => {
                const result: HandGrip = new HandGrip().fromJSON(JSON.stringify(''))

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.HAND_GRIP)
            })

            it('should return a HandGrip with some attributes equal to undefined from an invalid string', () => {
                const result: HandGrip = new HandGrip().fromJSON('d52215d412')

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.HAND_GRIP)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete HandGrip', () => {
                const handGrip: HandGrip = new HandGrip().fromJSON(handGripJSON)
                const result: any = handGrip.toJSON()

                assert.propertyVal(result, 'id', handGripJSON.id)
                assert.propertyVal(result, 'timestamp', handGripJSON.timestamp)
                assert.propertyVal(result, 'type', handGripJSON.type)
                assert.propertyVal(result, 'value', handGripJSON.value)
                assert.propertyVal(result, 'unit', handGripJSON.unit)
                assert.propertyVal(result, 'device_id', handGripJSON.device_id)
                assert.propertyVal(result, 'patient_id', handGripJSON.patient_id)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete HandGrip', () => {
                const result: any = new HandGrip().toJSON()

                assert.isUndefined(result.id)
                assert.isUndefined(result.timestamp)
                assert.propertyVal(result, 'type', MeasurementTypes.HAND_GRIP)
                assert.isUndefined(result.value)
                assert.isUndefined(result.unit)
                assert.isUndefined(result.device_id)
                assert.isUndefined(result.patient_id)
            })
        })
    })
})
