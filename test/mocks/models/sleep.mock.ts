import { Sleep } from '../../../src/application/domain/model/sleep'
import { SleepType } from '../../../src/application/domain/utils/sleep.type'
import { SleepPattern } from '../../../src/application/domain/model/sleep.pattern'
import { SleepPatternDataSet } from '../../../src/application/domain/model/sleep.pattern.data.set'
import { Phases } from '../../../src/application/domain/utils/phases'
import { Stages } from '../../../src/application/domain/utils/stages'
import { SleepNightAwakening } from '../../../src/application/domain/model/sleep.night.awakening'

export class SleepMock extends Sleep {

    constructor() {
        super()
        this.generateSleep()
    }

    private generateSleep(): void {
        super.id = this.generateObjectId()
        super.start_time = new Date(1603767600000 + Math.floor((Math.random() * 1000))).toISOString()
        super.end_time = new Date(new Date(super.start_time)
            .setMilliseconds(Math.floor(Math.random() * 7 + 4) * 3.6e+6)).toISOString() // 4-10h in milliseconds
        super.duration = new Date(super.end_time).getTime() - new Date(super.start_time).getTime()
        super.patient_id = '5a62be07de34500146d9c544'
        super.type = this.generateType()
        super.pattern = this.generateSleepPattern(super.start_time, super.duration, super.type)
        super.night_awakening = this.generateNightAwakening()
    }

    private generateSleepPattern(start_time: string, duration: number, sleepType: SleepType): SleepPattern {
        const sleepPattern = new SleepPattern()
        const dataSet: Array<SleepPatternDataSet> = []
        const dataSetItem: SleepPatternDataSet = new SleepPatternDataSet()
        let countDuration: number = 0

        dataSetItem.start_time = start_time
        let _start_time = start_time
        while (countDuration < duration) {
            const item: SleepPatternDataSet = this.populateDataSetItem(_start_time, sleepType)
            countDuration += item.duration
            if (countDuration > duration) {
                item.duration = item.duration - (countDuration - duration)
            }
            dataSet.push(item)
            _start_time = new Date(new Date(_start_time).setMilliseconds(item.duration)).toISOString()
        }

        sleepPattern.data_set = dataSet
        return sleepPattern
    }

    private populateDataSetItem(start_time: string, sleepType: SleepType): SleepPatternDataSet {
        const dataSetItem: SleepPatternDataSet = new SleepPatternDataSet()
        dataSetItem.start_time = start_time
        if (sleepType === SleepType.CLASSIC) {
            switch (Math.floor((Math.random() * 3))) { // 0-2
                case 0:
                    dataSetItem.name = Phases.RESTLESS
                    dataSetItem.duration = Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min milliseconds
                    return dataSetItem
                case 1:
                    dataSetItem.name = Phases.AWAKE
                    dataSetItem.duration = Math.floor(Math.random() * 3 + 1) * 60000 // 1-3min in milliseconds
                    return dataSetItem
                default: {
                    dataSetItem.name = Phases.ASLEEP
                    dataSetItem.duration = Math.floor(Math.random() * 120 + 1) * 60000 // 1-180min in milliseconds
                    return dataSetItem
                }
            }
        } else {
            switch (Math.floor((Math.random() * 4))) { // 0-3
                case 0:
                    dataSetItem.name = Stages.DEEP
                    dataSetItem.duration = Math.floor(Math.random() * 5 + 1) * 60000 // 1-5min milliseconds
                    return dataSetItem
                case 1:
                    dataSetItem.name = Stages.LIGHT
                    dataSetItem.duration = Math.floor(Math.random() * 3 + 1) * 60000 // 1-3min in milliseconds
                    return dataSetItem
                case 2:
                    dataSetItem.name = Stages.REM
                    dataSetItem.duration = Math.floor(Math.random() * 3 + 1) * 60000 // 1-3min in milliseconds
                    return dataSetItem
                default: {
                    dataSetItem.name = Stages.AWAKE
                    dataSetItem.duration = Math.floor(Math.random() * 120 + 1) * 60000 // 1-180min in milliseconds
                    return dataSetItem
                }
            }
        }
    }

    private generateNightAwakening(): Array<SleepNightAwakening> {
        const nightAwakeningItem: SleepNightAwakening = new SleepNightAwakening()
        nightAwakeningItem.start_time = '21:30:30'
        nightAwakeningItem.end_time = '21:45:30'
        nightAwakeningItem.steps = Math.floor((Math.random() * 50)) + 9 // 9-50

        const nightAwakeningItem2: SleepNightAwakening = new SleepNightAwakening()
        nightAwakeningItem2.start_time = '01:00:30'
        nightAwakeningItem2.end_time = '01:25:00'
        nightAwakeningItem2.steps = Math.floor((Math.random() * 50)) + 9 // 9-50

        const nightAwakeningItem3: SleepNightAwakening = new SleepNightAwakening()
        nightAwakeningItem3.start_time = '03:30:30'
        nightAwakeningItem3.end_time = '03:40:00'
        nightAwakeningItem3.steps = Math.floor((Math.random() * 50)) + 9 // 9-50

        const sleepNightAwakening: Array<SleepNightAwakening> = new Array<SleepNightAwakening>()
        sleepNightAwakening.push(nightAwakeningItem)
        sleepNightAwakening.push(nightAwakeningItem2)
        sleepNightAwakening.push(nightAwakeningItem3)

        return sleepNightAwakening
    }

    private generateObjectId(): string {
        const chars = 'abcdef0123456789'
        let randS = ''
        for (let i = 0; i < 24; i++) {
            randS += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randS
    }

    private generateType(): SleepType {
        switch (Math.floor((Math.random() * 2))) { // 0-1
            case 0:
                return SleepType.CLASSIC
            case 1:
                return SleepType.STAGES
            default:
                return SleepType.CLASSIC
        }
    }
}
