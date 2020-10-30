import { ObjectId } from 'bson'
import { Phases } from '../../../application/domain/utils/phases'

/**
 * Utility class with methods that assist in creating filters for the aggregate function of the SleepDurationRepository.
 */
export class SleepDurationQueryFilters {
    /**
     * Builds filters for the query used in aggregating sleep durations.
     *
     * @param patientId Patient unique identifier.
     * @param startTime Start date in the format `yyyy-MM-ddTHH:mm:ss[Z]`.
     * @param endTime End date in the format `yyyy-MM-ddTHH:mm:ss[Z]`.
     * @return {Array<object>}
     */
    public buildFilters(patientId: string, startTime: Date, endTime: Date): Array<object> {
        const filters: Array<object> = []

        // Filters all Sleeps using patient_id and end_time.
        filters.push({ $match: { patient_id: new ObjectId(patientId), end_time: { $gte: startTime, $lte: endTime } } })

        // Stores a new variable in each Sleep with the total durations of the patterns that are not 'awake' or 'restless'.
        filters.push({
            $set: {
                total_durations: this.reduceByName('$pattern', 0, [Phases.AWAKE, Phases.RESTLESS])
            }
        })

        // Groups Sleep objects by 'end_time' and a new variable (value) that stores the sum of the 'total_durations' of the day.
        filters.push({
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$end_time' } },
                value: { $sum: '$total_durations' }
            }
        })

        // Adjusts each result item by changing the name of the variable '_id' by 'date'.
        filters.push({ $project: { _id: 0, date: '$_id', value: '$value' } })

        // Groups the sum of all values ('total' variable) and puts the previous grouping in the 'data_set' variable.
        filters.push({ $group: { _id: null, total: { $sum: '$value' }, data_set: { $push: '$$ROOT' } } })

        // Adjusts the final result by adding the 'summary' variable that stores the 'total' object.
        filters.push({ $project: { _id: 0, summary: { total: '$total' }, data_set: '$data_set' } })

        return filters
    }

    /**
     * Builds a reduce operator on an array based on {pattern.name}.
     *
     * @param inputArray Input array.
     * @param initialCumulativeValue Initial cumulative value.
     * @param types Array of types to be disregarded in the operation.
     * @return {object}
     */
    private reduceByName(inputArray: string, initialCumulativeValue: number, types: Array<string>): object {
        return {
            $reduce: {
                input: inputArray,
                initialValue: initialCumulativeValue,
                in: {
                    $cond: {
                        if: {
                            $not: {
                                $or: [
                                    { $eq: ['$$this.name', types[0]] },
                                    { $eq: ['$$this.name', types[1]] }
                                ]
                            }
                        },
                        then: {
                            $add: ['$$value', '$$this.duration']
                        },
                        else: '$$value'
                    }
                }
            }
        }
    }
}
