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
import { BloodPressure } from '../../application/domain/model/blood.pressure'
import { Weight } from '../../application/domain/model/weight'
import { BloodGlucose } from '../../application/domain/model/blood.glucose'
import { BodyTemperature } from '../../application/domain/model/body.temperature'
import { WaistCircumference } from '../../application/domain/model/waist.circumference'
import { BodyFat } from '../../application/domain/model/body.fat'
import { LastMeasurements } from '../../application/domain/model/last.measurements'

@controller('/v1/patients/:patient_id/measurements')
export class PatientsMeasurementsController {
    constructor(
        @inject(Identifier.MEASUREMENT_SERVICE) private readonly _service: IMeasurementService
    ) {
    }

    @httpPost('/')
    public async addMeasurementFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result = await this._service.addMeasurement(this.transform(req.body, req.params.patient_id))
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
    public async getAllMeasurementsFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.query)
            query.addFilter({ patient_id: req.params.patient_id })
            const result: Array<Measurement> = await this._service.getAll(query)
            const count: number = await this._service.count(
                new Query().fromJSON({ filters: { patient_id: req.params.patient_id } }))
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

    @httpGet('/last')
    public async getLastMeasurementsFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: LastMeasurements = await this._service.getLastMeasurements(req.params.patient_id)
            return res.status(HttpStatus.OK).send(result.toJSON())
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    @httpGet('/:measurement_id')
    public async getMeasurementFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.query)
            query.addFilter({ patient_id: req.params.patient_id })
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
    public async deleteMeasurementFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._service.removeMeasurement(req.params.measurement_id, req.params.patient_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    private toJSONView(item: any | Array<any>): object {
        if (item instanceof Array) return item.map(measurement => this.toJSONView(measurement))
        item.patient_id = undefined
        return item.toJSON()
    }

    private getMessageMeasurementNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.MEASUREMENT.NOT_FOUND,
            Strings.MEASUREMENT.NOT_FOUND_DESC
        ).toJson()
    }

    public transform(item: any | Array<any>, patientId: string): any | Array<any> {
        if (item instanceof Array) return this.jsonListToModel(item, patientId)
        return this.jsonToModel({ ...item, patient_id: patientId })
    }

    private jsonListToModel(items: Array<any>, patientId: string): Array<any> {
        const result: Array<any> = []
        items.forEach(item => {
            item.patient_id = patientId
            result.push(this.jsonToModel(item))
        })
        return result
    }

    private jsonToModel(item: any): any {
        if (!item.type) return undefined
        switch (item.type) {
            case MeasurementTypes.HEIGHT:
                return new Height().fromJSON(item)
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
            case MeasurementTypes.BODY_FAT:
                return new BodyFat().fromJSON(item)
            default:
                return new Measurement().fromJSON(item)
        }
    }
}
