import HttpStatus from 'http-status-codes'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { Measurement } from '../../application/domain/model/measurement'
import { IMeasurementService } from '../../application/port/measurement.service.interface'

@controller('/measurements')
export class MeasurementController {
    constructor(
        @inject(Identifier.MEASUREMENT_SERVICE) private readonly _service: IMeasurementService
    ) {
    }

    @httpGet('/')
    public async getAllMeasurements(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<Measurement> = await this._service.getAll(new Query().fromJSON(req.query))
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    private toJSONView(measurements: Array<Measurement>): object {
        return measurements.map(measurement => measurement.toJSON())
    }
}
