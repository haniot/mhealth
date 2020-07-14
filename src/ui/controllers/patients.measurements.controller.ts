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
            const result = await this._service.add(this.transform(req.body, req.params.patient_id))
            if (result.success && result.error) return res.status(HttpStatus.MULTI_STATUS).send(this.toJSONView(result))
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
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
            const count: number = await this._service.count(query)
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        } finally {
            req.query = {}
        }
    }

    @httpGet('/last')
    public async getLastMeasurementsFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: LastMeasurements = await this._service.getLast(req.params.patient_id)
            return res.status(HttpStatus.OK).send(result.toJSON())
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/last/:date')
    public async getLastMeasurementsOfPatientFromDate(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: LastMeasurements = await this._service.getLastFromDate(req.params.patient_id, req.params.date)
            return res.status(HttpStatus.OK).send(result.toJSON())
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
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
                .send(handlerError.toJSON())
        } finally {
            req.query = {}
        }
    }

    @httpDelete('/:measurement_id')
    public async deleteMeasurementFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._service.removeByPatient(req.params.measurement_id, req.params.patient_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
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
        ).toJSON()
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
        switch (item.type) {
            case MeasurementTypes.HEIGHT:
                const height = new Height().fromJSON(item)
                height.patient_id = item.patient_id
                return height
            case MeasurementTypes.BLOOD_PRESSURE:
                const bloodPressure = new BloodPressure().fromJSON(item)
                bloodPressure.patient_id = item.patient_id
                return bloodPressure
            case MeasurementTypes.WEIGHT:
                const weight = new Weight().fromJSON(item)
                weight.patient_id = item.patient_id
                return weight
            case MeasurementTypes.BLOOD_GLUCOSE:
                const bloodGlucose = new BloodGlucose().fromJSON(item)
                bloodGlucose.patient_id = item.patient_id
                return bloodGlucose
            case MeasurementTypes.BODY_TEMPERATURE:
                const bodyTemperature = new BodyTemperature().fromJSON(item)
                bodyTemperature.patient_id = item.patient_id
                return bodyTemperature
            case MeasurementTypes.WAIST_CIRCUMFERENCE:
                const waistCircumference = new WaistCircumference().fromJSON(item)
                waistCircumference.patient_id = item.patient_id
                return waistCircumference
            case MeasurementTypes.BODY_FAT:
                const bodyFat = new BodyFat().fromJSON(item)
                bodyFat.patient_id = item.patient_id
                return bodyFat
            default:
                const measurement = new Measurement().fromJSON(item)
                measurement.patient_id = item.patient_id
                return measurement
        }
    }
}
