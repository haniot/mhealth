import HttpStatus from 'http-status-codes'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IDeviceService } from '../../application/port/device.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Device } from '../../application/domain/model/device'
import { Query } from '../../infrastructure/repository/query/query'
import { Strings } from '../../utils/strings'
import { ApiException } from '../exception/api.exception'

@controller('/v1/patients/:patient_id/devices')
export class PatientsDevicesController {
    constructor(
        @inject(Identifier.DEVICE_SERVICE) private readonly _service: IDeviceService
    ) {
    }

    @httpPost('/')
    public async addDeviceFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const device: Device = new Device().fromJSON(req.body)
            const result: Device = await this._service.addDevice(device, req.params.patient_id)
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
    public async getAllDevicesFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.query)
            query.addFilter({ patient_id: req.params.patient_id })
            const result: Array<Device> = await this._service.getAll(query)
            const count: number = await this._service.count(query)
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

    @httpGet('/:device_id')
    public async getDeviceFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.query)
            query.addFilter({ patient_id: req.params.patient_id })
            const result: Device = await this._service.getById(req.params.device_id, query)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageDeviceNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    @httpPatch('/:device_id')
    public async updateDeviceFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const device: Device = new Device().fromJSON(req.body)
            device.id = req.params.device_id
            const result: Device = await this._service.updateDevice(device, req.params.patient_id)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageDeviceNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    @httpDelete('/:device_id')
    public async deleteDeviceFromPatient(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._service.removeDevice(req.params.device_id, req.params.patient_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    private toJSONView(item: Device | Array<Device>): object {
        if (item instanceof Array) return item.map(device => device.toJSON())
        return item.toJSON()
    }

    private getMessageDeviceNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.DEVICE.NOT_FOUND,
            Strings.DEVICE.NOT_FOUND_DESC
        ).toJson()
    }
}
