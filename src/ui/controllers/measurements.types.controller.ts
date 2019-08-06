import HttpStatus from 'http-status-codes'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'

@controller('/v1/measurements/types')
export class MeasurementsTypesController {

    @httpGet('/')
    public async getMeasurementsTypes(@request() req: Request, @response() res: Response) {
        return res.status(HttpStatus.OK).send(this.jsonData())
    }

    private jsonData(): object {
        return [
            {
                id: 'blood_glucose',
                display_name: 'Blood Glucose'
            },
            {
                id: 'blood_pressure',
                display_name: 'Blood Pressure'
            },
            {
                id: 'body_temperature',
                display_name: 'Body Temperature'
            },
            {
                id: 'body_fat',
                display_name: 'Body Fat'
            },
            {
                id: 'height',
                display_name: 'Height'
            },
            {
                id: 'waist_circumference',
                display_name: 'Waist Circumference'
            },
            {
                id: 'weight',
                display_name: 'Weight'
            }
        ]
    }
}
