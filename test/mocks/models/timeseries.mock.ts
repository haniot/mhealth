export class TimeseriesMock {

    public generate(): any {
        const timeSeriesDataSet: Array<any> = [
            { time: '01:00:00', value: 7 },
            { time: '02:00:00', value: 6 },
            { time: '03:00:00', value: 7 }
        ]

        return { data_set: timeSeriesDataSet }
    }
}
