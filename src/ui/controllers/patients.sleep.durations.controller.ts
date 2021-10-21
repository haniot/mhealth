import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ILogger } from '../../utils/custom.logger'
import { SleepDuration } from '../../application/domain/model/sleep.duration'
import { ISleepDurationService } from '../../application/port/sleep.duration.service.interface'

/**
 * Controller that implements SleepDuration feature operations.
 *
 * @remarks To define paths, we use library inversify-express-utils.
 * @see {@link https://github.com/inversify/inversify-express-utils} for further information.
 */
@controller('/v1/patients/:patient_id/date/:start_date/:end_date/sleep/durations')
export class PatientsSleepDurationsController {

    /**
     * Creates an instance of SleepDuration controller.
     *
     * @param {ISleepDurationService} _sleepDurationService
     * @param {ILogger} _logger
     */
    constructor(
        @inject(Identifier.SLEEP_DURATION_SERVICE) private readonly _sleepDurationService: ISleepDurationService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    /**
     * Retrieves all sleep durations by patient.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/')
    public async getSleepDuration(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: SleepDuration = await this._sleepDurationService
                .getDurationByPatient(req.params.patient_id, req.params.start_date, req.params.end_date)
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }
}
