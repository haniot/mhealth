import { assert } from 'chai'
import { Levels } from '../../../src/application/domain/utils/levels'
import { ActivityLevel } from '../../../src/application/domain/model/activityLevel'

describe('Models: ActivityLevel', () => {
    const activityLevelJSON: any = {
        name: Levels.FAIRLY,
        duration: 200
    }

    describe('fromJSON(json: any)', () => {
        context('when the json is correct', () => {
            it('should return an ActivityLevel model', () => {
                const result = new ActivityLevel().fromJSON(activityLevelJSON)
                assert.propertyVal(result, 'name', activityLevelJSON.name)
                assert.propertyVal(result, 'duration', activityLevelJSON.duration)
            })
        })

        context('when the json is undefined', () => {
            it('should return an ActivityLevel model with all attributes with undefined value', () => {
                const result = new ActivityLevel().fromJSON(undefined)
                assert.isUndefined(result.name)
                assert.isUndefined(result.duration)
            })
        })

        context('when the json is a string', () => {
            it('should transform the string in json and return ActivityLevel model', () => {
                const result = new ActivityLevel().fromJSON(JSON.stringify(activityLevelJSON))
                assert.propertyVal(result, 'name', activityLevelJSON.name)
                assert.propertyVal(result, 'duration', activityLevelJSON.duration)
            })
        })
    })

    describe('toJSON()', () => {
        context('when the ActivityLevel model is correct', () => {
            it('should return a JSON from ActivityLevel model', () => {
                let result = new ActivityLevel().fromJSON(activityLevelJSON)
                result = result.toJSON()
                assert.propertyVal(result, 'name', activityLevelJSON.name)
                assert.propertyVal(result, 'duration', activityLevelJSON.duration)
            })
        })
    })
})
