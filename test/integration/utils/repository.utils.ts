import { Sleep } from '../../../src/application/domain/model/sleep'
import { ISleepRepository } from '../../../src/application/port/sleep.repository.interface'
import { SleepRepoModel } from '../../../src/infrastructure/database/schema/sleep.schema'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'

/**
 * Class with some object creation functions that are used in integration tests.
 */
export class RepositoryUtils {
    private _sleepRepository: ISleepRepository = DIContainer.get(Identifier.SLEEP_REPOSITORY)

    get sleepRepository(): ISleepRepository {
        return this._sleepRepository
    }

    set sleepRepository(value: ISleepRepository) {
        this._sleepRepository = value
    }

    /**
     * CREATE FUNCTIONS
     */
    // SLEEP
    public async createSleep(sleep: Sleep): Promise<Sleep | undefined> {
        const sleepSaved: Sleep | undefined = await this.sleepRepository.create(sleep)
        return Promise.resolve(sleepSaved)
    }

    /**
     * DELETE FUNCTIONS
     */
    // SLEEP
    public async deleteAllSleep() {
        return SleepRepoModel.deleteMany({})
    }
}

export const repoUtils = new RepositoryUtils()
