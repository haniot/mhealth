import HttpStatus from 'http-status-codes'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
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

@controller('/users/:user_id/measurements')
export class UserMeasurementController {
    constructor(
        @inject(Identifier.MEASUREMENT_SERVICE) private readonly _service: IMeasurementService
    ) {
    }

    @httpPost('/')
    public async addMeasurementFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            if (req.body instanceof Array) {
                req.body.forEach(async item => {
                    item.user_id = req.params.user_id
                })
            }
            const measurement: Measurement = new Measurement().fromJSON(req.body)
            measurement.user_id = req.params.user_id
            const result: Measurement = await this._service.add(measurement)
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

    @httpPatch('/:measurement_id')
    public async updateMeasurementFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const measurement: Measurement = new Measurement().fromJSON(req.body)
            measurement.id = req.params.measurement_id
            measurement.user_id = req.params.user_id
            const result: Measurement = await this._service.update(measurement)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageMeasurementNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
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

    private toJSONView(item: Measurement | Array<Measurement>): object {
        if (item instanceof Array) return item.map(measurement => measurement.toJSON())
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
        if (item instanceof Array) return item.map(value => this.jsonToModel(value))
        if (item.type) {
            switch (item.type) {
                case MeasurementTypes.HEIGHT:
                    return new Height().fromJSON(item)
                case MeasurementTypes.HEART_RATE:
                    return new HeartRate().fromJSON(item)
                case MeasurementTypes.BLOOD_PRESSURE:
                    return new BloodPressure().fromJSON(item)
                case MeasurementTypes.WEIGHT:
                    return new Weight().fromJSON(item)
                case MeasurementTypes.BLOOD_GLUCOSE:
                    return new BloodGlucose().fromJSON(item)
                case MeasurementTypes.BODY_TEMPERATURE:
                    return new BodyTemperature().fromJSON(item)
                case MeasurementTypes.WAIST_CIRCUMFERENCE:
                    return new WaistCircumference().fromJSON(item)
            }
        }
        return undefined
    }
}
