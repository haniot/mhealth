export abstract class DefaultEntityMock {
    public static MEASUREMENT_BODY_MASS: any = {
        id: '5a62be07de34500146d9c624',
        value: 50,
        unit: 'kg',
        type: 'body_mass',
        measurements: [],
        contexts: [],
        timestamp: '2018-11-19T14:40:00Z',
        device_id: '5c868e372ff9c9e95b3c9a6d',
        user_id: '5a62be07d6f33400146c9b61'
    }

    public static MEASUREMENT_TEMPERATURE: any = {
        id: '5a62be07de34500146d9c633',
        value: 36,
        unit: '°C',
        type: 'temperature',
        measurements: [],
        contexts: [{
            type: 'temperature_type',
            value: 3
        }],
        timestamp: '2018-11-19T14:40:00Z',
        device_id: '5c868e372ff9c9e95b3c9a6d',
        user_id: '5a62be07d6f33400146c9b61'
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

    public static CONTEXT: any = {
        type: 'glucose_type',
        value: 1
    }
}
