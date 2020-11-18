import { ObjectId } from 'bson'

export class SleepDurationQueryFiltersMock {
    /**
     * Builds match filter for the query used in aggregating sleep durations.
     *
     * @param patientId Patient unique identifier.
     * @param startTime Start date in the format `yyyy-MM-ddTHH:mm:ss[Z]`.
     * @param endTime End date in the format `yyyy-MM-ddTHH:mm:ss[Z]`.
     * @return {Array<object>}
     */
    public buildMatchFilter(patientId: string, startTime: Date, endTime: Date): object {
        return { $match: { patient_id: new ObjectId(patientId), end_time: { $gte: startTime, $lte: endTime } } }
    }

    /**
     * Defines an attribute in the return that will store total durations of the patterns that are not 'awake' or 'restless'.
     *
     * @param inputArray Input array.
     * @param initialCumulativeValue Initial cumulative value.
     * @param types Array of types to be disregarded in the operation.
     * @return {object}
     */
    public setTotalDuration(inputArray: string, initialCumulativeValue: number, types: Array<string>): object {
        return { $set: { total_durations: this.reduceByName(inputArray, initialCumulativeValue, types) } }
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

    /**
     * Builds an aggregation group pipeline stage by end_time for the query used in aggregating sleep durations.
     *
     * @return {object}
     */
    public groupByEndTime(): object {
        return {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$end_time' } },
                value: { $sum: '$total_durations' }
            }
        }
    }

    /**
     * Builds an aggregation project pipeline stage for the query used in aggregating sleep durations (projecting date).
     *
     * @return {object}
     */
    public projectDate(): object {
        return { $project: { _id: 0, date: '$_id', value: '$value' } }
    }

    /**
     * Builds an aggregation group pipeline stage for the query used in aggregating sleep durations (groups data_set).
     *
     * @return {object}
     */
    public groupDataSet(): object {
        return { $group: { _id: null, total: { $sum: '$value' }, data_set: { $push: '$$ROOT' } } }
    }

    /**
     * Builds an aggregation project pipeline stage for the query used in aggregating sleep durations (projecting summary).
     *
     * @return {object}
     */
    public projectSummary(): object {
        return { $project: { _id: 0, summary: { total: '$total' }, data_set: '$data_set' } }
    }
}
