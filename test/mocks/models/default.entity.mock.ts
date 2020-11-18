import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { MealTypes } from '../../../src/application/domain/utils/meal.types'
import { MeasurementUnits } from '../../../src/application/domain/utils/measurement.units'
import { DeviceTypes } from '../../../src/application/domain/utils/device.types'

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
        value: 10,
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

    public static WEIGHT: any = {
        id: '5cb4882751b5f21ba364ba6f',
        value: 50,
        unit: MeasurementUnits.WEIGHT,
        type: MeasurementTypes.WEIGHT,
        timestamp: '2018-11-19T14:40:00Z',
        body_fat: 20,
        patient_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736',
        bmi: 22.22
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
        value: 50,
        unit: '-',
        timestamp: new Date().toISOString(),
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

    public static DEVICE: any = {
        id: '5ca77314bc08ec205689a736',
        name: 'YUNMAI SCALE',
        address: 'D4:36:39:91:75:71',
        type: DeviceTypes.THERMOMETER,
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

    public static readonly SLEEP_AWAKENING: any = {
        start_time: '01:30:30',
        end_time: '01:45:30',
        duration: 900000,
        steps: 9
    }

    public static readonly SLEEP_DURATION_SUMMARY: any = {
        total: 19417
    }

    public static readonly SLEEP_DURATION_ITEM: any = {
        date: '2020-11-01',
        value: 7234
    }

    public static readonly SLEEP_DURATION: any = {
        summary: DefaultEntityMock.SLEEP_DURATION_SUMMARY,
        data_set: [DefaultEntityMock.SLEEP_DURATION_ITEM]
    }

    public static readonly USER: any = {
        id: '5f3ab9e5f4d399ae75cd39e3',
        type: 'patient'
    }
}
