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

@controller('/users/:user_id/measurements')
export class UserMeasurementController {
    constructor(
        @inject(Identifier.MEASUREMENT_SERVICE) private readonly _service: IMeasurementService
    ) {
    }

    @httpPost('/')
    public async addMeasurementFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
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
}
