import HttpStatus from 'http-status-codes'
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { Strings } from '../../utils/strings'
import { ApiException } from '../exception/api.exception'
import { IMeasurementService } from '../../application/port/measurement.service.interface'
import { Measurement } from '../../application/domain/model/measurement'
import { MeasurementTypes } from '../../application/domain/utils/measurement.types'
import { Height } from '../../application/domain/model/height'
import { HeartRate } from '../../application/domain/model/heart.rate'
import { BloodPressure } from '../../application/domain/model/blood.pressure'
import { Weight } from '../../application/domain/model/weight'
import { BloodGlucose } from '../../application/domain/model/blood.glucose'
import { BodyTemperature } from '../../application/domain/model/body.temperature'
import { WaistCircumference } from '../../application/domain/model/waist.circumference'
import { Fat } from '../../application/domain/model/fat'

@controller('/users/:user_id/measurements')
export class UserMeasurementController {
    constructor(
        @inject(Identifier.MEASUREMENT_SERVICE) private readonly _service: IMeasurementService
    ) {
    }

    @httpPost('/')
    public async addMeasurementFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            let result: any
            if (req.body instanceof Array) {
                result = await this._service.addMeasurement(req.body.map(item => {
                    item.user_id = req.params.user_id
                    return this.jsonToModel(item)
                }))
            } else {
                req.body.user_id = req.params.user_id
                result = await this._service.addMeasurement(this.jsonToModel(req.body))
            }
            if (result.success && result.error) return res.status(HttpStatus.MULTI_STATUS).send(this.toJSONView(result))
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpGet('/')
    public async getAllMeasurementsFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.query)
            query.addFilter({ user_id: req.params.user_id })
            const result: Array<Measurement> = await this._service.getAll(query)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpGet('/:measurement_id')
    public async getMeasurementFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.query)
            query.addFilter({ user_id: req.params.user_id })
            const result: Measurement = await this._service.getById(req.params.measurement_id, query)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageMeasurementNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpDelete('/:measurement_id')
    public async deleteMeasurementFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._service.removeMeasurement(req.params.measurement_id, req.params.user_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    private toJSONView(item: any | Array<any>): object {
        if (item instanceof Array) return item.map(measurement => {
            measurement.user_id = undefined
            return measurement.toJSON()
        })
        item.user_id = undefined
        return item.toJSON()
    }

    private getMessageMeasurementNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.MEASUREMENT.NOT_FOUND,
            Strings.MEASUREMENT.NOT_FOUND_DESC
        ).toJson()
    }

    private jsonToModel(item: any): any {
        if (item.type) {
            switch (item.type) {
                case MeasurementTypes.HEIGHT:
                    return new Height().fromJSON(item)
                case MeasurementTypes.HEART_RATE:
                    return new HeartRate().fromJSON(item)
                case MeasurementTypes.BLOOD_PRESSURE:
                    return new BloodPressure().fromJSON(item)
                case MeasurementTypes.WEIGHT:
                    if (item.fat !== undefined) {
                        item.fat = {
                            ...item.fat,
                            ...{
                                device_id: item.device_id,
                                timestamp: item.timestamp,
                                user_id: item.user_id
                            }
                        }
                    }
                    return new Weight().fromJSON(item)
                case MeasurementTypes.BLOOD_GLUCOSE:
                    return new BloodGlucose().fromJSON(item)
                case MeasurementTypes.BODY_TEMPERATURE:
                    return new BodyTemperature().fromJSON(item)
                case MeasurementTypes.WAIST_CIRCUMFERENCE:
                    return new WaistCircumference().fromJSON(item)
                case MeasurementTypes.FAT:
                    return new Fat().fromJSON(item)
                default:
                    return item
            }
        }
        return undefined
    }
}
