import http from 'http'
import { Application } from 'express'
import { Identifier } from './src/di/identifiers'
import { DI } from './src/di/di'
import { ILogger } from './src/utils/custom.logger'
import { BackgroundService } from './src/background/background.service'
import { Default } from './src/utils/default'
import { App } from './src/app'

/**
 *  Create the .env file in the root directory of your project
 *  and add your environment variables to new lines in the
 *  format NAME=VALUE. For example:
 *      DB_HOST=localhost
 *      DB_USER=root
 *      DB_PASS=mypass
 *
 *  The fastest way is to create a copy of the .env.example file.
 */
require(`dotenv`).load()

const logger: ILogger = DI.getInstance().getContainer().get<ILogger>(Identifier.LOGGER)
const app: Application = (DI.getInstance().getContainer().get<App>(Identifier.APP)).getExpress()
const backgroundServices: BackgroundService = DI.getInstance().getContainer().get(Identifier.BACKGROUND_SERVICE)
const port_http = process.env.PORT_HTTP || Default.PORT_HTTP

/**
 * Up Server HTTP.
 * Accessing http will be redirected to https.
 */
http.createServer(app)
    .listen(port_http, () => {
        logger.debug(`Server HTTP running on port ${port_http}`)

        initListener()
        backgroundServices.startServices()
            .then(() => {
                logger.debug('Background services successfully initialized...')
            })
            .catch(err => {
                logger.error(err.message)
            })
    })

function initListener(): void {
    process.on('SIGINT', async () => {
        try {
            await backgroundServices.stopServices()
        } catch (err) {
            logger.error(`There was an error stopping all background services. ${err.message}`)
        } finally {
            logger.debug('Background services successfully closed...')
        }
        process.exit()
    })
}
