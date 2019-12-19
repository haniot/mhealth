import { ObjectID } from 'bson'
import { assert } from 'chai'
import { Activity } from '../../../src/application/domain/model/activity'

describe('Models: Activity', () => {
    const activityJSON: any = {
        id: new ObjectID(),
        start_time: new Date(),
        end_time: new Date(),
        duration: 900000,
        patient_id: new ObjectID()
    }

    describe('fromJSON(json: any)', () => {
        context('when the json is correct', () => {
            it('should return an Activity model', () => {
                const result = new Activity().fromJSON(activityJSON)
                assert.propertyVal(result, 'id', activityJSON.id)
                assert.propertyVal(result, 'start_time', activityJSON.start_time)
                assert.propertyVal(result, 'end_time', activityJSON.end_time)
                assert.propertyVal(result, 'duration', activityJSON.duration)
            })
        })

        context('when the json is undefined', () => {
            it('should return an Activity model with all attributes with undefined value', () => {
                const result = new Activity().fromJSON(undefined)
                assert.isUndefined(result.id)
                assert.isUndefined(result.start_time)
                assert.isUndefined(result.end_time)
                assert.isUndefined(result.duration)
                assert.isUndefined(result.patient_id)
            })
        })

        context('when the json is a string', () => {
            it('should transform the string in json and return Activity model', () => {
                const result = new Activity().fromJSON(JSON.stringify(activityJSON))
                assert.propertyVal(result, 'id', activityJSON.id.toHexString())
                assert.deepPropertyVal(result, 'start_time', activityJSON.start_time.toISOString())
                assert.deepPropertyVal(result, 'end_time', activityJSON.end_time.toISOString())
                assert.propertyVal(result, 'duration', activityJSON.duration)
            })
        })
    })

    describe('toJSON()', () => {
        context('when the Activity model is correct', () => {
            it('should return a JSON from Activity model', () => {
                let result = new Activity().fromJSON(activityJSON)
                result = result.toJSON()
                assert.propertyVal(result, 'id', activityJSON.id)
                assert.propertyVal(result, 'start_time', activityJSON.start_time)
                assert.propertyVal(result, 'end_time', activityJSON.end_time)
                assert.propertyVal(result, 'duration', activityJSON.duration)
            })
        })
    })
})
