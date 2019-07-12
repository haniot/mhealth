import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'
import { HeartRate } from '../../../src/application/domain/model/heart.rate'
import { CreateHeartRateValidator } from '../../../src/application/domain/validator/create.heart.rate.validator'
import { DataSetItem } from '../../../src/application/domain/model/data.set.item'

describe('Validators: CreateHeartRateValidator', () => {
    const measurement: HeartRate = new HeartRate().fromJSON(DefaultEntityMock.HEART_RATE)

    it('should return undefined when the validation was successful', () => {
        const result = CreateHeartRateValidator.validate(measurement)
        assert.isUndefined(result)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass dataset', () => {
            measurement.dataset = undefined
            try {
               CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HeartRate validation: dataset required!')
            }
        })
        it('should throw an error for does pass dataset item without value', () => {
            measurement.dataset = [new DataSetItem().fromJSON({ timestamp: DefaultEntityMock.HEART_RATE.dataset[0].timestamp })]
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HeartRate validation: dataset.item.value required!')
            }
        })
        it('should throw an error for does pass dataset item without timestamp', () => {
            measurement.dataset = [new DataSetItem().fromJSON({ value: DefaultEntityMock.HEART_RATE.dataset[0].value })]
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HeartRate validation: dataset.item.timestamp required!')
            } finally {
                measurement.dataset = DefaultEntityMock.HEART_RATE.dataset.map(item => new DataSetItem().fromJSON(item))
            }
        })
        it('should throw an error for does not pass unit', () => {
            measurement.unit = undefined
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HeartRate validation: unit required!')
            } finally {
                measurement.unit = DefaultEntityMock.HEART_RATE.unit
            }
        })
        it('should throw an error for does not pass type', () => {
            measurement.type = undefined
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HeartRate validation: type required!')
            }
        })
        it('should throw an error for does pass invalid type', () => {
            measurement.type = 'invalid'
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalid'))
                assert.propertyVal(err, 'description',
                    Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC.concat(Object.values(MeasurementTypes).join(', ').concat('.')))
            } finally {
                measurement.type = DefaultEntityMock.HEART_RATE.type
            }
        })
        it('should throw an error for does not pass user_id', () => {
            measurement.user_id = undefined
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HeartRate validation: user_id required!')
            }
        })
        it('should throw an error for does pass invalid user_id', () => {
            measurement.user_id = '123'
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            } finally {
                measurement.user_id = DefaultEntityMock.HEART_RATE.user_id
            }
        })
        it('should throw an error for does not pass device_id', () => {
            measurement.device_id = undefined
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'HeartRate validation: device_id required!')
            }
        })
        it('should throw an error for does pass invalid device_id', () => {
            measurement.device_id = '123'
            try {
                CreateHeartRateValidator.validate(measurement)
            } catch (err) {
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })
})
