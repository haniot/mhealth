import { inject, injectable } from 'inversify'
import { IMeasurementService } from '../port/measurement.service.interface'
import { Identifier } from '../../di/identifiers'
import { IMeasurementRepository } from '../port/measurement.repository.interface'
import { Measurement } from '../domain/model/measurement'
import { IQuery } from '../port/query.interface'

@injectable()
export class MeasurementService implements IMeasurementService {
    constructor(
        @inject(Identifier.MEASUREMENT_REPOSITORY) private readonly _repository: IMeasurementRepository
    ) {
    }

    public add(item: Measurement): Promise<Measurement> {
        return this._repository.create(item)
    }

    public getAll(query: IQuery): Promise<Array<Measurement>> {
        return this._repository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<Measurement> {
        query.addFilter({ _id: id })
        return this._repository.findOne(query)
    }

    public remove(id: string): Promise<boolean> {
        return this._repository.delete(id)
    }

    public update(item: Measurement): Promise<Measurement> {
        return this._repository.update(item)
    }
}
