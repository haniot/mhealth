import { IIntegrationEventRepository } from '../../../src/application/port/integration.event.repository.interface'
import { IntegrationEvent } from '../../../src/application/integration-event/event/integration.event'
import { IQuery } from '../../../src/application/port/query.interface'

export class IntegrationEventRepositoryMock implements IIntegrationEventRepository {

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: IntegrationEvent<any>): Promise<IntegrationEvent<any>> {
        return Promise.resolve(item)
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: IQuery): Promise<Array<IntegrationEvent<any>>> {
        return Promise.resolve([])
    }

    public findOne(query: IQuery): Promise<IntegrationEvent<any>> {
        return Promise.resolve(undefined!)
    }

    public update(item: IntegrationEvent<any>): Promise<IntegrationEvent<any>> {
        return Promise.resolve(item)
    }

}
