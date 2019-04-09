import { IMeasurementRepository } from '../../../src/application/port/measurement.repository.interface'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { IQuery } from '../../../src/application/port/query.interface'
import { DefaultEntityMock } from '../models/default.entity.mock'

const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)

export class MeasurementRepositoryMock implements IMeasurementRepository {
    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: Measurement): Promise<Measurement> {
        return Promise.resolve(measurement)
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: IQuery): Promise<Array<Measurement>> {
        return Promise.resolve([measurement])
    }

    public findOne(query: IQuery): Promise<Measurement> {
        return Promise.resolve(measurement)
    }

    public update(item: Measurement): Promise<Measurement> {
        return Promise.resolve(measurement)
    }
}
