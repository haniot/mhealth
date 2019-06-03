import { IMeasurementRepository } from '../../../src/application/port/measurement.repository.interface'
import { IQuery } from '../../../src/application/port/query.interface'
import { GenericMeasurementMock } from '../models/generic.measurement.mock'
import { DefaultEntityMock } from '../models/default.entity.mock'
import { Fat } from '../../../src/application/domain/model/fat'

const measurement: GenericMeasurementMock = new GenericMeasurementMock().fromJSON(DefaultEntityMock.GENERIC_MEASUREMENT_MOCK)
measurement.id = DefaultEntityMock.GENERIC_MEASUREMENT_MOCK.id
measurement.fat = new Fat().fromJSON({
    ...DefaultEntityMock.WEIGHT.fat,
    type: DefaultEntityMock.FAT.type,
    timestamp: DefaultEntityMock.WEIGHT.timestamp,
    user_id: DefaultEntityMock.WEIGHT.device_id,
    device_id: DefaultEntityMock.WEIGHT.device_id
})

export class MeasurementRepositoryMock implements IMeasurementRepository {
    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: any): Promise<any> {
        return Promise.resolve(item)
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: IQuery): Promise<Array<any>> {
        measurement.type = query.toJSON().filters.type
        return Promise.resolve([measurement])
    }

    public findOne(query: IQuery): Promise<any> {
        measurement.type = query.toJSON().filters.type
        return Promise.resolve(measurement)
    }

    public update(item: any): Promise<any> {
        return Promise.resolve(item)

    }

    public checkExists(item: any): Promise<boolean> {
        return Promise.resolve(item.id !== measurement.id)
    }
}
