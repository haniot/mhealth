import { HandGrip } from '../../../src/application/domain/model/hand.grip'

export class HandGripMock {
    public static DEVICE_ID = '4b24cf16cb21322357e8d633'
    public static PATIENT_ID = '5a62be07de34500146d9c544'

    public generate(): HandGrip {
        const handGrip: HandGrip = new HandGrip()
        handGrip.id = this.generateObjectId()
        handGrip.value = Math.random() * 10 + 20 // 20-29
        handGrip.unit = 'kg'
        handGrip.timestamp = new Date().toISOString()
        handGrip.device_id = HandGripMock.DEVICE_ID
        handGrip.patient_id = HandGripMock.PATIENT_ID

        return handGrip
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
