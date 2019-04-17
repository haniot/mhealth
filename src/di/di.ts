import 'reflect-metadata'
import { Container } from 'inversify'
import { Identifier } from './identifiers'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { BackgroundService } from '../background/background.service'
import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { HomeController } from '../ui/controllers/home.controller'
import { DeviceRepoModel } from '../infrastructure/database/schema/device.schema'
import { MeasurementRepoModel } from '../infrastructure/database/schema/measurement.schema'
import { DeviceEntityMapper } from '../infrastructure/entity/mapper/device.entity.mapper'
import { MeasurementEntity } from '../infrastructure/entity/measurement.entity'
import { MeasurementEntityMapper } from '../infrastructure/entity/mapper/measurement.entity.mapper'
import { Measurement } from '../application/domain/model/measurement'
import { Device } from '../application/domain/model/device'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { DeviceEntity } from '../infrastructure/entity/device.entity'
import { IDeviceRepository } from '../application/port/device.repository.interface'
import { DeviceRepository } from '../infrastructure/repository/device.repository'
import { IMeasurementRepository } from '../application/port/measurement.repository.interface'
import { MeasurementRepository } from '../infrastructure/repository/measurement.repository'
import { IDeviceService } from '../application/port/device.service.interface'
import { DeviceService } from '../application/service/device.service'
import { IMeasurementService } from '../application/port/measurement.service.interface'
import { MeasurementService } from '../application/service/measurement.service'
import { MeasurementController } from '../ui/controllers/measurement.controller'
import { UserDeviceController } from '../ui/controllers/user.device.controller'
import { UserMeasurementController } from '../ui/controllers/user.measurement.controller'
import { BloodGlucose } from '../application/domain/model/blood.glucose'
import { BloodGlucoseEntityMapper } from '../infrastructure/entity/mapper/blood.glucose.entity.mapper'
import { BloodGlucoseEntity } from '../infrastructure/entity/blood.glucose.entity'
import { BloodPressure } from '../application/domain/model/blood.pressure'
import { BloodPressureEntity } from '../infrastructure/entity/blood.pressure.entity'
import { BloodPressureEntityMapper } from '../infrastructure/entity/mapper/blood.pressure.entity.mapper'
import { BodyTemperature } from '../application/domain/model/body.temperature'
import { BodyTemperatureEntity } from '../infrastructure/entity/body.temperature.entity'
import { BodyTemperatureEntityMapper } from '../infrastructure/entity/mapper/body.temperature.entity.mapper'
import { HeartRate } from '../application/domain/model/heart.rate'
import { HeartRateEntity } from '../infrastructure/entity/heart.rate.entity'
import { HeartRateEntityMapper } from '../infrastructure/entity/mapper/heart.rate.entity.mapper'
import { Height } from '../application/domain/model/height'
import { HeightEntity } from '../infrastructure/entity/height.entity'
import { HeightEntityMapper } from '../infrastructure/entity/mapper/height.entity.mapper'
import { WaistCircumference } from '../application/domain/model/waist.circumference'
import { WaistCircumferenceEntity } from '../infrastructure/entity/waist.circumference.entity'
import { WaistCircumferenceEntityMapper } from '../infrastructure/entity/mapper/waist.circumference.entity.mapper'
import { Weight } from '../application/domain/model/weight'
import { WeightEntity } from '../infrastructure/entity/weight.entity'
import { WeightEntityMapper } from '../infrastructure/entity/mapper/weight.entity.mapper'
import { IBloodGlucoseRepository } from '../application/port/blood.glucose.repository.interface'
import { BloodGlucoseRepository } from '../infrastructure/repository/blood.glucose.repository'
import { IBloodPressureRepository } from '../application/port/blood.pressure.repository.interface'
import { BloodPressureRepository } from '../infrastructure/repository/blood.pressure.repository'
import { IBodyTemperatureRepository } from '../application/port/body.temperature.repository.interface'
import { BodyTemperatureRepository } from '../infrastructure/repository/body.temperature.repository'
import { IHeartRateRepository } from '../application/port/heart.rate.repository.interface'
import { HeartRateRepository } from '../infrastructure/repository/heart.rate.repository'
import { IHeightRepository } from '../application/port/height.repository.interface'
import { HeightRepository } from '../infrastructure/repository/height.repository'
import { IWaistCircumferenceRepository } from '../application/port/waist.circumference.repository.interface'
import { WaistCircumferenceRepository } from '../infrastructure/repository/waist.circumference.repository'
import { IWeightRepository } from '../application/port/weight.repository.interface'
import { WeightRepository } from '../infrastructure/repository/weight.repository'
import { HeightRepoModel } from '../infrastructure/database/schema/height.schema'
import { BloodGlucoseRepoModel } from '../infrastructure/database/schema/blood.glucose.schema'
import { WeightRepoModel } from '../infrastructure/database/schema/weight.schema'
import { WaistCircumferenceRepoModel } from '../infrastructure/database/schema/waist.circumference.schema'
import { HeartRateRepoModel } from '../infrastructure/database/schema/heart.rate.schema'
import { BodyTemperatureRepoModel } from '../infrastructure/database/schema/body.temperature.schema'
import { BloodPressureRepoModel } from '../infrastructure/database/schema/blood.pressure.schema'

export class DI {
    private static instance: DI
    private readonly container: Container

    /**
     * Creates an instance of DI.
     *
     * @private
     */
    private constructor() {
        this.container = new Container()
        this.initDependencies()
    }

    /**
     * Recover single instance of class.
     *
     * @static
     * @return {App}
     */
    public static getInstance(): DI {
        if (!this.instance) this.instance = new DI()
        return this.instance
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    public getContainer(): Container {
        return this.container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this.container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this.container.bind<HomeController>(Identifier.HOME_CONTROLLER)
            .to(HomeController).inSingletonScope()
        this.container.bind<MeasurementController>(Identifier.MEASUREMENT_CONTROLLER)
            .to(MeasurementController).inSingletonScope()
        this.container.bind<UserDeviceController>(Identifier.USER_DEVICE_CONTROLLER)
            .to(UserDeviceController).inSingletonScope()
        this.container.bind<UserMeasurementController>(Identifier.USER_MEASUREMENT_CONTROLLER)
            .to(UserMeasurementController).inSingletonScope()

        // Services
        this.container.bind<IDeviceService>(Identifier.DEVICE_SERVICE).to(DeviceService).inSingletonScope()
        this.container.bind<IMeasurementService>(Identifier.MEASUREMENT_SERVICE).to(MeasurementService).inSingletonScope()

        // Repositories
        this.container.bind<IDeviceRepository>(Identifier.DEVICE_REPOSITORY)
            .to(DeviceRepository).inSingletonScope()
        this.container.bind<IMeasurementRepository>(Identifier.MEASUREMENT_REPOSITORY)
            .to(MeasurementRepository).inSingletonScope()
        this.container.bind<IBloodGlucoseRepository>(Identifier.BLOOD_GLUCOSE_REPOSITORY)
            .to(BloodGlucoseRepository).inSingletonScope()
        this.container.bind<IBloodPressureRepository>(Identifier.BLOOD_PRESSURE_REPOSITORY)
            .to(BloodPressureRepository).inSingletonScope()
        this.container.bind<IBodyTemperatureRepository>(Identifier.BODY_TEMPERATURE_REPOSITORY)
            .to(BodyTemperatureRepository).inSingletonScope()
        this.container.bind<IHeartRateRepository>(Identifier.HEART_RATE_REPOSITORY)
            .to(HeartRateRepository).inSingletonScope()
        this.container.bind<IHeightRepository>(Identifier.HEIGHT_REPOSITORY)
            .to(HeightRepository).inSingletonScope()
        this.container.bind<IWaistCircumferenceRepository>(Identifier.WAIST_CIRCUMFERENCE_REPOSITORY)
            .to(WaistCircumferenceRepository).inSingletonScope()
        this.container.bind<IWeightRepository>(Identifier.WEIGHT_REPOSITORY)
            .to(WeightRepository).inSingletonScope()

        // Models
        this.container.bind(Identifier.DEVICE_REPO_MODEL).toConstantValue(DeviceRepoModel)
        this.container.bind(Identifier.MEASUREMENT_REPO_MODEL).toConstantValue(MeasurementRepoModel)
        this.container.bind(Identifier.BLOOD_GLUCOSE_REPO_MODEL).toConstantValue(BloodGlucoseRepoModel)
        this.container.bind(Identifier.BLOOD_PRESSURE_REPO_MODEL).toConstantValue(BloodPressureRepoModel)
        this.container.bind(Identifier.BODY_TEMPERATURE_REPO_MODEL).toConstantValue(BodyTemperatureRepoModel)
        this.container.bind(Identifier.HEART_RATE_REPO_MODEL).toConstantValue(HeartRateRepoModel)
        this.container.bind(Identifier.HEIGHT_REPO_MODEL).toConstantValue(HeightRepoModel)
        this.container.bind(Identifier.WAIST_CIRCUMFERENCE_REPO_MODEL).toConstantValue(WaistCircumferenceRepoModel)
        this.container.bind(Identifier.WEIGHT_REPO_MODEL).toConstantValue(WeightRepoModel)

        // Mappers
        this.container
            .bind<IEntityMapper<Device, DeviceEntity>>(Identifier.DEVICE_ENTITY_MAPPER)
            .to(DeviceEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<Measurement, MeasurementEntity>>(Identifier.MEASUREMENT_ENTITY_MAPPER)
            .to(MeasurementEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<BloodGlucose, BloodGlucoseEntity>>(Identifier.BLOOD_GLUCOSE_ENTITY_MAPPER)
            .to(BloodGlucoseEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<BloodPressure, BloodPressureEntity>>(Identifier.BLOOD_PRESSURE_ENTITY_MAPPER)
            .to(BloodPressureEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<BodyTemperature, BodyTemperatureEntity>>(Identifier.BODY_TEMPERATURE_ENTITY_MAPPER)
            .to(BodyTemperatureEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<HeartRate, HeartRateEntity>>(Identifier.HEART_RATE_ENTITY_MAPPER)
            .to(HeartRateEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<Height, HeightEntity>>(Identifier.HEIGHT_ENTITY_MAPPER)
            .to(HeightEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<WaistCircumference, WaistCircumferenceEntity>>(Identifier.WAIST_CIRCUMFERENCE_ENTITY_MAPPER)
            .to(WaistCircumferenceEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<Weight, WeightEntity>>(Identifier.WEIGHT_ENTITY_MAPPER)
            .to(WeightEntityMapper).inSingletonScope()

        // Background Services
        this.container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this.container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this.container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Tasks

        // Log
        this.container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}
