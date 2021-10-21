import { assert } from 'chai'
import { User } from '../../../src/application/domain/model/user'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { UserValidator } from '../../../src/application/domain/validator/user.validator'

describe('Validators: UserValidator', () => {
    const user: User = new User().fromJSON({
        id: '5c86d00c7a8618923481b48b',
        type: UserType.PATIENT
    })

    it('should return undefined when the validation was successful', () => {
        const result = UserValidator.validate(user)
        assert.isUndefined(result)
    })

    context('when there are validation errors', () => {
        it('should throw an error for does not pass id', () => {
            user.id = undefined
            try {
                UserValidator.validate(user)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'User validation: id required!')
            } finally {
                user.id = '5c86d00c7a8618923481b48b'
            }
        })
        it('should throw an error for does not pass type', () => {
            user.type = undefined
            try {
                UserValidator.validate(user)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'User validation: type required!')
            } finally {
                user.type = UserType.PATIENT
            }
        })
        it('should throw an error for does not pass id and type', () => {
            try {
                UserValidator.validate({} as User)
            } catch (err: any) {
                assert.propertyVal(err, 'message', 'Required fields were not provided...')
                assert.propertyVal(err, 'description', 'User validation: id, type required!')
            }
        })
    })
})
