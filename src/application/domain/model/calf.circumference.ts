import { Measurement } from './measurement'
import { MeasurementTypes } from '../utils/measurement.types'

export class CalfCircumference extends Measurement {

    constructor() {
        super()
        super.type = MeasurementTypes.CALF_CIRCUMFERENCE
    }

}
