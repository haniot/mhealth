import { assert } from 'chai'
import { IMeasurementService } from '../../../src/application/port/measurement.service.interface'
import { MeasurementService } from '../../../src/application/service/measurement.service'
import { MeasurementRepositoryMock } from '../../mocks/repositories/measurement.repository.mock'
import { DeviceRepositoryMock } from '../../mocks/repositories/device.repository.mock'
import { GenericMeasurementMock } from '../../mocks/models/generic.measurement.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { StatusSuccess } from '../../../src/application/domain/model/status.success'
import { Query } from '../../../src/infrastructure/repository/query/query'
import { Strings } from '../../../src/utils/strings'
import { Fat } from '../../../src/application/domain/model/fat'
import { StatusError } from '../../../src/application/domain/model/status.error'
import {Measurement} from '../../../src/application/domain/model/measurement'

describe('Services: MeasurementService', () => {
    const measurement: GenericMeasurementMock = new GenericMeasurementMock().fromJSON(DefaultEntityMock.GENERIC_MEASUREMENT_MOCK)
    const multMeasurement: Array<GenericMeasurementMock> = new Array<GenericMeasurementMock>()
    multMeasurement.push(measurement)
    measurement.id = DefaultEntityMock.GENERIC_MEASUREMENT_MOCK.id
    measurement.type = MeasurementTypes.BLOOD_GLUCOSE
    measurement.fat = new Fat().fromJSON({
        ...DefaultEntityMock.WEIGHT.fat,
        type: DefaultEntityMock.FAT.type,
        timestamp: DefaultEntityMock.WEIGHT.timestamp,
        user_id: DefaultEntityMock.WEIGHT.device_id,
        device_id: DefaultEntityMock.WEIGHT.device_id
    })
    const service: IMeasurementService = new MeasurementService(new MeasurementRepositoryMock(), new DeviceRepositoryMock())

    describe('addMeasurement()', () => {
        context('when add a measurement', () => {
            it('should return the measurement', () => {
                return service
                    .addMeasurement(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
        })

        context('when add a list of measurements', () => {
            it('should return a multi status object', () => {
                return service
                    .addMeasurement([measurement])
                    .then(result => {
                        assert.deepPropertyVal(result, 'success', [new StatusSuccess(201, measurement)])
                        assert.deepPropertyVal(result, 'error', [])
                    })
            })
            context('when there are errors', () => {
                it('should return a multi status object with conflict exception', () => {
                    measurement.id = DefaultEntityMock.MEASUREMENT.id
                    return service
                        .addMeasurement([measurement])
                        .then(result => {
                            assert.deepPropertyVal(result, 'success', [])
                            assert.deepPropertyVal(result, 'error',
                                [new StatusError(
                                    409,
                                    'Measurement already registered!',
                                    `A ${measurement.type} measurement from ${measurement.user_id} ` +
                                    `collected by device ${measurement.device_id} at ${measurement.timestamp} already exists.`,
                                    measurement)])
                            measurement.id = DefaultEntityMock.GENERIC_MEASUREMENT_MOCK.id
                        })
                })

                it('should return a multi status object with conflict exception', () => {
                    measurement.user_id = '123'
                    return service
                        .addMeasurement([measurement])
                        .then(result => {
                            assert.deepPropertyVal(result, 'success', [])
                            assert.deepPropertyVal(result, 'error',
                                [new StatusError(
                                    400,
                                    Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT,
                                    Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC,
                                    measurement)])
                            measurement.user_id = DefaultEntityMock.GENERIC_MEASUREMENT_MOCK.user_id
                        })
                })
            })
        })

    })


    describe('getAll()', () => {
        context('when get all measurements from user', () => {
            it('should return a list of measurements from user', () => {
                return service
                    .getAll(new Query().fromJSON({
                        filters: {
                            user_id: measurement.user_id,
                            type: MeasurementTypes.BLOOD_GLUCOSE
                        }
                    }))
                    .then(result => {
                        assert.deepEqual(result, [measurement])
                    })
            })
            it('should return a list of measurements', () => {
                return service
                    .getAll(new Query().fromJSON({ filters: { type: MeasurementTypes.BLOOD_GLUCOSE } }))
                    .then(result => {
                        assert.deepEqual(result, [measurement])
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return an error', () => {
                return service
                    .getAll(new Query().fromJSON({
                        filters: {
                            user_id: '123',
                            type: MeasurementTypes.BLOOD_GLUCOSE
                        }
                    }))
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('getById()', () => {
        context('when get a unique measurement', () => {
            it('should return a measurement from user', () => {
                return service
                    .getById(
                        measurement.id!,
                        new Query().fromJSON({
                            filters: {
                                user_id: measurement.user_id,
                                type: MeasurementTypes.BLOOD_GLUCOSE
                            }
                        }))
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })

            it('should return a measurement', () => {
                return service
                    .getById(measurement.id!, new Query().fromJSON({ filters: { type: MeasurementTypes.BLOOD_GLUCOSE } }))
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return an error', () => {
                return service
                    .getById(
                        '123',
                        new Query().fromJSON({
                            filters: {
                                user_id: measurement.user_id,
                                type: MeasurementTypes.BLOOD_GLUCOSE
                            }
                        })
                    )
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('removeMeasurement()', () => {
        context('when delete a measurement', () => {
            it('should return true', () => {
                return service
                    .removeMeasurement(measurement.id!, measurement.user_id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return an error', () => {
                return service
                    .removeMeasurement('123', '321')
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('add()', () => {
        context('when add a new device', () => {
            it('should return the saved device', () => {
                return service.add(measurement)
                    .then(result => {
                        assert.propertyVal(result, 'unit', measurement.unit)
                        assert.propertyVal(result, 'type', measurement.type)
                        assert.propertyVal(result, 'device_id', measurement.device_id)
                        assert.propertyVal(result, 'user_id', measurement.user_id)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should reject an error for invalid parameters', () => {
                return service.add(new Measurement())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Value not mapped for type: undefined')
                        assert.propertyVal(err, 'description', 'The mapped values are: weight, blood_glucose, ' +
                            'heart_rate, blood_pressure, height, waist_circumference, body_temperature, fat.')
                    })
            })

            it('should reject an error for invalid type', () => {
                const measurementTest: GenericMeasurementMock =
                    new GenericMeasurementMock().fromJSON(DefaultEntityMock.GENERIC_MEASUREMENT_MOCK)
                measurementTest.type = '123'
                return service.add(measurementTest)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Measurement already registered!')
                        assert.propertyVal(err, 'description', 'A 123 measurement from 5a62be07d6f33400146c9b61 ' +
                            'collected by device 5ca77314bc08ec205689a736 at 2018-11-19T14:40:00Z already exists.')
                    })
            })

            it('should reject an error for invalid Weight', () => {
                const measurementTest: GenericMeasurementMock =
                    new GenericMeasurementMock().fromJSON(DefaultEntityMock.GENERIC_MEASUREMENT_MOCK)

                measurementTest.type = MeasurementTypes.WEIGHT
                return service.add(measurementTest)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Measurement already registered!')
                        assert.propertyVal(err, 'description', 'A weight measurement from 5a62be07d6f33400146c9b61 ' +
                            'collected by device 5ca77314bc08ec205689a736 at 2018-11-19T14:40:00Z already exists.')
                    })
            })

            it('should reject an error for invalid device_id', () => {
                const measurementTest: GenericMeasurementMock =
                    new GenericMeasurementMock().fromJSON(DefaultEntityMock.GENERIC_MEASUREMENT_MOCK)
                measurementTest.device_id = 'invalid'
                return service.add(measurementTest)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Device not found!')
                        assert.propertyVal(err, 'description', 'Device not found or already removed.' +
                            ' A new operation for the same resource is required.')
                    })
            })

            it('should reject an error for measurement exists in weight', () => {
                const measurementTest: GenericMeasurementMock =
                    new GenericMeasurementMock().fromJSON(DefaultEntityMock.GENERIC_MEASUREMENT_MOCK)
                measurementTest.id = '5cb488278cf5f9e6760c14ee'
                measurementTest.type = MeasurementTypes.WEIGHT
                measurementTest.fat = new Fat().fromJSON({
                    ...DefaultEntityMock.WEIGHT.fat,
                    type: DefaultEntityMock.FAT.type,
                    timestamp: DefaultEntityMock.WEIGHT.timestamp,
                    user_id: DefaultEntityMock.WEIGHT.device_id,
                    device_id: DefaultEntityMock.WEIGHT.device_id
                })
                measurementTest.fat!.id = 'invalid'


                return service.add(measurementTest)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Measurement already registered!')
                        assert.propertyVal(err, 'description', 'A fat measurement from 5ca77314bc08ec205689a736 ' +
                            'collected by device 5ca77314bc08ec205689a736 at 2018-11-19T14:40:00Z already exists.')
                    })
            })
        })


        context('when add a measurement', () => {
            it('should return a blood glucose measurement', () => {
                return service
                    .add(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
            it('should return a blood pressure measurement', () => {
                measurement.type = MeasurementTypes.BLOOD_PRESSURE
                return service
                    .add(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
            it('should return a body temperature measurement', () => {
                measurement.type = MeasurementTypes.BODY_TEMPERATURE
                return service
                    .add(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
            it('should return a heart rate measurement', () => {
                measurement.type = MeasurementTypes.HEART_RATE
                return service
                    .add(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
            it('should return a height measurement', () => {
                measurement.type = MeasurementTypes.HEIGHT
                return service
                    .add(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
            it('should return a waist circumference measurement', () => {
                measurement.type = MeasurementTypes.WAIST_CIRCUMFERENCE
                return service
                    .add(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
            it('should return a weight measurement', () => {
                measurement.type = MeasurementTypes.WEIGHT
                measurement.fat!.id = measurement.id
                return service
                    .add(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
            it('should return a fat measurement', () => {
                measurement.type = MeasurementTypes.FAT
                return service
                    .add(measurement)
                    .then(result => {
                        assert.deepEqual(result, measurement)
                    })
            })
        })

        context('when the measurement already exists', () => {
            it('should return a error', () => {
                measurement.id = DefaultEntityMock.FAT.id
                return service
                    .add(measurement)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Measurement already registered!')
                        assert.propertyVal(err, 'description', `A ${measurement.type} measurement from ${measurement.user_id} ` +
                            `collected by device ${measurement.device_id} at ${measurement.timestamp} already exists.`)
                    })
            })
        })

        context('when type is not mapped', () => {
            it('should return a error', () => {
                measurement.id = DefaultEntityMock.GENERIC_MEASUREMENT_MOCK.id
                measurement.type = 'invalid'
                return service
                    .add(measurement)
                    .catch(err => {
                        assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat(`type: ${measurement.type}`))
                        assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                            .concat(Object.values(MeasurementTypes).join(', ').concat('.')))
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

    describe('update()', () => {
        it('should throw an error for does not implemented', () => {
            return service
                .update(measurement)
                .catch(err => {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                })
        })
    })
})
