import { ObjectID } from 'bson'
import { assert } from 'chai'
import { PhysicalActivity } from '../../../src/application/domain/model/physical.activity'
import { ActivityLevel } from '../../../src/application/domain/model/activityLevel'
import { Levels } from '../../../src/application/domain/utils/levels'

describe('Models: PhysicalActivity', () => {
    const activityJSON: any = {
        id: new ObjectID(),
        start_time: new Date(),
        end_time: new Date(),
        duration: 900000,
        patient_id: new ObjectID(),
        name: 'walk',
        calories: 250,
        steps: 1000,
        distance: 1000,
        levels: [new ActivityLevel(Levels.SEDENTARY, Math.floor((Math.random() * 10) * 60000)),
            new ActivityLevel(Levels.LIGHTLY, Math.floor((Math.random() * 10) * 60000)),
            new ActivityLevel(Levels.FAIRLY, Math.floor((Math.random() * 10) * 60000)),
            new ActivityLevel(Levels.VERY, Math.floor((Math.random() * 10) * 60000))]
    }

    describe('fromJSON(json: any)', () => {
        context('when the json is correct', () => {
            it('should return an PhysicalActivity model', () => {
                const result = new PhysicalActivity().fromJSON(activityJSON)
                assert.propertyVal(result, 'id', activityJSON.id)
                assert.propertyVal(result, 'duration', activityJSON.duration)
                assert.propertyVal(result, 'name', activityJSON.name)
                assert.propertyVal(result, 'calories', activityJSON.calories)
                assert.propertyVal(result, 'steps', activityJSON.steps)
                assert.propertyVal(result, 'distance', activityJSON.distance)
                // PhysicalActivity levels
                assert.deepPropertyVal(result, 'levels', activityJSON.levels)
                assert.deepPropertyVal(result, 'heart_rate_zones', activityJSON.heart_rate_zones)
            })
        })

        context('when the json is undefined', () => {
            it('should return an PhysicalActivity model with all attributes with undefined value', () => {
                const result = new PhysicalActivity().fromJSON(undefined)
                assert.isUndefined(result.id)
                assert.isUndefined(result.start_time)
                assert.isUndefined(result.end_time)
                assert.isUndefined(result.duration)
                assert.isUndefined(result.patient_id)
                assert.isUndefined(result.name)
                assert.isUndefined(result.calories)
                assert.isUndefined(result.steps)
                assert.isUndefined(result.distance)
                assert.isUndefined(result.levels)
                assert.isUndefined(result.heart_rate_zones)
            })
        })

        context('when the json is a string', () => {
            it('should transform the string in json and return PhysicalActivity model', () => {
                const result = new PhysicalActivity().fromJSON(JSON.stringify(activityJSON))
                assert.propertyVal(result, 'id', activityJSON.id.toHexString())
                assert.propertyVal(result, 'duration', activityJSON.duration)
                assert.propertyVal(result, 'name', activityJSON.name)
                assert.propertyVal(result, 'calories', activityJSON.calories)
                assert.propertyVal(result, 'steps', activityJSON.steps)
                assert.propertyVal(result, 'distance', activityJSON.distance)
                // PhysicalActivity levels
                assert.deepPropertyVal(result, 'levels', activityJSON.levels)
                assert.deepPropertyVal(result, 'heart_rate_zones', activityJSON.heart_rate_zones)
            })
        })
    })

    describe('toJSON()', () => {
        context('when the PhysicalActivity model is correct', () => {
            it('should return a JSON from PhysicalActivity model', () => {
                let result = new PhysicalActivity().fromJSON(activityJSON)
                result = result.toJSON()
                assert.propertyVal(result, 'id', activityJSON.id)
                assert.propertyVal(result, 'duration', activityJSON.duration)
                assert.propertyVal(result, 'name', activityJSON.name)
                assert.propertyVal(result, 'calories', activityJSON.calories)
                assert.propertyVal(result, 'steps', activityJSON.steps)
                assert.propertyVal(result, 'distance', activityJSON.distance)
                // PhysicalActivity levels
                // Level 1
                assert.propertyVal(result.levels![0], 'name', activityJSON.levels[0].name)
                assert.propertyVal(result.levels![0], 'duration', activityJSON.levels[0].duration)
                // Level 2
                assert.propertyVal(result.levels![1], 'name', activityJSON.levels[1].name)
                assert.propertyVal(result.levels![1], 'duration', activityJSON.levels[1].duration)
                // Level 3
                assert.propertyVal(result.levels![2], 'name', activityJSON.levels[2].name)
                assert.propertyVal(result.levels![2], 'duration', activityJSON.levels[2].duration)
                // Level 4
                assert.propertyVal(result.levels![3], 'name', activityJSON.levels[3].name)
                assert.propertyVal(result.levels![3], 'duration', activityJSON.levels[3].duration)
                assert.propertyVal(result, 'heart_rate_zones', activityJSON.heart_rate_zones)
            })
        })
    })
})
