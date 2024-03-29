import { PhysicalActivity } from '../../../src/application/domain/model/physical.activity'
import { HeartRateZone } from '../../../src/application/domain/model/heart.rate.zone'
import { ActivityLevel } from '../../../src/application/domain/model/activityLevel'
import { Levels } from '../../../src/application/domain/utils/levels'
import { DefaultFunctions } from '../utils/default.functions'

export class PhysicalActivityMock extends PhysicalActivity {
    public static PATIENT_ID = '5a62be07de34500146d9c544'

    constructor(type?: ActivityTypeMock) {
        super()
        this.generatePhysicalActivity(type)
    }

    private generatePhysicalActivity(type?: ActivityTypeMock): void {
        if (!type) type = this.chooseType()

        super.id = DefaultFunctions.generateObjectId()
        super.start_time = new Date(1560826800000 + Math.floor((Math.random() * 1000))).toISOString()
        super.end_time = new Date(new Date(super.start_time)
            .setMilliseconds(Math.floor(Math.random() * 35 + 10) * 60000)).toISOString() // 10-45min in milliseconds
        super.duration = new Date(super.end_time).getTime() - new Date(super.start_time).getTime()
        super.patient_id = PhysicalActivityMock.PATIENT_ID
        super.name = type
        super.calories = Math.floor((Math.random() * 20000 + 500)) // 500-20100
        if (type === ActivityTypeMock.WALK || type === ActivityTypeMock.RUN) {
            super.steps = Math.floor((Math.random() * 20000 + 100)) // 100-20100
        }
        super.distance = Math.floor((Math.random() * 1000 + 100)) // 100-1100
        super.levels = this.generatePhysicalActivityLevels()
        super.heart_rate_average = Math.floor((Math.random() * 120 + 70)), // 70-189
            super.heart_rate_zones = this.generateHeartRate()
    }

    private generatePhysicalActivityLevels(): Array<ActivityLevel> {
        const levels: Array<ActivityLevel> = []
        levels.push(new ActivityLevel(Levels.SEDENTARY, Math.floor((Math.random() * 10) * 60000)))
        levels.push(new ActivityLevel(Levels.LIGHTLY, Math.floor((Math.random() * 10) * 60000)))
        levels.push(new ActivityLevel(Levels.FAIRLY, Math.floor((Math.random() * 10) * 60000)))
        levels.push(new ActivityLevel(Levels.VERY, Math.floor((Math.random() * 10) * 60000)))
        return levels
    }

    private generateHeartRate(): HeartRateZone {
        const activityHeartRateZoneJSON: any = {
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
        return new HeartRateZone().fromJSON(activityHeartRateZoneJSON)
    }

    private chooseType(): ActivityTypeMock {
        switch (Math.floor((Math.random() * 4))) { // 0-3
            case 0:
                return ActivityTypeMock.WALK
            case 1:
                return ActivityTypeMock.RUN
            case 2:
                return ActivityTypeMock.BIKE
            default:
                return ActivityTypeMock.SWIM
        }
    }
}

export enum ActivityTypeMock {
    WALK = 'walk',
    RUN = 'run',
    BIKE = 'bike',
    SWIM = 'swim'
}
