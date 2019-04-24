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
        user_id: '5a62be07d6f33400146c9b61',
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
        user_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca790f77aefffa37a17b605'
    }

    public static BODY_TEMPERATURE: any = {
        id: '5cb4b2fd02eb7733b03db810',
        value: 36,
        unit: MeasurementUnits.TEMPERATURE,
        type: MeasurementTypes.BODY_TEMPERATURE,
        timestamp: '2018-11-19T14:40:00Z',
        user_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca790f77aefffa37a17b605'
    }

    public static FAT: any = {
        id: '5cb4882751b5f21ba364ba6f',
        value: 20,
        unit: MeasurementUnits.PERCENTUAL,
        type: MeasurementTypes.FAT,
        timestamp: '2018-11-17T14:40:00Z',
        user_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca790f77aefffa37a17b605'
    }

    public static HEART_RATE: any = {
        id: '5cb488277b26234cfe2635da',
        dataset: [
            {
                value: 90,
                timestamp: '2018-11-19T14:40:00Z'
            },
            {
                value: 87,
                timestamp: '2018-11-19T14:41:00Z'
            },
            {
                value: 89,
                timestamp: '2018-11-19T14:42:00Z'
            },
            {
                value: 90,
                timestamp: '2018-11-19T14:43:00Z'
            },
            {
                value: 91,
                timestamp: '2018-11-19T14:44:00Z'
            }
        ],
        unit: MeasurementUnits.HEART_RATE,
        type: MeasurementTypes.HEART_RATE,
        user_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca790f77aefffa37a17b605'

    }

    public static HEIGHT: any = {
        id: '5cb488279ea138bd6abf936a',
        value: 150,
        unit: MeasurementUnits.LENGTH,
        type: MeasurementTypes.HEIGHT,
        timestamp: '2018-11-19T14:40:00Z',
        user_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca790f77aefffa37a17b605'
    }

    public static MEASUREMENT: any = {
        unit: '-',
        user_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static MULTI_STATUS: any = {
        success: [{
            code: 200,
            item: {
                unit: '-',
                type: 'measurement',
                user_id: '5a62be07d6f33400146c9b61',
                device_id: '5ca77314bc08ec205689a736'
            }
        }],
        err: [{
            code: 400,
            message: 'any message',
            description: 'any description',
            item: {
                unit: '-',
                type: 'measurement',
                user_id: '5a62be07d6f33400146c9b61',
                device_id: '5ca77314bc08ec205689a736'
            }
        }]
    }

    public static STATUS_ERROR: any = {
        code: 400,
        message: 'any message',
        description: 'any description',
        item: {
            unit: '-',
            type: 'measurement',
            user_id: '5a62be07d6f33400146c9b61',
            device_id: '5ca77314bc08ec205689a736'
        }
    }

    public static STATUS_SUCCESS: any = {
        code: 200,
        item: {
            unit: '-',
            type: 'measurement',
            user_id: '5a62be07d6f33400146c9b61',
            device_id: '5ca77314bc08ec205689a736'
        }
    }

    public static WAIST_CIRCUMFERENCE: any = {
        id: '5cb488279ea138bd6abf936a',
        value: 70,
        unit: MeasurementUnits.LENGTH,
        type: MeasurementTypes.WAIST_CIRCUMFERENCE,
        timestamp: '2018-11-19T14:40:00Z',
        user_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca790f77aefffa37a17b605'
    }

    public static WEIGHT: any = {
        id: '5cb4882751b5f21ba364ba6f',
        value: 50,
        unit: MeasurementUnits.WEIGHT,
        type: MeasurementTypes.WEIGHT,
        timestamp: '2018-11-19T14:40:00Z',
        fat: {
            value: 30,
            unit: MeasurementUnits.PERCENTUAL
        },
        user_id: '5a62be07d6f33400146c9b61',
        device_id: '5ca77314bc08ec205689a736'
    }

    public static DEVICE: any = {
        id: '5ca77314bc08ec205689a736',
        name: 'YUNMAI SCALE',
        address: 'D4:36:39:91:75:71',
        type: 'thermometer',
        model_number: 5028,
        manufacturer: 'XIAOMI',
        user_id: '5a62be07d6f33400146c9b61'
    }
}
