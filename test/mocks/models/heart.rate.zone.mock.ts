import { HeartRateZone } from '../../../src/application/domain/model/heart.rate.zone'

export class HeartRateZoneMock extends HeartRateZone {

    constructor() {
        super()
        this.generateHeartRateZones()
    }

    private generateHeartRateZones(): void {
        const activityHeartRateZonesJSON: any = {
            out_of_range: {
                min: 30,
                max: 91,
                duration: 0
            },
            fat_burn: {
                min: 91,
                max: 127,
                duration: 600000
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
        super.fromJSON(activityHeartRateZonesJSON)
    }

}
