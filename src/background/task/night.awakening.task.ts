import { Stages } from '../../application/domain/utils/stages'
import { SleepPatternDataSet } from '../../application/domain/model/sleep.pattern.data.set'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { Sleep } from '../../application/domain/model/sleep'
import { SleepNightAwakening } from '../../application/domain/model/sleep.night.awakening'
import { ISleepRepository } from '../../application/port/sleep.repository.interface'

/**
 * Task responsible for calculating Night Awakenings associated with a Sleep.
 */
@injectable()
export class NightAwakeningTask {
    private static readonly MINIMUM_PATTERN_DURATION: number = 420000   // 7 minutes in milliseconds.
    private static readonly MINIMUM_STEPS: number = 7

    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.SLEEP_REPOSITORY) private readonly _sleepRepo: ISleepRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async calculateNightAwakening(sleep: Sleep): Promise<Sleep> {
        try {
            // Filters the received sleep data set keeping only AWAKE elements lasting 7 minutes or more.
            const sleepDataSet: Array<SleepPatternDataSet> =
                sleep.pattern!.data_set.filter(elem => {
                    return elem.name === Stages.AWAKE && elem.duration >= NightAwakeningTask.MINIMUM_PATTERN_DURATION
                })

            // Gets first start_time of Sleep data set in format YYYY-MM-dd.
            let startCurrent = this.generateSimpleDate(sleep.pattern?.data_set[0].start_time!)

            // Gets first intraday.
            let intradayDataSet: any = await this._eventBus.executeResource('timeseries.rpc',
                'intraday.find', sleep.patient_id, 'steps', startCurrent, startCurrent,
                '00:00:00', '23:59:59', '1m')
            intradayDataSet = intradayDataSet.data_set

            const result: any = []
            for (const awk of sleepDataSet) {
                // Sets start_time in format YYYY-MM-dd.
                const awkSimpleDate = this.generateSimpleDate(awk.start_time)

                // If the days of the dates are different.
                if (startCurrent.split('-')[2] !== awkSimpleDate.split('-')[2]) {
                    startCurrent = awkSimpleDate
                    // Get second intraday.
                    intradayDataSet = await this._eventBus.executeResource('timeseries.rpc',
                        'intraday.find', sleep.patient_id, 'steps', startCurrent, startCurrent,
                        '00:00:00', '23:59:59', '1m')
                    intradayDataSet = intradayDataSet.data_set
                }

                // Gets start and end time of awake item.
                const start = this.getTime(awk.start_time) // HH:mm:ss
                let end = new Date(new Date(awk.start_time).getTime() + awk.duration).toISOString()
                end = this.getTime(end)

                // Calculates total steps of awake item.
                let totalSteps = 0

                totalSteps = intradayDataSet.reduce((prev, item) => {
                    if (item.time >= start && item.time <= end) return prev + item.value
                    return prev
                }, 0)

                // Associates (or not) a new item to the final result.
                if (totalSteps >= NightAwakeningTask.MINIMUM_STEPS)
                    result.push({ start_time: start, end_time: end, steps: totalSteps })
            }

            sleep.night_awakening = result.map(item => new SleepNightAwakening().fromJSON(item))
            const sleepUp: Sleep = await this._sleepRepo.update(sleep)
            this._logger.info(`Night awakening successfully calculated for the sleep of the patient with id: ${sleep.patient_id}`)
            return Promise.resolve(sleepUp)
        } catch (err) {
            this._logger.error(`An error occurred while attempting calculate the night awakening for the sleep of the patient with id: `
                .concat(`${sleep.patient_id}. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
            return Promise.reject(err)
        }
    }

    /**
     * Builds the date in format YYYY-MM-dd.
     *
     * @param dateString Date used to construct the final date.
     * @return {string}
     */
    private generateSimpleDate(dateString: string): string {
        const date = new Date(dateString)
        return [
            date.getFullYear().toString(),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getDate().toString().padStart(2, '0')
        ].join('-')
    }

    /**
     * Retrieves the time of a date in format HH:mm:ss.
     *
     * @param dateString Date used to retrieve the time.
     * @return {string}
     */
    private getTime(dateString: string): string {
        const date = new Date(dateString)
        return [
            date.getHours().toString().padStart(2, '0'),
            date.getMinutes().toString().padStart(2, '0'),
            date.getSeconds().toString().padStart(2, '0')
        ].join(':')
    }
}
