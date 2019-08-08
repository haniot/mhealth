/**
 * Constants used in dependence injection.
 *
 * @abstract
 */
export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly HOME_CONTROLLER: any = Symbol.for('HomeController')
    public static readonly MEASUREMENTS_CONTROLLER: any = Symbol.for('MeasurementController')
    public static readonly MEASUREMENTS_TYPES_CONTROLLER: any = Symbol.for('MeasurementsTypesController')
    public static readonly PATIENTS_DEVICES_CONTROLLER: any = Symbol.for('PatientsDevicesController')
    public static readonly PATIENTS_MEASUREMENTS_CONTROLLER: any = Symbol.for('PatientsMeasurementsController')

    // Services
    public static readonly DEVICE_SERVICE: any = Symbol.for('DeviceService')
    public static readonly MEASUREMENT_SERVICE: any = Symbol.for('MeasurementService')

    // Repositories
    public static readonly DEVICE_REPOSITORY: any = Symbol.for('DeviceRepository')
    public static readonly MEASUREMENT_REPOSITORY: any = Symbol.for('MeasurementRepository')
    public static readonly INTEGRATION_EVENT_REPOSITORY: any = Symbol.for('IntegrationEventRepository')

    // Models
    public static readonly DEVICE_REPO_MODEL: any = Symbol.for('DeviceRepoModel')
    public static readonly MEASUREMENT_REPO_MODEL: any = Symbol.for('MeasurementRepoModel')
    public static readonly INTEGRATION_EVENT_REPO_MODEL: any = Symbol.for('IntegrationEventRepoModel')

    // Mappers
    public static readonly DEVICE_ENTITY_MAPPER: any = Symbol.for('DeviceEntityMapper')
    public static readonly MEASUREMENT_ENTITY_MAPPER: any = Symbol.for('MeasurementEntityMapper')
    public static readonly BLOOD_GLUCOSE_ENTITY_MAPPER: any = Symbol.for('BloodGlucoseEntityMapper')
    public static readonly BLOOD_PRESSURE_ENTITY_MAPPER: any = Symbol.for('BloodPressureEntityMapper')
    public static readonly BODY_TEMPERATURE_ENTITY_MAPPER: any = Symbol.for('BodyTemperatureEntityMapper')
    public static readonly HEIGHT_ENTITY_MAPPER: any = Symbol.for('HeightEntityMapper')
    public static readonly WAIST_CIRCUMFERENCE_ENTITY_MAPPER: any = Symbol.for('WaistCircumferenceEntityMapper')
    public static readonly WEIGHT_ENTITY_MAPPER: any = Symbol.for('WeightEntityMapper')
    public static readonly BODY_FAT_ENTITY_MAPPER: any = Symbol.for('BodyFatEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryRabbitMQ')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('ConnectionRabbitMQ')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')
    public static readonly RPC_SERVER_EVENT_BUST_TASK: any = Symbol.for('RpcServerEventBusTask')

    // Tasks

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
