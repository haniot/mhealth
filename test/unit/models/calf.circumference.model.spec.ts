import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { CalfCircumference } from '../../../src/application/domain/model/calf.circumference'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'

describe('MODELS: CalfCircumference', () => {
    const calfCircumferenceJSON: any = DefaultEntityMock.CALF_CIRCUMFERENCE

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a CalfCircumference from a complete json', () => {
                const result: CalfCircumference = new CalfCircumference().fromJSON(calfCircumferenceJSON)

                assert.propertyVal(result, 'id', calfCircumferenceJSON.id)
                assert.propertyVal(result, 'type', calfCircumferenceJSON.type)
                assert.propertyVal(result, 'value', calfCircumferenceJSON.value)
                assert.propertyVal(result, 'unit', calfCircumferenceJSON.unit)
                assert.propertyVal(result, 'timestamp', calfCircumferenceJSON.timestamp)
                assert.propertyVal(result, 'device_id', calfCircumferenceJSON.device_id)
                assert.propertyVal(result, 'patient_id', calfCircumferenceJSON.patient_id)
                assert.propertyVal(result, 'leg', calfCircumferenceJSON.leg)
            })

            it('should return a CalfCircumference with some attributes equal to undefined from an empty json', () => {
                const result: CalfCircumference = new CalfCircumference().fromJSON({})

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.CALF_CIRCUMFERENCE)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a CalfCircumference with some attributes equal to undefined from an undefined json', () => {
                const result: CalfCircumference = new CalfCircumference().fromJSON(undefined)

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.CALF_CIRCUMFERENCE)
            })
        })

        context('when the json is a string', () => {
            it('should return a CalfCircumference from a complete json', () => {
                const result: CalfCircumference = new CalfCircumference().fromJSON(JSON.stringify(calfCircumferenceJSON))

                assert.propertyVal(result, 'id', calfCircumferenceJSON.id)
                assert.propertyVal(result, 'type', calfCircumferenceJSON.type)
                assert.propertyVal(result, 'value', calfCircumferenceJSON.value)
                assert.propertyVal(result, 'unit', calfCircumferenceJSON.unit)
                assert.propertyVal(result, 'timestamp', calfCircumferenceJSON.timestamp)
                assert.propertyVal(result, 'device_id', calfCircumferenceJSON.device_id)
                assert.propertyVal(result, 'patient_id', calfCircumferenceJSON.patient_id)
                assert.propertyVal(result, 'leg', calfCircumferenceJSON.leg)
            })

            it('should return a CalfCircumference with some attributes equal to undefined from an empty string', () => {
                const result: CalfCircumference = new CalfCircumference().fromJSON(JSON.stringify(''))

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.CALF_CIRCUMFERENCE)
            })

            it('should return a CalfCircumference with some attributes equal to undefined from an invalid string', () => {
                const result: CalfCircumference = new CalfCircumference().fromJSON('d52215d412')

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.CALF_CIRCUMFERENCE)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete CalfCircumference', () => {
                const calfCircumference: CalfCircumference = new CalfCircumference().fromJSON(calfCircumferenceJSON)
                const result: any = calfCircumference.toJSON()

                assert.propertyVal(result, 'id', calfCircumferenceJSON.id)
                assert.propertyVal(result, 'timestamp', calfCircumferenceJSON.timestamp)
                assert.propertyVal(result, 'type', calfCircumferenceJSON.type)
                assert.propertyVal(result, 'value', calfCircumferenceJSON.value)
                assert.propertyVal(result, 'unit', calfCircumferenceJSON.unit)
                assert.propertyVal(result, 'device_id', calfCircumferenceJSON.device_id)
                assert.propertyVal(result, 'patient_id', calfCircumferenceJSON.patient_id)
                assert.propertyVal(result, 'leg', calfCircumferenceJSON.leg)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete CalfCircumference', () => {
                const result: any = new CalfCircumference().toJSON()

                assert.isUndefined(result.id)
                assert.isUndefined(result.timestamp)
                assert.propertyVal(result, 'type', MeasurementTypes.CALF_CIRCUMFERENCE)
                assert.isUndefined(result.value)
                assert.isUndefined(result.unit)
                assert.isUndefined(result.device_id)
                assert.isUndefined(result.patient_id)
                assert.isUndefined(result.leg)
            })
        })
    })
})
