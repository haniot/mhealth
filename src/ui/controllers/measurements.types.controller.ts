import HttpStatus from 'http-status-codes'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Default } from '../../utils/default'

@controller('/v1/measurements/types')
export class MeasurementsTypesController {

    @httpGet('/')
    public async getMeasurementsTypes(@request() req: Request, @response() res: Response) {
        return res.status(HttpStatus.OK).send(Default.MEASUREMENTS_TYPES)
    }
}
