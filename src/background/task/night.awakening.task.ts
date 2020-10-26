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
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.SLEEP_REPOSITORY) private readonly _sleepRepo: ISleepRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async calculateNightAwakening(sleep: Sleep): Promise<void> {
        try {
            // Filters the received sleep data set keeping only AWAKE elements lasting 7 minutes or more.
            const sleepDataSet: Array<SleepPatternDataSet> =
                sleep.pattern!.data_set.filter(elem => elem.name === Stages.AWAKE && elem.duration >= 420000)

            // Gets first start_time of Sleep data set in format YYYY-MM-DD.
            let startCurrent = this.generateDate(sleep.pattern?.data_set[0].start_time!)

            // Gets first intraday.
            let intradayDataSet: any = await this._eventBus.executeResource('timeseries.rpc',
                'intraday.find', sleep.patient_id, 'steps', startCurrent, startCurrent,
                '00:00:00', '23:59:59', '1m')
            intradayDataSet = intradayDataSet.data_set

            const result: any = []
            for (const awk of sleepDataSet) {
                // Disregards timezone.
                const awkStart = new Date(awk.start_time)
                const awkStartTimezone = awkStart.getTimezoneOffset() * 60000
                const awkStartWithoutTimezone = new Date(awkStart.getTime() - awkStartTimezone)

                // Redefines start_time of the awake item.
                awk.start_time = awkStartWithoutTimezone.toISOString().slice(0, -1)   // Disregards the 'Z'.

                // Sets start_time in format YYYY-MM-DD.
                const awkSimpleDate = this.generateDate(awk.start_time)

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
                const start = awk.start_time.split('T')[1].split('.')[0] // HH:mm:ss
                let end = new Date(awkStartWithoutTimezone.getTime() + awk.duration).toISOString()
                end = end.split('T')[1].split('.')[0]

                // Calculates total steps of awake item.
                let totalSteps = 0
                for (const intradayItem of intradayDataSet) {
                    if (intradayItem.time >= start && intradayItem.time <= end) {
                        totalSteps += intradayItem.value
                    }
                }

                // Associates (or not) a new item to the final result.
                if (totalSteps >= 7) {
                    result.push(
                        {
                            start_time: start,
                            end_time: end,
                            steps: totalSteps
                        }
                    )
                }
            }

            sleep.night_awakening = result.map(item => new SleepNightAwakening().fromJSON(item))
            await this._sleepRepo.update(sleep)
            this._logger.info(`Night awakening successfully calculated for the sleep of the patient with id: ${sleep.patient_id}`)
        } catch (err) {
            this._logger.error(`An error occurred while attempting calculate the night awakening for the sleep of the patient with id: `
                .concat(`${sleep.patient_id}. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }

    /**
     * Builds the date in YYYY-MM-DD format.
     *
     * @param dateString Date used to construct the final date.
     * @return {string}
     */
    private generateDate(dateString: string): string {
        const date = new Date(dateString)
        const year = String(date.getFullYear())
        let month = String(date.getMonth() + 1)
        let day = String(date.getDate())

        if (month.length === 1) month = month.padStart(2, '0')
        if (day.length === 1) day = day.padStart(2, '0')

        return [year, month, day].join('-')
    }
}
