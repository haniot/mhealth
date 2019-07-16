import HttpStatus from 'http-status-codes'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { IMeasurementService } from '../../application/port/measurement.service.interface'

@controller('/v1/measurements')
export class MeasurementController {
    constructor(
        @inject(Identifier.MEASUREMENT_SERVICE) private readonly _service: IMeasurementService
    ) {
    }

    @httpGet('/')
    public async getAllMeasurements(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<any> = await this._service.getAll(new Query().fromJSON(req.query))
            const count: number = await this._service.count(new Query())
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    private toJSONView(measurements: Array<any>): object {
        return measurements.map(measurement => measurement.toJSON())
    }
}
