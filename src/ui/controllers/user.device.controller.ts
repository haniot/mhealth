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

@controller('/users/:user_id/devices')
export class UserDeviceController {
    constructor(
        @inject(Identifier.DEVICE_SERVICE) private readonly _service: IDeviceService
    ) {
    }

    @httpPost('/')
    public async addDeviceFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const device: Device = new Device().fromJSON(req.body)
            const result: Device = await this._service.addDevice(device, req.params.user_id)
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
    public async getAllDevicesFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.query)
            query.addFilter({ user_id: req.params.user_id })
            const result: Array<Device> = await this._service.getAll(query)
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
    public async getDeviceFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: Query = new Query().fromJSON(req.query)
            query.addFilter({ user_id: req.params.user_id })
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
    public async updateDeviceFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const device: Device = new Device().fromJSON(req.body)
            device.id = req.params.device_id
            device.user_id = req.params.user_id
            const result: Device = await this._service.update(device)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageDeviceNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        }
    }

    @httpDelete('/:device_id')
    public async deleteDeviceFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._service.removeDevice(req.params.device_id, req.params.user_id)
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
