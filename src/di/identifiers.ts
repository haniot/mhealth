/**
 * Constants used in dependence injection.
 *
 * @abstract
 */
export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly HOME_CONTROLLER: any = Symbol.for('HomeController')
    public static readonly MEASUREMENT_CONTROLLER: any = Symbol.for('MeasurementController')
    public static readonly USER_DEVICE_CONTROLLER: any = Symbol.for('UserDeviceController')
    public static readonly USER_MEASUREMENT_CONTROLLER: any = Symbol.for('UserMeasurementController')

    // Services
    public static readonly DEVICE_SERVICE: any = Symbol.for('DeviceService')
    public static readonly MEASUREMENT_SERVICE: any = Symbol.for('MeasurementService')

    // Repositories
    public static readonly DEVICE_REPOSITORY: any = Symbol.for('DeviceRepository')
    public static readonly MEASUREMENT_REPOSITORY: any = Symbol.for('MeasurementRepository')
    public static readonly BLOOD_GLUCOSE_REPOSITORY: any = Symbol.for('BloodGlucoseRepository')
    public static readonly BLOOD_PRESSURE_REPOSITORY: any = Symbol.for('BloodPressureRepository')
    public static readonly BODY_TEMPERATURE_REPOSITORY: any = Symbol.for('BodyTemperatureRepository')
    public static readonly HEART_RATE_REPOSITORY: any = Symbol.for('HeartRateRepository')
    public static readonly HEIGHT_REPOSITORY: any = Symbol.for('HeightRepository')
    public static readonly WAIST_CIRCUMFERENCE_REPOSITORY: any = Symbol.for('WaistCircumferenceRepository')
    public static readonly WEIGHT_REPOSITORY: any = Symbol.for('WeightRepository')
    public static readonly FAT_REPOSITORY: any = Symbol.for('FatRepository')

    // Models
    public static readonly DEVICE_REPO_MODEL: any = Symbol.for('DeviceRepoModel')
    public static readonly MEASUREMENT_REPO_MODEL: any = Symbol.for('MeasurementRepoModel')
    public static readonly BLOOD_GLUCOSE_REPO_MODEL: any = Symbol.for('BloodGlucoseRepoModel')
    public static readonly BLOOD_PRESSURE_REPO_MODEL: any = Symbol.for('BloodPressureRepoModel')
    public static readonly BODY_TEMPERATURE_REPO_MODEL: any = Symbol.for('BodyTemperatureRepoModel')
    public static readonly HEART_RATE_REPO_MODEL: any = Symbol.for('HeartRateRepoModel')
    public static readonly HEIGHT_REPO_MODEL: any = Symbol.for('HeightRepoModel')
    public static readonly WAIST_CIRCUMFERENCE_REPO_MODEL: any = Symbol.for('WaistCircumferenceRepoModel')
    public static readonly WEIGHT_REPO_MODEL: any = Symbol.for('WeightRepoModel')
    public static readonly FAT_REPO_MODEL: any = Symbol.for('FatRepoModel')

    // Mappers
    public static readonly DEVICE_ENTITY_MAPPER: any = Symbol.for('DeviceEntityMapper')
    public static readonly MEASUREMENT_ENTITY_MAPPER: any = Symbol.for('MeasurementEntityMapper')
    public static readonly BLOOD_GLUCOSE_ENTITY_MAPPER: any = Symbol.for('BloodGlucoseEntityMapper')
    public static readonly BLOOD_PRESSURE_ENTITY_MAPPER: any = Symbol.for('BloodPressureEntityMapper')
    public static readonly BODY_TEMPERATURE_ENTITY_MAPPER: any = Symbol.for('BodyTemperatureEntityMapper')
    public static readonly HEART_RATE_ENTITY_MAPPER: any = Symbol.for('HeartRateEntityMapper')
    public static readonly HEIGHT_ENTITY_MAPPER: any = Symbol.for('HeightEntityMapper')
    public static readonly WAIST_CIRCUMFERENCE_ENTITY_MAPPER: any = Symbol.for('WaistCircumferenceEntityMapper')
    public static readonly WEIGHT_ENTITY_MAPPER: any = Symbol.for('WeightEntityMapper')
    public static readonly FAT_ENTITY_MAPPER: any = Symbol.for('FatEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')

    // Tasks

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
