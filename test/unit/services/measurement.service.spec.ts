import { Measurement } from '../../../src/application/domain/model/measurement'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { MeasurementService } from '../../../src/application/service/measurement.service'
import { MeasurementRepositoryMock } from '../../mocks/repositories/measurement.repository.mock'
import { assert } from 'chai'
import { Query } from '../../../src/infrastructure/repository/query/query'

describe('Services: MeasurementService', () => {
    const measurement: Measurement = new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT)
    measurement.id = DefaultEntityMock.MEASUREMENT.id
    const service: MeasurementService = new MeasurementService(new MeasurementRepositoryMock())

    describe('add()', () => {
        context('when add a new measurement', () => {
            it('should return the new measurement', () => {
                return service.add(measurement)
                    .then(result => {
                        assert.propertyVal(result, 'value', measurement.value)
                        assert.propertyVal(result, 'unit', measurement.unit)
                        assert.propertyVal(result, 'type', measurement.type)
                        assert.propertyVal(result, 'user_id', measurement.user_id)
                        assert.propertyVal(result, 'device_id', measurement.device_id)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.add(new Measurement())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.propertyVal(err, 'description', 'Measurement validation: value, unit, type, user_id required!')
                    })
            })
        })

        context('when add a new measurement that contains a measurement associated', () => {
            it('should return the new measurement', () => {
                measurement.measurements = [new Measurement().fromJSON(DefaultEntityMock.MEASUREMENT_TEMPERATURE)]
                return service.add(measurement)
                    .then(result => {
                        assert.propertyVal(result, 'value', measurement.value)
                        assert.propertyVal(result, 'unit', measurement.unit)
                        assert.propertyVal(result, 'type', measurement.type)
                        assert.propertyVal(result, 'user_id', measurement.user_id)
                        assert.propertyVal(result, 'device_id', measurement.device_id)
                    })
            })

            it('should reject an error for invalid parameters', () => {
                measurement.measurements = [new Measurement()]
                return service.add(measurement)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.propertyVal(err, 'description', 'Measurement validation: value, unit, type, user_id required!')
                    })
            })
        })
    })

    describe('getAll()', () => {
        context('when get all measurements', () => {
            it('should return a list of measurements', () => {
                return service.getAll(new Query().fromJSON({ filters: { user_id: measurement.user_id } }))
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

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.getAll(new Query().fromJSON({ filters: { user_id: '123' } }))
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should reject an error for empty parameters', () => {
                return service.getAll(new Query().fromJSON({ filters: { user_id: '' } }))
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })
    describe('getById()', () => {
        context('when get a unique measurement', () => {
            it('should return a measurement', () => {
                return service.getById(measurement.id!, new Query().fromJSON({ filters: { user_id: measurement.user_id } }))
                    .then(result => {
                        assert.propertyVal(result, 'value', measurement.value)
                        assert.propertyVal(result, 'unit', measurement.unit)
                        assert.propertyVal(result, 'type', measurement.type)
                        assert.propertyVal(result, 'user_id', measurement.user_id)
                        assert.propertyVal(result, 'device_id', measurement.device_id)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.getById('321', new Query().fromJSON({ filters: { user_id: '123' } }))
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should reject an error for empty parameters', () => {
                return service.getById('', new Query())
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })
    describe('update()', () => {
        context('when update a measurement', () => {
            it('should return the updated measurement', () => {
                measurement.device_id = undefined
                measurement.user_id = undefined
                return service.update(measurement)
                    .then(result => {
                        assert.propertyVal(result, 'value', measurement.value)
                        assert.propertyVal(result, 'unit', measurement.unit)
                        assert.propertyVal(result, 'type', measurement.type)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                measurement.device_id = '123'
                measurement.user_id = '321'
                return service.update(measurement)
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should reject an error for empty parameters', () => {
                measurement.device_id = ''
                measurement.user_id = ''
                return service.update(measurement)
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')

                    })
            })
        })
    })

    describe('removeMeasurement()', () =>{
        context('when remove a measurement', () => {
            it('should return true', () => {
                measurement.id = DefaultEntityMock.MEASUREMENT.id
                measurement.user_id = DefaultEntityMock.MEASUREMENT.user_id
                return service.removeMeasurement(measurement.id!, measurement.user_id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.removeMeasurement('123', '321')
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should reject an error for empty parameters', () => {
                return service.removeMeasurement('', '')
                    .catch(err => {
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('remove()', () => {
        it('should throw an error for does not implemented', () => {
            return service
                .remove(measurement.id!)
                .catch(err => {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                })
        })
    })
})
