import HttpStatus from 'http-status-codes'
import { controller, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IDeviceService } from '../../application/port/device.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Device } from '../../application/domain/model/device'

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
            device.user_id = req.params.user_id
            const result: Device = await this._service.add(device)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    private toJSONView(item: Device | Array<Device>): object {
        if (item instanceof Array) return item.map(device => device.toJSON())
        return item.toJSON()
    }
}
