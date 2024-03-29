import { Device } from '../../../src/application/domain/model/device'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { CreateDeviceValidator } from '../../../src/application/domain/validator/create.device.validator'
import { Strings } from '../../../src/utils/strings'
import { DeviceTypes } from '../../../src/application/domain/utils/device.types'

describe('Validators: CreateDeviceValidator', () => {
    const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)
    device.patient_id = DefaultEntityMock.DEVICE.patient_id

    it('should return undefined when the validation was successful', () => {
        const result = CreateDeviceValidator.validate(device)
        assert.isUndefined(result)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass name', () => {
            device.name = undefined
            try {
               CreateDeviceValidator.validate(device)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Device validation: name required!')
                device.name = DefaultEntityMock.DEVICE.name
            }
        })

        it('should throw an error for does not pass address', () => {
            device.address = undefined
            try {
                CreateDeviceValidator.validate(device)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Device validation: address required!')
                device.address = DefaultEntityMock.DEVICE.address
            }
        })

        it('should throw an error for does not pass type', () => {
            device.type = undefined
            try {
                CreateDeviceValidator.validate(device)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Device validation: type required!')
            }
        })

        it('should throw an error for does pass invalid type', () => {
            device.type = 'invalid'
            try {
                CreateDeviceValidator.validate(device)
            } catch (err: any) {
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('type: invalid'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(DeviceTypes).join(', ').concat('.')))
                device.type = DefaultEntityMock.DEVICE.type
            }
        })

        it('should throw an error for does not pass manufacturer', () => {
            device.manufacturer = undefined
            try {
                CreateDeviceValidator.validate(device)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Device validation: manufacturer required!')
                device.manufacturer = DefaultEntityMock.DEVICE.manufacturer
            }
        })

        it('should throw an error for does not pass patient_id', () => {
            device.patient_id = undefined
            try {
                CreateDeviceValidator.validate(device)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'Device validation: patient_id required!')
            }
        })

        it('should throw an error for does pass invalid patient_id', () => {
            device.patient_id = '123'
            try {
                CreateDeviceValidator.validate(device)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                assert.propertyVal(err, 'description',
                    'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
            }
        })
    })

})
