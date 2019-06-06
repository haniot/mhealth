import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Device } from '../../application/domain/model/device'
import { DeviceEntity } from '../entity/device.entity'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IDeviceRepository } from '../../application/port/device.repository.interface'
import { Query } from './query/query'

@injectable()
export class DeviceRepository extends BaseRepository<Device, DeviceEntity> implements IDeviceRepository {
    constructor(
        @inject(Identifier.DEVICE_REPO_MODEL) readonly _model: any,
        @inject(Identifier.DEVICE_ENTITY_MAPPER) readonly _entityMapper: IEntityMapper<Device, DeviceEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _entityMapper, _logger)
    }

    public checkExists(mac: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            super.findOne(new Query().fromJSON({ filters: { address: mac } }))
                .then(result => {
                    if (!result) return resolve(false)
                    return resolve(true)
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
