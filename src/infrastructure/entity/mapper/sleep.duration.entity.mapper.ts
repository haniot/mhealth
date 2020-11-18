import { injectable } from 'inversify'
import { SleepDuration } from '../../../application/domain/model/sleep.duration'
import { SleepDurationEntity } from '../sleep.duration.entity'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { SleepDurationItem } from '../../../application/domain/model/sleep.duration.item'
import { SleepDurationSummary } from '../../../application/domain/model/sleep.duration.summary'
import moment from 'moment'

@injectable()
export class SleepDurationEntityMapper implements IEntityMapper<SleepDuration, SleepDurationEntity> {
    public transform(item: any): any {
        if (item instanceof SleepDuration) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert {SleepDuration} for {SleepDurationEntity}.
     *
     * @see Not implemented!
     * @param item
     */
    public modelToModelEntity(item: SleepDuration): SleepDurationEntity {
        throw new Error('Not implemented!')
    }

    /**
     * Convert {SleepDurationEntity} for {SleepDuration}.
     *
     * @see Not implemented!
     * @param item
     */
    public modelEntityToModel(item: SleepDurationEntity): SleepDuration {
        throw new Error('Not implemented!')
    }

    /**
     * Convert JSON for SleepDuration.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): SleepDuration {
        const result: SleepDuration = new SleepDuration()
        if (!json) return result

        if (!json.summary) result.summary = new SleepDurationSummary().fromJSON({ total: 0 })
        else result.summary = new SleepDurationSummary().fromJSON(json.summary)

        json.data_set = this.mountSleepDuration(json.data_set, json.start_date, json.end_date)
        result.data_set = json.data_set?.map(elem => new SleepDurationItem().fromJSON(elem))

        return result
    }

    private mountSleepDuration(dataSet: any, startDate: string, endDate: string): any {
        const result = new Array<any>()
        endDate = moment(endDate).add(1, 'day').format('YYYY-MM-DD')
        for (const m = moment(startDate); m.isBefore(endDate); m.add(1, 'day')) {
            const foundDataSetItem = dataSet?.find(item => item.date === m.format('YYYY-MM-DD'))

            if (foundDataSetItem) result.push(foundDataSetItem)
            else result.push({ date: m.format('YYYY-MM-DD'), value: 0 })
        }

        return result
    }
}
