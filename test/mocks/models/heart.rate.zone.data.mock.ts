import { HeartRateZoneData } from '../../../src/application/domain/model/heart.rate.zone.data'

export class HeartRateZoneDataMock extends HeartRateZoneData {

    constructor() {
        super()
        this.generateHeartRateZoneData()
    }

    private generateHeartRateZoneData(): void {
        const heartRateZoneDataJSON: any = { min: 91, max: 127, duration: 60000 }
        super.fromJSON(heartRateZoneDataJSON)
    }

}
