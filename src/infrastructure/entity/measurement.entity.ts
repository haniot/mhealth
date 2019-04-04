import { ContextEntity } from './context.entity'

export class MeasurementEntity {
    public id?: string
    public value?: number
    public unit?: string
    public type?: string
    public measurements?: Array<any>
    public contexts?: Array<ContextEntity>
    public timestamp?: string
    public device_id?: string
    public user_id?: string
}
