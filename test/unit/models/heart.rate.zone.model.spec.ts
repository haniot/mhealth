import { assert } from 'chai'
import { HeartRateZone } from '../../../src/application/domain/model/heart.rate.zone'
import { HeartRateZoneData } from '../../../src/application/domain/model/heart.rate.zone.data'

describe('Models: HeartRateZone', () => {
    const HeartRateZoneJSON: any = {
        out_of_range: {
            min: 30,
            max: 91,
            duration: 0
        },
        fat_burn: {
            min: 91,
            max: 127,
            duration: 10
        },
        cardio: {
            min: 127,
            max: 154,
            duration: 0
        },
        peak: {
            min: 154,
            max: 220,
            duration: 0
        }
    }

    describe('fromJSON(json: any)', () => {
        context('when the json is correct', () => {
            it('should return an PhysicalActivityHeartRate model', () => {
                const result = new HeartRateZone().fromJSON(HeartRateZoneJSON)
                assert.deepPropertyVal(result, 'out_of_range', new HeartRateZoneData().fromJSON(HeartRateZoneJSON.out_of_range))
                assert.deepPropertyVal(result, 'fat_burn', new HeartRateZoneData().fromJSON(HeartRateZoneJSON.fat_burn))
                assert.deepPropertyVal(result, 'cardio', new HeartRateZoneData().fromJSON(HeartRateZoneJSON.cardio))
                assert.deepPropertyVal(result, 'peak', new HeartRateZoneData().fromJSON(HeartRateZoneJSON.peak))
            })
        })

        context('when the json is undefined', () => {
            it('should return an PhysicalActivityHeartRate model with all attributes with undefined value', () => {
                const result = new HeartRateZone().fromJSON(undefined)
                assert.isUndefined(result.out_of_range)
                assert.isUndefined(result.fat_burn)
                assert.isUndefined(result.cardio)
                assert.isUndefined(result.peak)
            })
        })

        context('when the json is a string', () => {
            it('should transform the string in json and return PhysicalActivityHeartRate model', () => {
                const result = new HeartRateZone().fromJSON(JSON.stringify(HeartRateZoneJSON))
                assert.deepPropertyVal(result, 'out_of_range', new HeartRateZoneData().fromJSON(HeartRateZoneJSON.out_of_range))
                assert.deepPropertyVal(result, 'fat_burn', new HeartRateZoneData().fromJSON(HeartRateZoneJSON.fat_burn))
                assert.deepPropertyVal(result, 'cardio', new HeartRateZoneData().fromJSON(HeartRateZoneJSON.cardio))
                assert.deepPropertyVal(result, 'peak', new HeartRateZoneData().fromJSON(HeartRateZoneJSON.peak))
            })
        })
    })

    describe('toJSON()', () => {
        context('when the PhysicalActivityHeartRate model is correct', () => {
            it('should return a JSON from PhysicalActivityHeartRate model', () => {
                let result = new HeartRateZone().fromJSON(HeartRateZoneJSON)
                result = result.toJSON()
                assert.deepPropertyVal(result, 'out_of_range', HeartRateZoneJSON.out_of_range)
                assert.deepPropertyVal(result, 'fat_burn', HeartRateZoneJSON.fat_burn)
                assert.deepPropertyVal(result, 'cardio', HeartRateZoneJSON.cardio)
                assert.deepPropertyVal(result, 'peak', HeartRateZoneJSON.peak)
            })
        })
    })
})
