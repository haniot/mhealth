import { Height } from '../../../src/application/domain/model/height'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'

export class HeightMock extends Height {
    public static DEVICE_ID = '4b24cf16cb21322357e8d633'
    public static PATIENT_ID = '5a62be07de34500146d9c544'

    constructor() {
        super()
        this.generateHeight()
    }

    private generateHeight(): void {
        super.id = this.generateObjectId()
        super.value = Math.random() * 10 + 170 // 170-179
        super.unit = 'cm'
        super.timestamp = new Date().toISOString()
        super.type = MeasurementTypes.HEIGHT
        super.device_id = HeightMock.DEVICE_ID
        super.patient_id = HeightMock.PATIENT_ID
    }

    private generateObjectId(): string {
        const chars = 'abcdef0123456789'
        let randS = ''
        for (let i = 0; i < 24; i++) {
            randS += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randS
    }
}
