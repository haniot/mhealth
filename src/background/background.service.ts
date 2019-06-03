import { inject, injectable } from 'inversify'
import { Identifier } from '../di/identifiers'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'

@injectable()
export class BackgroundService {

    constructor(
        @inject(Identifier.MONGODB_CONNECTION) private readonly _mongodb: IConnectionDB
    ) {
    }

    public async startServices(): Promise<void> {
        try {
            /**
             * Trying to connect to mongodb.
             * Go ahead only when the run is resolved.
             * Since the application depends on the database connection to work.
             */
            await this._mongodb.tryConnect(0, 1000)
        } catch (err) {
            return Promise.reject(new Error(`Error initializing services in background! ${err.message}`))
        }
    }

    public async stopServices(): Promise<void> {
        try {
            await this._mongodb.dispose()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping MongoDB! ${err.message}`))
        }
    }
}
