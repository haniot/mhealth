import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Query } from '../../infrastructure/repository/query/query'
import qs from 'query-strings-parser'
import { IMeasurementRepository } from '../../application/port/measurement.repository.interface'
import { ObjectIdValidator } from '../../application/domain/validator/object.id.validator'
import { MeasurementTypes } from '../../application/domain/utils/measurement.types'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _measurementRepo: IMeasurementRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        // It RPC Server events, that for some reason could not
        // e sent and were saved for later submission.
        this._eventBus
            .connectionRpcServer
            .open(0, 2000)
            .then(() => {
                this._logger.info('Connection with RPC Server opened successful!')
                this.initializeServer()
            })
            .catch(err => {
                this._logger.error(`Error trying to get connection to Event Bus for RPC Server. ${err.message}`)
            })
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping RPC Server! ${err.message}`))
        }
    }

    private initializeServer(): void {
        this._eventBus
            .provideResource('measurements.find', async (_query?: string) => {
                const query: Query = new Query().fromJSON({ ...qs.parser(_query) })
                const result: Array<any> = await this._measurementRepo.find(query)
                return result.map(item => item.toJSON())
            })
            .then(() => this._logger.info('Resource measurements.find successful registered'))
            .catch((err) => this._logger.error(`Error at register resource measurements.find: ${err.message}`))

        this._eventBus
            .provideResource('measurements.find.last', async (patientId: string) => {
                try {
                    const result: any = {}
                    ObjectIdValidator.validate(patientId)

                    result.blood_glucose =
                        await this._measurementRepo.getLastMeasurement(patientId, MeasurementTypes.BLOOD_GLUCOSE)
                    result.blood_pressure =
                        await this._measurementRepo.getLastMeasurement(patientId, MeasurementTypes.BLOOD_PRESSURE)
                    result.body_fat =
                        await this._measurementRepo.getLastMeasurement(patientId, MeasurementTypes.BODY_FAT)
                    result.body_temperature =
                        await this._measurementRepo.getLastMeasurement(patientId, MeasurementTypes.BODY_TEMPERATURE)
                    result.height = await this._measurementRepo.getLastMeasurement(patientId, MeasurementTypes.HEIGHT)
                    result.waist_circumference =
                        await this._measurementRepo.getLastMeasurement(patientId, MeasurementTypes.WAIST_CIRCUMFERENCE)
                    result.weight = await this._measurementRepo.getLastMeasurement(patientId, MeasurementTypes.WEIGHT)

                    return result
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource measurements.find.last successful registered'))
            .catch((err) => {
                this._logger.error(`Error at register resource measurements.find.last: ${err.message}`)
            })
    }
}
