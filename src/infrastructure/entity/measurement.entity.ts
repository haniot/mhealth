export class MeasurementEntity {
    public id?: string
    public value?: number
    public unit?: string
    public type?: string
    public measurements!: Array<string>
    public contexts?: Array<any>
    public timestamp?: string
    public device_id?: string
    public user_id?: string

    constructor() {
        this.measurements = []
        this.contexts = []
    }
}
