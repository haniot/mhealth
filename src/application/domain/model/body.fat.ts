import { Measurement } from './measurement'
import { MeasurementTypes } from '../utils/measurement.types'

export class BodyFat extends Measurement {

    constructor() {
        super()
        super.type = MeasurementTypes.BODY_FAT
    }

}
