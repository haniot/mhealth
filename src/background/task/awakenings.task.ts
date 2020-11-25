import { Stages } from '../../application/domain/utils/stages'
import { SleepPatternDataSet } from '../../application/domain/model/sleep.pattern.data.set'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { Sleep } from '../../application/domain/model/sleep'
import { SleepAwakening } from '../../application/domain/model/sleep.awakening'
import { ISleepRepository } from '../../application/port/sleep.repository.interface'

/**
 * Task responsible for calculating Awakenings associated with a Sleep.
 */
@injectable()
export class AwakeningsTask {
    private static readonly MINIMUM_HOUR: number = 18
    private static readonly MAXIMUM_HOUR: number = 6
    private static readonly MINIMUM_PATTERN_DURATION: number = 420000   // 7 minutes in milliseconds.
    private static readonly MINIMUM_STEPS: number = 7

    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.SLEEP_REPOSITORY) private readonly _sleepRepo: ISleepRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async calculateAwakenings(sleep: Sleep): Promise<Sleep> {
        try {
            // Filters the received sleep data set, keeping only the AWAKE elements lasting 7 minutes or more
            // which have the hour >= 18 or < 6.
            const sleepDataSet: Array<SleepPatternDataSet> =
                sleep.pattern!.data_set.filter(elem => {
                    const elemHour = (new Date(elem.start_time)).getHours()
                    return (elemHour >= AwakeningsTask.MINIMUM_HOUR || elemHour < AwakeningsTask.MAXIMUM_HOUR) &&
                        elem.name === Stages.AWAKE && elem.duration >= AwakeningsTask.MINIMUM_PATTERN_DURATION
                })

            // If the filtered sleep pattern data set has no elements it returns the received Sleep.
            if (!sleepDataSet.length) {
                this._logger.info(`Awakenings successfully calculated for sleep with id: ${sleep.id}`)
                return Promise.resolve(sleep)
            }

            // Gets first start_time of Sleep data set in format YYYY-MM-dd.
            let startCurrent = this.generateSimpleDate(sleep.pattern?.data_set[0].start_time!)

            // Gets first intraday.
            let intradayDataSet: any = (await this.getIntraday(sleep.patient_id, startCurrent, startCurrent)).data_set

            const result: any = []
            for (const awk of sleepDataSet) {
                // Sets start_time in format YYYY-MM-dd.
                const awkSimpleDate = this.generateSimpleDate(awk.start_time)

                // If the days of the dates are different.
                if (startCurrent.split('-')[2] !== awkSimpleDate.split('-')[2]) {
                    startCurrent = awkSimpleDate
                    // Get second intraday.
                    intradayDataSet = (await this.getIntraday(sleep.patient_id, startCurrent, startCurrent)).data_set
                }

                // Gets start and end time of awake item.
                const start = this.getTime(awk.start_time) // HH:mm:ss
                const end = this.getTime(new Date(new Date(awk.start_time).getTime() + awk.duration).toISOString())

                // Calculates total steps of awake item.
                let totalSteps = 0

                totalSteps = intradayDataSet.reduce((prev, item) => {
                    if (item.time >= start && item.time <= end) return prev + item.value
                    return prev
                }, 0)

                // Associates (or not) a new item to the final result.
                if (totalSteps >= AwakeningsTask.MINIMUM_STEPS)
                    result.push({ start_time: start, end_time: end, duration: awk.duration, steps: totalSteps })
            }

            sleep.awakenings = result.map(item => new SleepAwakening().fromJSON(item))
            const sleepUp: Sleep | undefined = await this._sleepRepo.update(sleep)

            this._logger.info(`Awakenings successfully calculated for sleep with id: ${sleep.id}`)

            if (!sleepUp) {
                sleep.awakenings = undefined
                return Promise.resolve(sleep)
            }
            return Promise.resolve(sleepUp)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Retrieves an intraday time series.
     *
     * @param patientId Patient ID.
     * @param startDate Date used to get intraday time series.
     * @param endDate Date used to get intraday time series.
     * @return {Promise<any>}
     */
    private getIntraday(patientId: string, startDate: string, endDate: string): Promise<any> {
        return this._eventBus.executeResource('timeseries.rpc', 'intraday.find',
            patientId, 'steps', startDate, endDate, '00:00:00', '23:59:59', '1m')
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
