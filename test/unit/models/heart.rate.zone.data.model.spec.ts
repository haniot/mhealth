import { assert } from 'chai'
import { HeartRateZoneData } from '../../../src/application/domain/model/heart.rate.zone.data'

describe('Models: HeartRateZoneData', () => {
    const heartRateZoneDataJSON: any = {
        min: 91,
        max: 127,
        duration: 600000,
    }

    describe('fromJSON(json: any)', () => {
        context('when the json is correct', () => {
            it('should return an HeartRateZone model', () => {
                const result = new HeartRateZoneData().fromJSON(heartRateZoneDataJSON)
                assert.deepPropertyVal(result, 'min', heartRateZoneDataJSON.min)
                assert.deepPropertyVal(result, 'max', heartRateZoneDataJSON.max)
                assert.deepPropertyVal(result, 'duration', heartRateZoneDataJSON.duration)
            })
        })

        context('when the json is undefined', () => {
            it('should return an HeartRateZone model with all attributes with undefined value', () => {
                const result = new HeartRateZoneData().fromJSON(undefined)
                assert.isUndefined(result.min)
                assert.isUndefined(result.max)
                assert.isUndefined(result.duration)
            })
        })

        context('when the json is a string', () => {
            it('should transform the string in json and return HeartRateZone model', () => {
                const result = new HeartRateZoneData().fromJSON(JSON.stringify(heartRateZoneDataJSON))
                assert.deepPropertyVal(result, 'min', heartRateZoneDataJSON.min)
                assert.deepPropertyVal(result, 'max', heartRateZoneDataJSON.max)
                assert.deepPropertyVal(result, 'duration', heartRateZoneDataJSON.duration)
            })
        })
    })

    describe('toJSON()', () => {
        context('when the HeartRateZone model is correct', () => {
            it('should return a JSON from HeartRateZone model', () => {
                let result = new HeartRateZoneData().fromJSON(heartRateZoneDataJSON)
                result = result.toJSON()
                assert.deepPropertyVal(result, 'min', heartRateZoneDataJSON.min)
                assert.deepPropertyVal(result, 'max', heartRateZoneDataJSON.max)
                assert.deepPropertyVal(result, 'duration', heartRateZoneDataJSON.duration)
            })
        })
    })
})
