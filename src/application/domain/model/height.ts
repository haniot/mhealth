import { Measurement } from './measurement'
import { MeasurementTypes } from '../utils/measurement.types'

export class Height extends Measurement {

    constructor() {
        super()
        super.type = MeasurementTypes.HEIGHT
    }

}
