import { CalfCircumference } from '../../../src/application/domain/model/calf.circumference'
import { BodyMemberSides } from '../../../src/application/domain/utils/body.member.sides'
import { DefaultFunctions } from '../utils/default.functions'

export class CalfCircumferenceMock {
    public static DEVICE_ID = '4b24cf16cb21322357e8d633'
    public static PATIENT_ID = '5a62be07de34500146d9c544'

    public generate(): CalfCircumference {
        const calfCircumference: CalfCircumference = new CalfCircumference()
        calfCircumference.id = DefaultFunctions.generateObjectId()
        calfCircumference.value = Math.random() * 10 + 20 // 20-29
        calfCircumference.unit = 'kg'
        calfCircumference.timestamp = new Date().toISOString()
        calfCircumference.device_id = CalfCircumferenceMock.DEVICE_ID
        calfCircumference.patient_id = CalfCircumferenceMock.PATIENT_ID
        calfCircumference.leg = this.generateBodyMemberSide()

        return calfCircumference
    }

    private generateBodyMemberSide(): BodyMemberSides {
        const bodyMemberSides = {
            0: BodyMemberSides.LEFT,
            1: BodyMemberSides.RIGHT
        }

        return bodyMemberSides[Math.floor((Math.random() * 2))] // 0-1
    }
}
