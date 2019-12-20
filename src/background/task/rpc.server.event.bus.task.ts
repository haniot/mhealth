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
import { IQuery } from '../../application/port/query.interface'
import fs from 'fs'
import { Default } from '../../utils/default'
import { IPhysicalActivityRepository } from '../../application/port/physical.activity.repository.interface'
import { ISleepRepository } from '../../application/port/sleep.repository.interface'
import { PhysicalActivity } from '../../application/domain/model/physical.activity'
import { Sleep } from '../../application/domain/model/sleep'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _measurementRepo: IMeasurementRepository,
        @inject(Identifier.ACTIVITY_REPOSITORY) private readonly _activityRepo: IPhysicalActivityRepository,
        @inject(Identifier.SLEEP_REPOSITORY) private readonly _sleepRepo: ISleepRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        // To use SSL/TLS, simply mount the uri with the amqps protocol and pass the CA.
        const rabbitUri = process.env.RABBITMQ_URI || Default.RABBITMQ_URI
        const rabbitOptions: any = { sslOptions: { ca: [] } }
        if (rabbitUri.indexOf('amqps') === 0) {
            rabbitOptions.sslOptions.ca = [fs.readFileSync(process.env.RABBITMQ_CA_PATH || Default.RABBITMQ_CA_PATH)]
        }
        // It RPC Server events, that for some reason could not
        // e sent and were saved for later submission.
        this._eventBus
            .connectionRpcServer
            .open(rabbitUri, rabbitOptions)
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
                try {
                    const query: IQuery = this.buildQS(_query, 'timestamp')
                    const result: Array<any> = await this._measurementRepo.find(query)
                    return result.map(item => item.toJSON())
                } catch (err) {
                    return err
                }
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

        this._eventBus
            .provideResource('physicalactivities.find', async (_query?: string) => {
                try {
                    const query: IQuery = this.buildQS(_query, 'start_time')
                    const result: Array<PhysicalActivity> = await this._activityRepo.find(query)
                    return result.map(item => item.toJSON())
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource physicalactivities.find successful registered'))
            .catch((err) => this._logger.error(`Error at register resource physicalactivities.find: ${err.message}`))

        this._eventBus
            .provideResource('sleep.find', async (_query?: string) => {
                try {
                    const query: IQuery = this.buildQS(_query, 'start_time')
                    const result: Array<Sleep> = await this._sleepRepo.find(query)
                    return result.map(item => item.toJSON())
                } catch (err) {
                    return err
                }
            })
            .then(() => this._logger.info('Resource sleep.find successful registered'))
            .catch((err) => this._logger.error(`Error at register resource sleep.find: ${err.message}`))
    }

    /**
     * Prepare query string based on defaults parameters and values.
     *
     * @param query
     * @param dateField
     */
    private buildQS(query?: any, dateField?: string): IQuery {
        return new Query().fromJSON(
            qs.parser(query ? query : {}, { pagination: { limit: Number.MAX_SAFE_INTEGER } },
                { use_page: true, date_fields: { start_at: dateField, end_at: dateField } })
        )
    }
}
