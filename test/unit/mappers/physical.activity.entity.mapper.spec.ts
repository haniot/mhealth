import { assert } from 'chai'
import { PhysicalActivityEntityMapper } from '../../../src/infrastructure/entity/mapper/physical.activity.entity.mapper'
import { PhysicalActivityEntity } from '../../../src/infrastructure/entity/physical.activity.entity'
import { PhysicalActivity } from '../../../src/application/domain/model/physical.activity'
import { PhysicalActivityMock } from '../../mocks/models/physical.activity.mock'
import { ActivityLevel } from '../../../src/application/domain/model/activityLevel'
import { HeartRateZone } from '../../../src/application/domain/model/heart.rate.zone'

describe('Mappers: PhysicalActivityEntityMapper', () => {
    const activity: PhysicalActivity = new PhysicalActivityMock()

    // To test how mapper works with an object without any attributes
    const emptyActivity: PhysicalActivity = new PhysicalActivity()

    // Create physical activity JSON
    const activityJSON: any = {
        id: '5a62be07de34500146d9c544',
        start_time: new Date('2018-12-14T12:52:59Z'),
        end_time: new Date('2018-12-14T13:12:37Z'),
        duration: 1178000,
        patient_id: '5a62be07de34500146d9c544',
        name: 'walk',
        calories: 200,
        steps: 1000,
        distance: 1000,
        levels: [
            {
                name: 'sedentary',
                duration: Math.floor((Math.random() * 10) * 60000)
            },
            {
                name: 'lightly',
                duration: Math.floor((Math.random() * 10) * 60000)
            },
            {
                name: 'fairly',
                duration: Math.floor((Math.random() * 10) * 60000)
            },
            {
                name: 'very',
                duration: Math.floor((Math.random() * 10) * 60000)
            }
        ],
        calories_link: '/v1/patients/5a62be07de34500146d9c544/calories/date/2018-12-14/2018-12-14/time/12:52/13:12/interval/1min/timeseries',
        heart_rate_link: '/v1/patients/5a62be07de34500146d9c544/heartrate/date/2018-12-14/2018-12-14/time/12:52/13:12/interval/1sec/timeseries',
        heart_rate_average: 91,
        heart_rate_zones: {
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
    }

    // To test how mapper works with an object without any attributes (JSON)
    const emptyActivityJSON: any = {}

    describe('transform(item: any)', () => {
        context('when the parameter is of type PhysicalActivity', () => {
            it('should normally execute the method, returning a PhysicalActivityEntity as a result of the transformation', () => {
                const result: PhysicalActivityEntity = new PhysicalActivityEntityMapper().transform(activity)
                assert.propertyVal(result, 'id', activity.id)
                assert.propertyVal(result, 'start_time', activity.start_time)
                assert.propertyVal(result, 'end_time', activity.end_time)
                assert.propertyVal(result, 'duration', activity.duration)
                assert.propertyVal(result, 'patient_id', activity.patient_id)
                assert.propertyVal(result, 'name', activity.name)
                assert.propertyVal(result, 'calories', activity.calories)
                if (activity.steps)
                    assert.propertyVal(result, 'steps', activity.steps)
                assert.propertyVal(result, 'distance', activity.distance)
                if (activity.levels)
                    assert.deepPropertyVal(result, 'levels', activity.levels.map((elem: ActivityLevel) => elem.toJSON()))
                assert.deepPropertyVal(result, 'calories_link', activity.calories_link)
                assert.deepPropertyVal(result, 'heart_rate_link', activity.heart_rate_link)
                assert.deepPropertyVal(result, 'heart_rate_average', activity.heart_rate_average)
                assert.deepPropertyVal(result, 'heart_rate_zones', activity.heart_rate_zones!.toJSON())
            })
        })

        context('when the parameter is of type PhysicalActivity and does not contain any attributes', () => {
            it('should normally execute the method, returning an empty PhysicalActivityEntity', () => {
                const result: PhysicalActivityEntity = new PhysicalActivityEntityMapper().transform(emptyActivity)
                assert.deepPropertyVal(result, 'levels', [])
            })
        })

        context('when the parameter is a JSON', () => {
            it('should normally execute the method, returning a PhysicalActivity as a result of the transformation', () => {
                const result: PhysicalActivity = new PhysicalActivityEntityMapper().transform(activityJSON)
                assert.propertyVal(result, 'id', activityJSON.id)
                assert.propertyVal(result, 'start_time', activityJSON.start_time)
                assert.propertyVal(result, 'end_time', activityJSON.end_time)
                assert.propertyVal(result, 'duration', activityJSON.duration)
                assert.propertyVal(result, 'patient_id', activityJSON.patient_id)
                assert.propertyVal(result, 'name', activityJSON.name)
                assert.propertyVal(result, 'calories', activityJSON.calories)
                if (activity.steps)
                    assert.propertyVal(result, 'steps', activityJSON.steps)
                assert.propertyVal(result, 'distance', activityJSON.distance)
                if (activity.levels)
                    assert.deepEqual(result.levels!.map((elem: ActivityLevel) => elem.toJSON()), activityJSON.levels)
                assert.propertyVal(result, 'calories_link', activityJSON.calories_link)
                assert.propertyVal(result, 'heart_rate_link', activityJSON.heart_rate_link)
                assert.propertyVal(result, 'heart_rate_average', activityJSON.heart_rate_average)
                assert.deepPropertyVal(result, 'heart_rate_zones', new HeartRateZone().fromJSON(activityJSON.heart_rate_zones))
            })
        })

        context('when the parameter is a JSON and does not contain any attributes', () => {
            it('should normally execute the method, returning a PhysicalActivity as a result of the transformation', () => {
                const result: PhysicalActivity = new PhysicalActivityEntityMapper().transform(emptyActivityJSON)
                assert.propertyVal(result, 'id', emptyActivityJSON.id)
                assert.propertyVal(result, 'start_time', emptyActivityJSON.start_time)
                assert.propertyVal(result, 'end_time', emptyActivityJSON.end_time)
                assert.propertyVal(result, 'duration', emptyActivityJSON.duration)
                assert.propertyVal(result, 'patient_id', emptyActivityJSON.patient_id)
                assert.propertyVal(result, 'name', emptyActivityJSON.name)
                assert.propertyVal(result, 'calories', emptyActivityJSON.calories)
                assert.propertyVal(result, 'steps', emptyActivityJSON.steps)
                assert.propertyVal(result, 'distance', emptyActivityJSON.distance)
                assert.propertyVal(result, 'levels', emptyActivityJSON.levels)
                assert.propertyVal(result, 'calories_link', emptyActivityJSON.calories_link)
                assert.propertyVal(result, 'heart_rate_link', emptyActivityJSON.heart_rate_link)
                assert.propertyVal(result, 'heart_rate_average', emptyActivityJSON.heart_rate_average)
                assert.propertyVal(result, 'heart_rate_zones', emptyActivityJSON.heart_rate)
            })
        })

        context('when the parameter is an undefined', () => {
            it('should normally execute the method, returning an empty PhysicalActivity as a result of the transformation',
                () => {
                    const result: PhysicalActivity = new PhysicalActivityEntityMapper().transform(undefined)

                    assert.propertyVal(result, 'id', undefined)
                    assert.propertyVal(result, 'start_time', undefined)
                    assert.propertyVal(result, 'end_time', undefined)
                    assert.propertyVal(result, 'duration', undefined)
                    assert.propertyVal(result, 'patient_id', undefined)
                    assert.propertyVal(result, 'name', undefined)
                    assert.propertyVal(result, 'calories', undefined)
                    assert.propertyVal(result, 'steps', undefined)
                    assert.propertyVal(result, 'distance', undefined)
                    assert.propertyVal(result, 'levels', undefined)
                    assert.propertyVal(result, 'calories_link', undefined)
                    assert.propertyVal(result, 'heart_rate_link', undefined)
                    assert.propertyVal(result, 'heart_rate_average', undefined)
                    assert.propertyVal(result, 'heart_rate_zones', undefined)
                })
        })
    })
})
