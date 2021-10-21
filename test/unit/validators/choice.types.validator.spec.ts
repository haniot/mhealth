import { assert } from 'chai'
import { ChoiceTypesValidator } from '../../../src/application/domain/validator/choice.types.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'

describe('VALIDATORS: ChoiceTypesValidator', () => {
    context('when the choice type is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = ChoiceTypesValidator.validate(ChoiceTypes.YES)
                assert.isUndefined(result)
            } catch (err: any) {
                assert.fail(err)
            }
        })
    })

    context('when the choice type is invalid', () => {
        const choiceTypes: Array<string> = Object.values(ChoiceTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                ChoiceTypesValidator.validate('invalidChoiceTypes')
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('choice: invalidChoiceTypes'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(`${choiceTypes.join(', ')}.`))
            }
        })

        it('should throw a ValidationException for an undefined type', () => {
            try {
                ChoiceTypesValidator.validate(undefined!)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('choice: undefined'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(`${choiceTypes.join(', ')}.`))
            }
        })

        it('should throw a ValidationException for a null type', () => {
            try {
                ChoiceTypesValidator.validate(null!)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('choice: null'))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(`${choiceTypes.join(', ')}.`))
            }
        })

        it('should throw a ValidationException for an empty type', () => {
            try {
                ChoiceTypesValidator.validate('')
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ENUM_VALIDATOR.NOT_MAPPED.concat('choice: '))
                assert.propertyVal(err, 'description', Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .concat(`${choiceTypes.join(', ')}.`))
            }
        })
    })
})
