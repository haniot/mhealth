import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { LastMeasurements } from '../../../src/application/domain/model/last.measurements'
import { BloodGlucose } from '../../../src/application/domain/model/blood.glucose'
import { BloodPressure } from '../../../src/application/domain/model/blood.pressure'
import { WaistCircumference } from '../../../src/application/domain/model/waist.circumference'
import { BodyTemperature } from '../../../src/application/domain/model/body.temperature'
import { BodyFat } from '../../../src/application/domain/model/body.fat'
import { Height } from '../../../src/application/domain/model/height'
import { Weight } from '../../../src/application/domain/model/weight'
import { HandGrip } from '../../../src/application/domain/model/hand.grip'
import { CalfCircumference } from '../../../src/application/domain/model/calf.circumference'

const bloodGlucose: BloodGlucose = new BloodGlucose().fromJSON(DefaultEntityMock.BLOOD_GLUCOSE)
const height: Height = new Height().fromJSON(DefaultEntityMock.HEIGHT)
const weight: Weight = new Weight().fromJSON(DefaultEntityMock.WEIGHT)
const waist: WaistCircumference = new WaistCircumference().fromJSON(DefaultEntityMock.WAIST_CIRCUMFERENCE)
const bodyFat: BodyFat = new BodyFat().fromJSON(DefaultEntityMock.BODY_FAT)
const bloodPressure: BloodPressure = new BloodPressure().fromJSON(DefaultEntityMock.BLOOD_PRESSURE)
const bodyTemperature: BodyTemperature = new BodyTemperature().fromJSON(DefaultEntityMock.BODY_TEMPERATURE)
const handGrip: HandGrip = new HandGrip().fromJSON(DefaultEntityMock.HAND_GRIP)
const calfCircumference: CalfCircumference = new CalfCircumference().fromJSON(DefaultEntityMock.CALF_CIRCUMFERENCE)

describe('Models: LastMeasurements', () => {
    describe('fromJSON()', () => {
        context('when convert json to model', () => {
            it('should return a model with json parameters', () => {
                const result = new LastMeasurements().fromJSON(DefaultEntityMock.LAST_MEASUREMENTS)
                assert.deepPropertyVal(result, 'blood_glucose', bloodGlucose)
                assert.deepPropertyVal(result, 'height', height)
                assert.deepPropertyVal(result, 'weight', weight)
                assert.deepPropertyVal(result, 'waist_circumference', waist)
                assert.deepPropertyVal(result, 'body_fat', bodyFat)
                assert.deepPropertyVal(result, 'blood_pressure', bloodPressure)
                assert.deepPropertyVal(result, 'body_temperature', bodyTemperature)
                assert.deepPropertyVal(result, 'hand_grip', handGrip)
                assert.deepPropertyVal(result, 'calf_circumference', calfCircumference)
            })
        })

        context('when convert a string json to model', () => {
            it('should return a model with set parameters', () => {
                const result = new LastMeasurements().fromJSON(JSON.stringify(DefaultEntityMock.LAST_MEASUREMENTS))
                assert.deepPropertyVal(result, 'blood_glucose', bloodGlucose)
                assert.deepPropertyVal(result, 'height', height)
                assert.deepPropertyVal(result, 'weight', weight)
                assert.deepPropertyVal(result, 'waist_circumference', waist)
                assert.deepPropertyVal(result, 'body_fat', bodyFat)
                assert.deepPropertyVal(result, 'blood_pressure', bloodPressure)
                assert.deepPropertyVal(result, 'body_temperature', bodyTemperature)
                assert.deepPropertyVal(result, 'hand_grip', handGrip)
                assert.deepPropertyVal(result, 'calf_circumference', calfCircumference)
            })
        })

        context('when pass a empty string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new LastMeasurements().fromJSON('')

                assert.isUndefined(result.id)
            })
        })

        context('when pass a invalid string json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new LastMeasurements().fromJSON('invalid')

                assert.isUndefined(result.id)
            })
        })

        context('when pass a undefined json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new LastMeasurements().fromJSON(undefined)

                assert.isUndefined(result.id)
            })
        })

        context('when pass a empty json', () => {
            it('should return a model with undefined parameters', () => {
                const result = new LastMeasurements().fromJSON({})

                assert.isUndefined(result.id)
            })
        })
    })

    describe('toJSON()', () => {
        context('when covert model to json', () => {
            it('should return a json with model parameters', () => {
                const measurement = new LastMeasurements().fromJSON(DefaultEntityMock.LAST_MEASUREMENTS)
                const result = measurement.toJSON()
                assert.deepPropertyVal(result, 'blood_glucose', bloodGlucose.toJSON())
                assert.deepPropertyVal(result, 'height', height.toJSON())
                assert.deepPropertyVal(result, 'weight', weight.toJSON())
                assert.deepPropertyVal(result, 'waist_circumference', waist.toJSON())
                assert.deepPropertyVal(result, 'body_fat', bodyFat.toJSON())
                assert.deepPropertyVal(result, 'blood_pressure', bloodPressure.toJSON())
                assert.deepPropertyVal(result, 'body_temperature', bodyTemperature.toJSON())
                assert.deepPropertyVal(result, 'hand_grip', handGrip.toJSON())
                assert.deepPropertyVal(result, 'calf_circumference', calfCircumference.toJSON())
            })
        })

        context('when the model does not have defined parameters', () => {
            it('should return json with undefined parameters', () => {
                const result = new LastMeasurements().toJSON()
                assert.deepPropertyVal(result, 'blood_glucose', {})
                assert.deepPropertyVal(result, 'height', {})
                assert.deepPropertyVal(result, 'weight', {})
                assert.deepPropertyVal(result, 'waist_circumference', {})
                assert.deepPropertyVal(result, 'body_fat', {})
                assert.deepPropertyVal(result, 'blood_pressure', {})
                assert.deepPropertyVal(result, 'body_temperature', {})
                assert.deepPropertyVal(result, 'hand_grip', {})
                assert.deepPropertyVal(result, 'calf_circumference', {})
            })
        })
    })
})
