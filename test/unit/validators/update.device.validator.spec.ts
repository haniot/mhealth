import { Device } from '../../../src/application/domain/model/device'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { UpdateDeviceValidator } from '../../../src/application/domain/validator/update.device.validator'

describe('Validators: UpdateDeviceValidator', () => {
    const device: Device = new Device().fromJSON(DefaultEntityMock.DEVICE)
    device.user_id = undefined

    it('should return undefined when the validation was successful', () => {
        const result = UpdateDeviceValidator.validate(device)
        assert.equal(result, undefined)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does pass invalid id', () => {
            device.id = '123'
            try {
                UpdateDeviceValidator.validate(device)
            } catch (err) {
                assert.propertyVal(err, 'message', 'Some ID provided does not have a valid format!')
                assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                device.id = DefaultEntityMock.DEVICE.id
            }
        })

        it('should throw an error for does pass user_id', () => {
            device.user_id = DefaultEntityMock.DEVICE.user_id
            try {
                UpdateDeviceValidator.validate(device)
            } catch (err) {
                assert.equal(err.message, Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED)
                assert.equal(err.description, Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED_DESC.concat('user_id'))
            }
        })
    })

})
