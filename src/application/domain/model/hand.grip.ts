import { Measurement } from './measurement'
import { MeasurementTypes } from '../utils/measurement.types'

export class HandGrip extends Measurement {

    constructor() {
        super()
        super.type = MeasurementTypes.HAND_GRIP
    }

}
