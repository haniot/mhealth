import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { MealTypes } from '../../../src/application/domain/utils/meal.types'
import { MeasurementUnits } from '../../../src/application/domain/utils/measurement.units'

export abstract class DefaultEntityMock {
    public static BLOOD_GLUCOSE: any = {
        id: '5cb488278cf5f9e6760c14ed',
        value: 99,
        unit: MeasurementUnits.BLOOD_GLUCOSE,
        meal: MealTypes.PREPRANDIAL,
        type: MeasurementTypes.BLOOD_GLUCOSE,
        timestamp: '2018-11-19T14:40:00Z',
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static BLOOD_PRESSURE: any = {
        id: '5cb48827217ee2910ea11e84',
        systolic: 120,
        diastolic: 80,
        pulse: 80,
        unit: MeasurementUnits.BLOOD_PRESSURE,
        type: MeasurementTypes.BLOOD_PRESSURE,
        timestamp: '2018-11-19T14:40:00Z',
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static BODY_TEMPERATURE: any = {
        id: '5cb4b2fd02eb7733b03db810',
        value: 36,
        unit: MeasurementUnits.TEMPERATURE,
        type: MeasurementTypes.BODY_TEMPERATURE,
        timestamp: '2018-11-19T14:40:00Z',
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static BODY_FAT: any = {
        id: '5cb4882751b5f21ba364ba6f',
        value: 20,
        unit: MeasurementUnits.PERCENTUAL,
        type: MeasurementTypes.BODY_FAT,
        timestamp: '2018-11-17T14:40:00Z',
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static HEIGHT: any = {
        id: '5cb488279ea138bd6abf936a',
        value: 150,
        unit: MeasurementUnits.LENGTH,
        type: MeasurementTypes.HEIGHT,
        timestamp: '2018-11-19T14:40:00Z',
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static MEASUREMENT: any = {
        id: '5cb488279ea138bd6abf937b',
        unit: '-',
        type: 'measurement',
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static STATUS_ERROR: any = {
        code: 400,
        message: 'any message',
        description: 'any description',
        item: {
            unit: '-',
            type: 'measurement',
            patient_id: '5a62be07d6f33400146c9b61',
            device_id: '5ca77314bc08ec205689a736'
        }
    }

    public static STATUS_SUCCESS: any = {
        code: 200,
        item: {
            unit: '-',
            type: 'measurement',
            patient_id: '5a62be07d6f33400146c9b61',
            device_id: '5ca77314bc08ec205689a736'
        }
    }

    public static WAIST_CIRCUMFERENCE: any = {
        id: '5cb488279ea138bd6abf936a',
        value: 70,
        unit: MeasurementUnits.LENGTH,
        type: MeasurementTypes.WAIST_CIRCUMFERENCE,
        timestamp: '2018-11-19T14:40:00Z',
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static WEIGHT: any = {
        id: '5cb4882751b5f21ba364ba6f',
        value: 50,
        unit: MeasurementUnits.WEIGHT,
        type: MeasurementTypes.WEIGHT,
        timestamp: '2018-11-19T14:40:00Z',
        body_fat: 30,
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static DEVICE: any = {
        id: '5ca77314bc08ec205689a736',
        name: 'YUNMAI SCALE',
        address: 'D4:36:39:91:75:71',
        type: 'thermometer',
        model_number: '502C8',
        manufacturer: 'XIAOMI',
        patient_id: '5a62be07d6f33400146c9b61'
    }

    public static LAST_MEASUREMENTS: any = {
        height: DefaultEntityMock.HEIGHT,
        weight: DefaultEntityMock.WEIGHT,
        waist_circumference: DefaultEntityMock.WAIST_CIRCUMFERENCE,
        body_fat: DefaultEntityMock.BODY_FAT,
        blood_pressure: DefaultEntityMock.BLOOD_PRESSURE,
        blood_glucose: DefaultEntityMock.BLOOD_GLUCOSE,
        body_temperature: DefaultEntityMock.BODY_TEMPERATURE
    }
}
