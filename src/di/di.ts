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
import { PatientsDevicesController } from '../ui/controllers/patients.devices.controller'
import { PatientsMeasurementsController } from '../ui/controllers/patients.measurements.controller'
import { BloodGlucose } from '../application/domain/model/blood.glucose'
import { BloodGlucoseEntityMapper } from '../infrastructure/entity/mapper/blood.glucose.entity.mapper'
import { BloodGlucoseEntity } from '../infrastructure/entity/blood.glucose.entity'
import { BloodPressure } from '../application/domain/model/blood.pressure'
import { BloodPressureEntity } from '../infrastructure/entity/blood.pressure.entity'
import { BloodPressureEntityMapper } from '../infrastructure/entity/mapper/blood.pressure.entity.mapper'
import { BodyTemperature } from '../application/domain/model/body.temperature'
import { BodyTemperatureEntity } from '../infrastructure/entity/body.temperature.entity'
import { BodyTemperatureEntityMapper } from '../infrastructure/entity/mapper/body.temperature.entity.mapper'
import { Height } from '../application/domain/model/height'
import { HeightEntity } from '../infrastructure/entity/height.entity'
import { HeightEntityMapper } from '../infrastructure/entity/mapper/height.entity.mapper'
import { WaistCircumference } from '../application/domain/model/waist.circumference'
import { WaistCircumferenceEntity } from '../infrastructure/entity/waist.circumference.entity'
import { WaistCircumferenceEntityMapper } from '../infrastructure/entity/mapper/waist.circumference.entity.mapper'
import { Weight } from '../application/domain/model/weight'
import { WeightEntity } from '../infrastructure/entity/weight.entity'
import { WeightEntityMapper } from '../infrastructure/entity/mapper/weight.entity.mapper'
import { BodyFatEntity } from '../infrastructure/entity/body.fat.entity'
import { BodyFat } from '../application/domain/model/body.fat'
import { BodyFatEntityMapper } from '../infrastructure/entity/mapper/body.fat.entity.mapper'
import { MeasurementsTypesController } from '../ui/controllers/measurements.types.controller'
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { SubscribeEventBusTask } from '../background/task/subscribe.event.bus.task'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { IPhysicalActivityService } from '../application/port/physical.activity.service.interface'
import { PhysicalActivityService } from '../application/service/physical.activity.service'
import { ISleepService } from '../application/port/sleep.service.interface'
import { SleepService } from '../application/service/sleep.service'
import { IPhysicalActivityRepository } from '../application/port/physical.activity.repository.interface'
import { ISleepRepository } from '../application/port/sleep.repository.interface'
import { PhysicalActivity } from '../application/domain/model/physical.activity'
import { Sleep } from '../application/domain/model/sleep'
import { ActivityRepoModel } from '../infrastructure/database/schema/activity.schema'
import { SleepRepoModel } from '../infrastructure/database/schema/sleep.schema'
import { ActivityEntity } from '../infrastructure/entity/activity.entity'
import { PhysicalActivityEntityMapper } from '../infrastructure/entity/mapper/physical.activity.entity.mapper'
import { SleepEntity } from '../infrastructure/entity/sleep.entity'
import { SleepEntityMapper } from '../infrastructure/entity/mapper/sleep.entity.mapper'
import { PhysicalActivityRepository } from '../infrastructure/repository/physical.activity.repository'
import { SleepRepository } from '../infrastructure/repository/sleep.repository'
import { PatientsActivityController } from '../ui/controllers/patients.activity.controller'
import { PatientsSleepController } from '../ui/controllers/patients.sleep.controller'
import { IntegrationEventRepository } from '../infrastructure/repository/integration.event.repository'
import { IIntegrationEventRepository } from '../application/port/integration.event.repository.interface'
import { IntegrationEventRepoModel } from '../infrastructure/database/schema/integration.event.schema'
import { PublishEventBusTask } from '../background/task/publish.event.bus.task'
import { AwakeningsTask } from '../background/task/awakenings.task'
import { PatientsSleepDurationsController } from '../ui/controllers/patients.sleep.durations.controller'
import { ISleepDurationService } from '../application/port/sleep.duration.service.interface'
import { SleepDurationService } from '../application/service/sleep.duration.service'
import { ISleepDurationRepository } from '../application/port/sleep.duration.repository.interface'
import { SleepDurationRepository } from '../infrastructure/repository/sleep.duration.repository'
import { SleepDuration } from '../application/domain/model/sleep.duration'
import { SleepDurationEntity } from '../infrastructure/entity/sleep.duration.entity'
import { SleepDurationEntityMapper } from '../infrastructure/entity/mapper/sleep.duration.entity.mapper'
import { HandGrip } from '../application/domain/model/hand.grip'
import { HandGripEntity } from '../infrastructure/entity/hand.grip.entity'
import { HandGripEntityMapper } from '../infrastructure/entity/mapper/hand.grip.entity.mapper'
import { CalfCircumference } from '../application/domain/model/calf.circumference'
import { CalfCircumferenceEntity } from '../infrastructure/entity/calf.circumference.entity'
import { CalfCircumferenceEntityMapper } from '../infrastructure/entity/mapper/calf.circumference.entity.mapper'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'

export class IoC {
    private readonly _container: Container

    /**
     * Creates an instance of DI.
     *
     * @private
     */
    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    get container(): Container {
        return this._container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container.bind<HomeController>(Identifier.HOME_CONTROLLER)
            .to(HomeController).inSingletonScope()
        this._container.bind<MeasurementsTypesController>(Identifier.MEASUREMENTS_TYPES_CONTROLLER)
            .to(MeasurementsTypesController).inSingletonScope()
        this._container.bind<PatientsDevicesController>(Identifier.PATIENTS_DEVICES_CONTROLLER)
            .to(PatientsDevicesController).inSingletonScope()
        this._container.bind<PatientsMeasurementsController>(Identifier.PATIENTS_MEASUREMENTS_CONTROLLER)
            .to(PatientsMeasurementsController).inSingletonScope()
        this._container.bind<PatientsActivityController>(Identifier.PATIENTS_ACTIVITY_CONTROLLER)
            .to(PatientsActivityController).inSingletonScope()
        this._container.bind<PatientsSleepController>(Identifier.PATIENTS_SLEEP_CONTROLLER)
            .to(PatientsSleepController).inSingletonScope()
        this._container.bind<PatientsSleepDurationsController>(Identifier.PATIENTS_SLEEP_DURATION_CONTROLLER)
            .to(PatientsSleepDurationsController).inSingletonScope()

        // Services
        this._container.bind<IDeviceService>(Identifier.DEVICE_SERVICE).to(DeviceService).inSingletonScope()
        this._container.bind<IMeasurementService>(Identifier.MEASUREMENT_SERVICE).to(MeasurementService).inSingletonScope()
        this._container.bind<IPhysicalActivityService>(Identifier.ACTIVITY_SERVICE).to(PhysicalActivityService).inSingletonScope()
        this._container.bind<ISleepService>(Identifier.SLEEP_SERVICE).to(SleepService).inSingletonScope()
        this._container.bind<ISleepDurationService>(Identifier.SLEEP_DURATION_SERVICE).to(SleepDurationService).inSingletonScope()

        // Repositories
        this._container.bind<IDeviceRepository>(Identifier.DEVICE_REPOSITORY)
            .to(DeviceRepository).inSingletonScope()
        this._container.bind<IMeasurementRepository>(Identifier.MEASUREMENT_REPOSITORY)
            .to(MeasurementRepository).inSingletonScope()
        this._container.bind<IPhysicalActivityRepository>(Identifier.ACTIVITY_REPOSITORY)
            .to(PhysicalActivityRepository).inSingletonScope()
        this._container.bind<ISleepRepository>(Identifier.SLEEP_REPOSITORY)
            .to(SleepRepository).inSingletonScope()
        this._container.bind<ISleepDurationRepository>(Identifier.SLEEP_DURATION_REPOSITORY)
            .to(SleepDurationRepository).inSingletonScope()
        this._container
            .bind<IIntegrationEventRepository>(Identifier.INTEGRATION_EVENT_REPOSITORY)
            .to(IntegrationEventRepository).inSingletonScope()

        // Models
        this._container.bind(Identifier.DEVICE_REPO_MODEL).toConstantValue(DeviceRepoModel)
        this._container.bind(Identifier.MEASUREMENT_REPO_MODEL).toConstantValue(MeasurementRepoModel)
        this._container.bind(Identifier.ACTIVITY_REPO_MODEL).toConstantValue(ActivityRepoModel)
        this._container.bind(Identifier.SLEEP_REPO_MODEL).toConstantValue(SleepRepoModel)
        this._container.bind(Identifier.INTEGRATION_EVENT_REPO_MODEL).toConstantValue(IntegrationEventRepoModel)


        // Mappers
        this._container
            .bind<IEntityMapper<Device, DeviceEntity>>(Identifier.DEVICE_ENTITY_MAPPER)
            .to(DeviceEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Measurement, MeasurementEntity>>(Identifier.MEASUREMENT_ENTITY_MAPPER)
            .to(MeasurementEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<BloodGlucose, BloodGlucoseEntity>>(Identifier.BLOOD_GLUCOSE_ENTITY_MAPPER)
            .to(BloodGlucoseEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<BloodPressure, BloodPressureEntity>>(Identifier.BLOOD_PRESSURE_ENTITY_MAPPER)
            .to(BloodPressureEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<BodyTemperature, BodyTemperatureEntity>>(Identifier.BODY_TEMPERATURE_ENTITY_MAPPER)
            .to(BodyTemperatureEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Height, HeightEntity>>(Identifier.HEIGHT_ENTITY_MAPPER)
            .to(HeightEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<WaistCircumference, WaistCircumferenceEntity>>(Identifier.WAIST_CIRCUMFERENCE_ENTITY_MAPPER)
            .to(WaistCircumferenceEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Weight, WeightEntity>>(Identifier.WEIGHT_ENTITY_MAPPER)
            .to(WeightEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<BodyFat, BodyFatEntity>>(Identifier.BODY_FAT_ENTITY_MAPPER)
            .to(BodyFatEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<HandGrip, HandGripEntity>>(Identifier.HAND_GRIP_ENTITY_MAPPER)
            .to(HandGripEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<CalfCircumference, CalfCircumferenceEntity>>(Identifier.CALF_CIRCUMFERENCE_ENTITY_MAPPER)
            .to(CalfCircumferenceEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<PhysicalActivity, ActivityEntity>>(Identifier.ACTIVITY_ENTITY_MAPPER)
            .to(PhysicalActivityEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<Sleep, SleepEntity>>(Identifier.SLEEP_ENTITY_MAPPER)
            .to(SleepEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<SleepDuration, SleepDurationEntity>>(Identifier.SLEEP_DURATION_ENTITY_MAPPER)
            .to(SleepDurationEntityMapper).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this._container
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.PUBLISH_EVENT_BUS_TASK)
            .to(PublishEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
            .to(SubscribeEventBusTask).inSingletonScope()
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUS_TASK)
            .to(RpcServerEventBusTask).inRequestScope()
        this._container
            .bind<AwakeningsTask>(Identifier.AWAKENINGS_TASK)
            .to(AwakeningsTask).inSingletonScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
