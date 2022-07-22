import { expect } from 'chai'
import { App } from '../../../src/app'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Config } from '../../../src/utils/config'
import { Strings } from '../../../src/utils/strings'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { DefaultFunctions } from '../../mocks/utils/default.functions'
import { repoUtils } from '../utils/repository.utils'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: patients.sleep.durations', () => {
    const sleep: Sleep = new SleepMock()
    sleep.start_time = new Date(1604113200000 + Math.floor((Math.random() * 1000))).toISOString()
    sleep.end_time = new Date(new Date(sleep.start_time)
        .setMilliseconds(Math.floor(Math.random() * 7 + 4) * 3.6e+6)).toISOString() // 4-10h in milliseconds
    sleep.patient_id = '5a62be07d6f33400146c9b61'

    const sleep2: Sleep = new SleepMock()
    sleep2.start_time = new Date(1604286000000 + Math.floor((Math.random() * 1000))).toISOString()
    sleep2.end_time = new Date(new Date(sleep2.start_time)
        .setMilliseconds(Math.floor(Math.random() * 7 + 4) * 3.6e+6)).toISOString() // 4-10h in milliseconds
    sleep2.patient_id = '5a62be07d6f33400146c9b61'

    const sleep3: Sleep = new SleepMock()
    sleep3.start_time = new Date(1604286000000 + Math.floor((Math.random() * 1000))).toISOString()
    sleep3.end_time = new Date(new Date(sleep3.start_time)
        .setMilliseconds(Math.floor(Math.random() * 7 + 4) * 3.6e+6)).toISOString() // 4-10h in milliseconds
    sleep3.patient_id = '5a62be07d6f33400146c9b61'

    // Starts DB connection and deletes all sleep objects.
    before(async () => {
        try {
            const mongoConfigs = Config.getMongoConfig()
            await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)

            await repoUtils.deleteAllSleep()
        } catch (err: any) {
            throw new Error('Failure on patients.sleep.durations routes test: ' + err.message)
        }
    })

    // Deletes all sleep objects and stops DB connection.
    after(async () => {
        try {
            await repoUtils.deleteAllSleep()
            await dbConnection.dispose()
        } catch (err: any) {
            throw new Error('Failure on patients.sleep.durations routes test: ' + err.message)
        }
    })
    /**
     * Route GET all sleep durations by patient
     */
    describe('GET /v1/patients/:patient_id/date/:start_date/:end_date/sleep/durations', () => {
        context('when get sleep durations successfully', () => {
            before(async () => {
                try {
                    await repoUtils.deleteAllSleep()

                    await repoUtils.createSleep(sleep)
                    await repoUtils.createSleep(sleep2)
                    await repoUtils.createSleep(sleep3)
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep.durations routes test: ' + err.message)
                }
            })

            it('should return status code 200 and the total sleep durations of the day 2020-10-31 ' +
                '(range 2020-10-30 ~ 2020-11-01)', () => {
                return request
                    .get(`/v1/patients/${sleep.patient_id}/date/2020-10-30/2020-11-01/sleep/durations`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('summary')
                        expect(res.body.data_set.length).to.eql(3)
                        expect(res.body.data_set[0].date).to.eql('2020-10-30')
                        expect(res.body.data_set[0].value).to.eql(0)
                        expect(res.body.data_set[1].date).to.eql('2020-10-31')
                        expect(res.body.data_set[1].value).to.not.eql(0)
                        expect(res.body.data_set[2].date).to.eql('2020-11-01')
                        expect(res.body.data_set[2].value).to.eql(0)
                    })
            })

            it('should return status code 200 and the total sleep durations of the days 2020-10-31 and 2020-11-02 ' +
                '(range 2020-10-30 ~ 2020-11-03)', () => {
                return request
                    .get(`/v1/patients/${sleep.patient_id}/date/2020-10-30/2020-11-03/sleep/durations`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('summary')
                        expect(res.body.data_set.length).to.eql(5)
                        expect(res.body.data_set[0].date).to.eql('2020-10-30')
                        expect(res.body.data_set[0].value).to.eql(0)
                        expect(res.body.data_set[1].date).to.eql('2020-10-31')
                        expect(res.body.data_set[1].value).to.not.eql(0)
                        expect(res.body.data_set[2].date).to.eql('2020-11-01')
                        expect(res.body.data_set[2].value).to.eql(0)
                        expect(res.body.data_set[3].date).to.eql('2020-11-02')
                        expect(res.body.data_set[3].value).to.not.eql(0)
                        expect(res.body.data_set[4].date).to.eql('2020-11-03')
                        expect(res.body.data_set[4].value).to.eql(0)
                    })
            })

            it('should return status code 200 and data_set with values equal to 0 (range 2020-11-05 ~ 2020-11-08)', () => {
                return request
                    .get(`/v1/patients/${sleep.patient_id}/date/2020-11-05/2020-11-08/sleep/durations`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.summary.total).to.eql(0)
                        expect(res.body.data_set.length).to.eql(4)
                        expect(res.body.data_set[0].date).to.eql('2020-11-05')
                        expect(res.body.data_set[0].value).to.eql(0)
                        expect(res.body.data_set[1].date).to.eql('2020-11-06')
                        expect(res.body.data_set[1].value).to.eql(0)
                        expect(res.body.data_set[2].date).to.eql('2020-11-07')
                        expect(res.body.data_set[2].value).to.eql(0)
                        expect(res.body.data_set[3].date).to.eql('2020-11-08')
                        expect(res.body.data_set[3].value).to.eql(0)
                    })
            })

            it('should return status code 200 and an empty object for today\'s total sleep durations (range today ~ today)',
                () => {
                    return request
                        .get(`/v1/patients/${sleep.patient_id}/date/today/today/sleep/durations`)
                        .set('Content-Type', 'application/json')
                        .expect(200)
                        .then(res => {
                            expect(res.body.summary.total).to.eql(0)
                            expect(res.body.data_set.length).to.eql(1)
                            expect(res.body.data_set[0].date).to.eql(DefaultFunctions.generateSimpleDate(new Date().toISOString()))
                            expect(res.body.data_set[0].value).to.eql(0)
                        })
                })
        })

        context('when there are validation errors', () => {
            before(async () => {
                try {
                    await repoUtils.deleteAllSleep()
                } catch (err: any) {
                    throw new Error('Failure on patients.sleep routes test: ' + err.message)
                }
            })

            it('should return status code 400 when patient_id is not in valid format', () => {
                return request
                    .get('/v1/patients/123/date/today/today/sleep/durations')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 when start_date is not in valid format', () => {
                return request
                    .get(`/v1/patients/${sleep.patient_id}/date/30-10-2020/2020-11-03/sleep/durations`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.DATE.INVALID_FORMAT
                            .replace('{0}', '30-10-2020'))
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.DATE.INVALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 when end_date is not in valid format ' +
                'because month 02 has no day 29 in the year 2019', () => {
                    return request
                        .get(`/v1/patients/${sleep.patient_id}/date/2019-02-10/2019-02-29/sleep/durations`)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.DATE.INVALID_FORMAT
                                .replace('{0}', '2019-02-29'))
                        })
                })

            it('should return status code 400 when start_date is not in valid format because the year is less than 1678',
                () => {
                    return request
                        .get(`/v1/patients/${sleep.patient_id}/date/1677-10-30/2020-11-03/sleep/durations`)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.DATE.YEAR_NOT_ALLOWED
                                .replace('{0}', '1677-10-30'))
                        })
                })

            it('should return status code 400 when end_date is not in valid format because the year is greater than 2261',
                () => {
                    return request
                        .get(`/v1/patients/${sleep.patient_id}/date/2020-10-30/2262-11-03/sleep/durations`)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.code).to.eql(400)
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.DATE.YEAR_NOT_ALLOWED
                                .replace('{0}', '2262-11-03'))
                        })
                })

            it('should return status code 400 when end date is less than start date', () => {
                return request
                    .get(`/v1/patients/${sleep.patient_id}/date/2020-11-15/2020-11-10/sleep/durations`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.DATE.RANGE_INVALID
                            .replace('{0}', '2020-11-15')
                            .replace('{1}', '2020-11-10'))
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.DATE.RANGE_INVALID_DESC)
                    })
            })

            it('should return status code 400 when the difference between start and end date is greater than 1 year', () => {
                return request
                    .get(`/v1/patients/${sleep.patient_id}/date/2019-01-01/2020-01-02/sleep/durations`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.code).to.eql(400)
                        expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.DATE.RANGE_INVALID
                            .replace('{0}', '2019-01-01')
                            .replace('{1}', '2020-01-02'))
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.DATE.RANGE_EXCEED_YEAR_DESC)
                    })
            })
        })
    })
})
