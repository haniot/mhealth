import { Measurement } from './measurement'
import { MeasurementTypes } from '../utils/measurement.types'

export class WaistCircumference extends Measurement {

    constructor() {
        super()
        super.type = MeasurementTypes.WAIST_CIRCUMFERENCE
    }

}
