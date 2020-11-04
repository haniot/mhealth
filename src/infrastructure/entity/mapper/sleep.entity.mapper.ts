import { injectable } from 'inversify'
import { Sleep } from '../../../application/domain/model/sleep'
import { SleepEntity } from '../sleep.entity'
import { SleepPattern } from '../../../application/domain/model/sleep.pattern'
import { SleepPatternDataSet } from '../../../application/domain/model/sleep.pattern.data.set'
import { SleepPatternSummaryData } from '../../../application/domain/model/sleep.pattern.summary.data'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { SleepPatternPhaseSummary } from '../../../application/domain/model/sleep.pattern.phase.summary'
import { Phases } from '../../../application/domain/utils/phases'
import { SleepPatternStageSummary } from '../../../application/domain/model/sleep.pattern.stage.summary'
import { Stages } from '../../../application/domain/utils/stages'
import { SleepType } from '../../../application/domain/utils/sleep.type'
import { SleepAwakening } from '../../../application/domain/model/sleep.awakening'

@injectable()
export class SleepEntityMapper implements IEntityMapper<Sleep, SleepEntity> {
    public transform(item: any): any {
        if (item instanceof Sleep) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert JSON for Sleep.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): Sleep {
        const result: Sleep = new Sleep()

        if (!json) return result
        if (json.id !== undefined) result.id = json.id
        if (json.start_time !== undefined) result.start_time = json.start_time
        if (json.end_time !== undefined) result.end_time = json.end_time
        if (json.duration !== undefined) result.duration = json.duration
        if (json.patient_id !== undefined) result.patient_id = json.patient_id
        if (json.pattern !== undefined) result.pattern = this.deserializeSleepPattern(json.pattern, json.type)
        if (json.awakenings?.length) {
            result.awakenings = json.awakenings.map(elem => new SleepAwakening().fromJSON(elem))
        }
        if (json.type !== undefined) result.type = json.type

        return result
    }

    public modelEntityToModel(item: SleepEntity): Sleep {
        throw Error('Not implemented!')
    }

    /**
     * Convert {Sleep} for {SleepEntity}.
     *
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: Sleep): SleepEntity {
        const result: SleepEntity = new SleepEntity()

        if (item.id) result.id = item.id
        if (item.start_time) result.start_time = item.start_time
        if (item.end_time) result.end_time = item.end_time
        if (item.duration) result.duration = item.duration
        if (item.patient_id) result.patient_id = item.patient_id
        /**
         * For the object of type SleepEntity, there is an array containing
         * the staging data set, ie it does not contain summary.
         */
        if (item.pattern) {
            result.pattern = item.pattern.data_set.map((elem: SleepPatternDataSet) => elem.toJSON())
        }
        if (item.awakenings?.length) {
            result.awakenings = item.awakenings.map((elem: SleepAwakening) => elem.toJSON())
        }
        if (item.type) result.type = item.type

        return result
    }

    private deserializeSleepPattern(pattern: any, sleepType: string): SleepPattern {
        const sleepPattern: SleepPattern = new SleepPattern()

        const sleepPatternDataSet: Array<SleepPatternDataSet> = pattern.map(elem => new SleepPatternDataSet().fromJSON(elem))
        if (sleepType === SleepType.CLASSIC) {
            const summary: SleepPatternPhaseSummary = new SleepPatternPhaseSummary()

            const countAsleep = this.countOfPattern(Phases.ASLEEP, pattern)
            const countAwake = this.countOfPattern(Phases.AWAKE, pattern)
            const countRestless = this.countOfPattern(Phases.RESTLESS, pattern)
            const durationAsleep = this.countDurationOfPattern(Phases.ASLEEP, pattern)
            const durationAwake = this.countDurationOfPattern(Phases.AWAKE, pattern)
            const durationRestless = this.countDurationOfPattern(Phases.RESTLESS, pattern)

            summary.asleep = new SleepPatternSummaryData(countAsleep, durationAsleep)
            summary.awake = new SleepPatternSummaryData(countAwake, durationAwake)
            summary.restless = new SleepPatternSummaryData(countRestless, durationRestless)

            sleepPattern.data_set = sleepPatternDataSet
            sleepPattern.summary = summary
            return sleepPattern
        } else {
            const summary: SleepPatternStageSummary = new SleepPatternStageSummary()

            const countDeep = this.countOfPattern(Stages.DEEP, pattern)
            const countLight = this.countOfPattern(Stages.LIGHT, pattern)
            const countRem = this.countOfPattern(Stages.REM, pattern)
            const countAwake = this.countOfPattern(Stages.AWAKE, pattern)
            const durationDeep = this.countDurationOfPattern(Stages.DEEP, pattern)
            const durationLight = this.countDurationOfPattern(Stages.LIGHT, pattern)
            const durationRem = this.countDurationOfPattern(Stages.REM, pattern)
            const durationAwake = this.countDurationOfPattern(Stages.AWAKE, pattern)

            summary.deep = new SleepPatternSummaryData(countDeep, durationDeep)
            summary.light = new SleepPatternSummaryData(countLight, durationLight)
            summary.rem = new SleepPatternSummaryData(countRem, durationRem)
            summary.awake = new SleepPatternSummaryData(countAwake, durationAwake)

            sleepPattern.data_set = sleepPatternDataSet
            sleepPattern.summary = summary
            return sleepPattern
        }
    }

    /**
     * Count total sleep pattern records.
     *
     * @param pattern
     * @param dataSet
     */
    private countOfPattern(pattern: string, dataSet: Array<any>): number {
        return dataSet.reduce((prev, item) => {
            if (item.name.toLowerCase() === pattern) return prev + 1
            return prev
        }, 0)
    }

    /**
     * Sum the sleep pattern durations that are in milliseconds.
     *
     * @param pattern
     * @param dataSet
     */
    private countDurationOfPattern(pattern: string, dataSet: Array<any>): number {
        return dataSet.reduce((prev, item) => {
            if (item.name.toLowerCase() === pattern && item.duration) return prev + item.duration
            return prev
        }, 0)
    }
}
