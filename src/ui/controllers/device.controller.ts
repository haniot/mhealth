import HttpStatus from 'http-status-codes'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IDeviceService } from '../../application/port/device.service.interface'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Query } from '../../infrastructure/repository/query/query'
import { Device } from '../../application/domain/model/device'

@controller('/devices')
export class DeviceController {
    constructor(
        @inject(Identifier.DEVICE_SERVICE) private readonly _service: IDeviceService
    ) {
    }

    @httpGet('/')
    public async getAllDevices(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<Device> = await this._service.getAll(new Query().fromJSON(req.query))
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    private toJSONView(devices: Array<Device>): object {
        return devices.map(device => {
            device.user_id = undefined
            device.address = undefined
            return device.toJSON()
        })
    }
}
