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
import { DeviceController } from '../ui/controllers/device.controller'
import { MeasurementController } from '../ui/controllers/measurement.controller'

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
        this.container.bind<HomeController>(Identifier.HOME_CONTROLLER).to(HomeController).inSingletonScope()
        this.container.bind<DeviceController>(Identifier.DEVICE_CONTROLLER).to(DeviceController).inSingletonScope()
        this.container.bind<MeasurementController>(Identifier.MEASUREMENT_CONTROLLER).to(MeasurementController).inSingletonScope()

        // Services
        this.container.bind<IDeviceService>(Identifier.DEVICE_SERVICE).to(DeviceService).inSingletonScope()
        this.container.bind<IMeasurementService>(Identifier.MEASUREMENT_SERVICE).to(MeasurementService).inSingletonScope()

        // Repositories
        this.container.bind<IDeviceRepository>(Identifier.DEVICE_REPOSITORY)
            .to(DeviceRepository).inSingletonScope()
        this.container.bind<IMeasurementRepository>(Identifier.MEASUREMENT_REPOSITORY)
            .to(MeasurementRepository).inSingletonScope()

        // Models
        this.container.bind(Identifier.DEVICE_REPO_MODEL).toConstantValue(DeviceRepoModel)
        this.container.bind(Identifier.MEASUREMENT_REPO_MODEL).toConstantValue(MeasurementRepoModel)

        // Mappers
        this.container
            .bind<IEntityMapper<Device, DeviceEntity>>(Identifier.DEVICE_ENTITY_MAPPER)
            .to(DeviceEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<Measurement, MeasurementEntity>>(Identifier.MEASUREMENT_ENTITY_MAPPER)
            .to(MeasurementEntityMapper).inSingletonScope()

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
