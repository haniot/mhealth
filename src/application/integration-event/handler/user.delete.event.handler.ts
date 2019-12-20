import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { ILogger } from '../../../utils/custom.logger'
import { UserDeleteEvent } from '../event/user.delete.event'
import { User } from '../../domain/model/user'
import { UserValidator } from '../../domain/validator/user.validator'
import { IMeasurementRepository } from '../../port/measurement.repository.interface'
import { IPhysicalActivityRepository } from '../../port/physical.activity.repository.interface'
import { ISleepRepository } from '../../port/sleep.repository.interface'

export class UserDeleteEventHandler implements IIntegrationEventHandler<UserDeleteEvent> {
    constructor(
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _measurementRepo: IMeasurementRepository,
        @inject(Identifier.ACTIVITY_REPOSITORY) private readonly _activityRepo: IPhysicalActivityRepository,
        @inject(Identifier.SLEEP_REPOSITORY) private readonly _sleepRepo: ISleepRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: UserDeleteEvent): Promise<void> {
        try {
            if (!event.user) return
            const user: User = new User().fromJSON(event.user)
            UserValidator.validate(user)
            this._logger.info(`Prepare to delete measurements, activities and sleep objects from user: ${user.id}...`)
            await this._measurementRepo.removeMeasurementsFromUser(user.id!)
            await this._activityRepo.removeAllByPatient(user.id!)
            await this._sleepRepo.removeAllByPatient(user.id!)
            this._logger.info(`Action for event ${event.event_name} successfully performed!`)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
