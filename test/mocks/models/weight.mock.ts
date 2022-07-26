import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { Weight } from '../../../src/application/domain/model/weight'
import { DefaultFunctions } from '../utils/default.functions'

export class WeightMock extends Weight {
    public static DEVICE_ID = '4b24cf16cb21322357e8d633'
    public static PATIENT_ID = '5a62be07de34500146d9c544'

    constructor() {
        super()
        this.generateWeight()
    }

    private generateWeight(): void {
        super.id = DefaultFunctions.generateObjectId()
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
