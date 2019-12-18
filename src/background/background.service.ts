import { inject, injectable } from 'inversify'
import { Identifier } from '../di/identifiers'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { Default } from '../utils/default'

@injectable()
export class BackgroundService {

    constructor(
        @inject(Identifier.MONGODB_CONNECTION) private readonly _mongodb: IConnectionDB,
        @inject(Identifier.SUBSCRIBE_EVENT_BUS_TASK) private readonly _subscribeTask: IBackgroundTask,
        @inject(Identifier.RPC_SERVER_EVENT_BUST_TASK) private readonly _rpcServerTask: IBackgroundTask
    ) {
    }

    public async startServices(): Promise<void> {
        try {
            /**
             * Trying to connect to mongodb.
             * Go ahead only when the run is resolved.
             * Since the application depends on the database connection to work.
             */
            await this._mongodb.tryConnect(this.getDBUri())

            await this._subscribeTask.run()
            await this._rpcServerTask.run()
        } catch (err) {
            return Promise.reject(new Error(`Error initializing services in background! ${err.message}`))
        }
    }

    public async stopServices(): Promise<void> {
        try {
            await this._mongodb.dispose()

            await this._subscribeTask.stop()
            await this._rpcServerTask.stop()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping MongoDB! ${err.message}`))
        }
    }

    /**
     * Retrieve the URI for connection to MongoDB.
     *
     * @return {string}
     */
    private getDBUri(): string {
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'test') {
            return process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST
        }
        return process.env.MONGODB_URI || Default.MONGODB_URI
    }
}
