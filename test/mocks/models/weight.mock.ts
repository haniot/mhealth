import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { Weight } from '../../../src/application/domain/model/weight'

export class WeightMock extends Weight {
    public static DEVICE_ID = '4b24cf16cb21322357e8d633'
    public static PATIENT_ID = '5a62be07de34500146d9c544'

    constructor() {
        super()
        this.generateWeight()
    }

    private generateWeight(): void {
        super.id = this.generateObjectId()
        super.value = Math.random() * 10 + 70 // 70-79
        super.unit = 'kg'
        super.timestamp = new Date().toISOString()
        super.type = MeasurementTypes.WEIGHT
        super.device_id = WeightMock.DEVICE_ID
        super.patient_id = WeightMock.PATIENT_ID
        super.body_fat = Math.random() * 10 + 18 // 18-27
        super.bmi = Math.random() * 10 + 18 // 18-27
        super.annual_variation = this.chooseChoiceType()
    }

    private generateObjectId(): string {
        const chars = 'abcdef0123456789'
        let randS = ''
        for (let i = 0; i < 24; i++) {
            randS += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randS
    }

    private chooseChoiceType(): ChoiceTypesMock {
        switch (Math.floor(Math.random() * 2)) { // 0-1
            case 0:
                return ChoiceTypesMock.YES
            default:
                return ChoiceTypesMock.NO
        }
    }
}

export enum ChoiceTypesMock {
    YES = 'yes',
    NO = 'no'
}
