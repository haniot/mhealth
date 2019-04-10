import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import sinon from 'sinon'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { assert } from 'chai'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { Measurement } from '../../../src/application/domain/model/measurement'
import { MeasurementRepoModel } from '../../../src/infrastructure/database/schema/measurement.schema'
import { MeasurementRepository } from '../../../src/infrastructure/repository/measurement.repository'

require('sinon-mongoose')

describe('Repositories: measurementRepository', () => {
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
    measurement.id = DefaultEntityMock.MEASUREMENT.id
    const modelFake: any = MeasurementRepoModel
    const repo = new MeasurementRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())

    afterEach(() => {
        sinon.restore()
    })

    describe('create()', () => {
        // context('when save a new measurement', () => {
        //     it('should return the saved measurement', () => {
        //         sinon
        //             .mock(modelFake)
        //             .expects('create')
        //             .withArgs(measurement)
        //             .chain('findOne')
        //             .withArgs({ _id: measurement.id })
        //             .chain('select')
        //             .chain('exec')
        //             .resolves(measurement)
        //
        //         return repo.create(measurement)
        //             .then(result => {
        //                 console.log(result)
        //             })
        //     })
        // })
        // context('when the measurement is not saved', () => {
        //     it('should return undefined', () => {
        //         sinon
        //             .mock(modelFake)
        //             .expects('create')
        //             .withArgs(measurement)
        //             .chain('findOne')
        //             .withArgs({ _id: measurement.id })
        //             .chain('select')
        //             .chain('exec')
        //             .resolves(undefined)
        //
        //         return repo.create(measurement)
        //             .then(result => console.log(result))
        //             .catch(err => console.log(err))
        //     })
        // })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(measurement)
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.create(measurement)
                    .catch(err => {
                        assert.property(err, 'name')
                        assert.propertyVal(err, 'name', 'Error')
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('find()', () => {
        context('when want get all measurements', () => {
            it('should return a list of measurements', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('populate')
                    .chain('exec')
                    .resolves([measurement])

                return repo.find(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 1)
                        assert.propertyVal(result[0], 'value', measurement.value)
                        assert.propertyVal(result[0], 'unit', measurement.unit)
                        assert.propertyVal(result[0], 'type', measurement.type)
                        assert.propertyVal(result[0], 'user_id', measurement.user_id)
                        assert.propertyVal(result[0], 'device_id', measurement.device_id)
                    })
            })
        })

        context('when there are no measurements', () => {
            it('should return empty array', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('populate')
                    .chain('exec')
                    .resolves([])

                return repo.find(new Query())
                    .then(result => {
                        assert.isArray(result)
                        assert.lengthOf(result, 0)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .chain('select')
                    .chain('sort')
                    .chain('skip')
                    .chain('limit')
                    .chain('populate')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.find(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('findOne()', () => {
        context('when get a unique measurement', () => {
            it('should return a measurement', () => {
                const query = new Query()
                query.addFilter({ _id: measurement.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: measurement.id })
                    .chain('select')
                    .chain('populate')
                    .chain('exec')
                    .resolves(measurement)

                return repo.findOne(query)
                    .then(result => {
                        assert.propertyVal(result, 'value', measurement.value)
                        assert.propertyVal(result, 'unit', measurement.unit)
                        assert.propertyVal(result, 'type', measurement.type)
                        assert.propertyVal(result, 'user_id', measurement.user_id)
                        assert.propertyVal(result, 'device_id', measurement.device_id)
                    })
            })
        })

        context('when the measurement is not found', () => {
            it('should return undefined', () => {
                const query = new Query()
                query.addFilter({ _id: measurement.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: measurement.id })
                    .chain('select')
                    .chain('populate')
                    .chain('exec')
                    .resolves(undefined)

                return repo.findOne(query)
                    .then(result => {
                        assert.equal(result, undefined)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                const query = new Query()
                query.addFilter({ _id: measurement.id })

                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs({ _id: measurement.id })
                    .chain('select')
                    .chain('populate')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.findOne(query)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })

    })

    describe('update()', () => {
        context('when update a measurement', () => {
            it('should return the updated measurement', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: measurement.id }, measurement, { new: true })
                    .chain('populate')
                    .chain('exec')
                    .resolves(measurement)

                return repo.update(measurement)
                    .then(result => {
                        assert.propertyVal(result, 'value', measurement.value)
                        assert.propertyVal(result, 'unit', measurement.unit)
                        assert.propertyVal(result, 'type', measurement.type)
                        assert.propertyVal(result, 'user_id', measurement.user_id)
                        assert.propertyVal(result, 'device_id', measurement.device_id)
                    })
            })
        })

        context('when the measurement is not found', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: measurement.id }, measurement, { new: true })
                    .chain('populate')
                    .chain('exec')
                    .resolves(undefined)

                return repo.update(measurement)
                    .then(result => {
                        assert.equal(result, undefined)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndUpdate')
                    .withArgs({ _id: measurement.id }, measurement, { new: true })
                    .chain('populate')
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.update(measurement)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('delete()', () => {
        context('when remove a measurement', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: measurement.id })
                    .chain('exec')
                    .resolves(true)

                return repo.delete(measurement.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when the measurement is not found', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: measurement.id })
                    .chain('exec')
                    .resolves(false)

                return repo.delete(measurement.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: measurement.id })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.delete(measurement.id!)
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })

    describe('count()', () => {
        context('when count all measurements by a filter', () => {
            it('should return the number of measurements', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .resolves(1)

                return repo.count(new Query())
                    .then(result => {
                        assert.isNumber(result)
                        assert.equal(result, 1)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({})
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!' })

                return repo.count(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'name', 'Error')
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                    })
            })
        })
    })
})
