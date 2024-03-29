import { assert } from 'chai'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { DateRangeValidator } from '../../../src/application/domain/validator/date.range.validator'

describe('VALIDATORS: DateRangeValidator', () => {
    context('when the date range is invalid.', () => {
        it('should throw ValidationException between dates 2020-12-16 and 2020-12-10.', () => {
            try {
                DateRangeValidator.validate('2020-12-16', '2020-12-10')
                assert.fail()
            } catch (e: any) {
                assert.instanceOf(e, ValidationException)
            }
        })

        it('should throw ValidationException with message and description when the difference' +
            ' between start and end date exceeds 365 days.', () => {
            try {
                DateRangeValidator.validate('2019-01-01', '2020-01-02')
                assert.fail()
            } catch (e: any) {
                assert.instanceOf(e, ValidationException)
                assert.equal(e.message, Strings.ERROR_MESSAGE.DATE.RANGE_INVALID
                    .replace('{0}', '2019-01-01')
                    .replace('{1}', '2020-01-02'))
                assert.equal(e.description, Strings.ERROR_MESSAGE.DATE.RANGE_EXCEED_YEAR_DESC)
            }
        })

        it('should throw ValidationException with message and description when the difference' +
            ' between start and end date exceeds 366 days.', () => {
            try {
                DateRangeValidator.validate('2019-11-16', '2020-12-16')
                assert.fail()
            } catch (e: any) {
                assert.instanceOf(e, ValidationException)
                assert.equal(e.message, Strings.ERROR_MESSAGE.DATE.RANGE_INVALID
                    .replace('{0}', '2019-11-16')
                    .replace('{1}', '2020-12-16'))
                assert.equal(e.description, Strings.ERROR_MESSAGE.DATE.RANGE_EXCEED_YEAR_DESC)
            }
        })
    })

    context('when the date range is valid.', () => {
        it('should not throw ValidationException with between dates 2019-12-16 and 2019-12-25.', () => {
            try {
                DateRangeValidator.validate('2019-12-16', '2019-12-25')
            } catch (err: any) {
                assert.fail(err)
            }
        })

        it('should not throw ValidationException with between dates 2018-12-25 and 2019-12-25.', () => {
            try {
                DateRangeValidator.validate('2018-12-25', '2019-12-25')
            } catch (err: any) {
                assert.fail(err)
            }
        })
    })
})
