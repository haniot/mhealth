import { assert } from 'chai'
import { ContextTypeValidator } from '../../../src/application/domain/validator/context.type.validator'
import { ContextTypes } from '../../../src/application/domain/utils/context.types'
import { Strings } from '../../../src/utils/strings'

describe('Validators: ContextTypeValidator', () => {
    it('should return undefined when the validation was successful', () => {
        const result = ContextTypeValidator.validate(ContextTypes.GLUCOSE_CARBOHYDRATE)
        assert.equal(result, undefined)
    })

    context('when there are missing or invalid parameters', () => {
        it('should throw error for does pass invalid context type', () => {
            try {
                ContextTypeValidator.validate('invalid')
            } catch (err) {
                assert.equal(err.message, Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('context.type: invalid'))
                assert.equal(err.description, Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(Object.values(ContextTypes).join(', ').concat('.')))
            }
        })
    })
})
