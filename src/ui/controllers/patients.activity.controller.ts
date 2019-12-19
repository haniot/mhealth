import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { ApiException } from '../exception/api.exception'
import { PhysicalActivity } from '../../application/domain/model/physical.activity'
import { IPhysicalActivityService } from '../../application/port/physical.activity.service.interface'
import { ILogger } from '../../utils/custom.logger'
import { MultiStatus } from '../../application/domain/model/multi.status'
import { IQuery } from '../../application/port/query.interface'
import { StatusError } from '../../application/domain/model/status.error'
import { ValidationException } from '../../application/domain/exception/validation.exception'

/**
 * Controller that implements PhysicalActivity feature operations.
 *
 * @remarks To define paths, we use library inversify-express-utils.
 * @see {@link https://github.com/inversify/inversify-express-utils} for further information.
 */
@controller('/v1/patients')
export class PatientsActivityController {

    /**
     * Creates an instance of PhysicalActivity controller.
     *
     * @param {IPhysicalActivityService} _activityService
     * @param {ILogger} _logger
     */
    constructor(
        @inject(Identifier.ACTIVITY_SERVICE) private readonly _activityService: IPhysicalActivityService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    /**
     * Add new physical physicalactivity or multiple new physical activities.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpPost('/:patient_id/physicalactivities')
    public async saveActivity(@request() req: Request, @response() res: Response) {
        try {
            // Multiple items of PhysicalActivity
            if (req.body instanceof Array) {
                const invalidItems: Array<StatusError<PhysicalActivity>> = new Array<StatusError<PhysicalActivity>>()
                const activitiesArr: Array<PhysicalActivity> = new Array<PhysicalActivity>()
                req.body.forEach(item => {
                    try {
                        const activityItem: PhysicalActivity = new PhysicalActivity().fromJSON(item)
                        activityItem.patient_id = req.params.patient_id
                        activitiesArr.push(activityItem)
                    } catch (err) {
                        // when unable to successfully form the object through fromJSON()
                        let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
                        if (err instanceof ValidationException) statusCode = HttpStatus.BAD_REQUEST

                        // Create a StatusError object for the construction of the MultiStatus response.
                        const statusError: StatusError<PhysicalActivity> =
                            new StatusError<PhysicalActivity>(statusCode, err.message, err.description, item)
                        invalidItems.push(statusError)
                    }
                })

                const resultMultiStatus: MultiStatus<PhysicalActivity> = await this._activityService.add(activitiesArr)
                if (invalidItems.length > 0) {
                    invalidItems.forEach(invalidItem => {
                        resultMultiStatus.error.push(invalidItem)
                    })
                }
                return res.status(HttpStatus.MULTI_STATUS).send(resultMultiStatus)
            }

            // Only one item
            const physicalActivity: PhysicalActivity = new PhysicalActivity().fromJSON(req.body)
            physicalActivity.patient_id = req.params.patient_id

            const result: PhysicalActivity = await this._activityService.add(physicalActivity)
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Recovers physical activities of the patient.
     * For the query strings, the query-strings-parser middleware was used.
     * @see {@link https://www.npmjs.com/package/query-strings-parser} for further information.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/:patient_id/physicalactivities')
    public async getAllPhysicalActivitiesOfPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ patient_id: req.params.patient_id })
            const result = await this._activityService
                .getAllByPatient(req.params.patient_id, query)
            const count: number = await this._activityService.countByPatient(req.params.patient_id)
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Get physicalactivity by id and patient.
     * For the query strings, the query-strings-parser middleware was used.
     * @see {@link https://www.npmjs.com/package/query-strings-parser} for further information.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/:patient_id/physicalactivities/:physicalactivity_id')
    public async getPhysicalActivityById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ _id: req.params.physicalactivity_id, patient_id: req.params.patient_id })
            const result: PhysicalActivity = await this._activityService
                .getByIdAndPatient(req.params.physicalactivity_id, req.params.patient_id, query)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotActivityFound())
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Remove physical physical activity of the patient.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpDelete('/:patient_id/physicalactivities/:physicalactivity_id')
    public async deletePhysicalActivityOfPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._activityService.removeByPatient(req.params.physicalactivity_id, req.params.patient_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    /**
     * Default message when resource is not found or does not exist.
     */
    private getMessageNotActivityFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            'Physical Activity not found!',
            'Physical Activity not found or already removed. A new operation for the same resource is not required.'
        ).toJson()
    }
}
