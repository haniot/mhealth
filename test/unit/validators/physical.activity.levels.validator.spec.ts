import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { ActivityLevel } from '../../../src/application/domain/model/activityLevel'
import { Levels } from '../../../src/application/domain/utils/levels'
import { PhysicalActivityLevelsValidator } from '../../../src/application/domain/validator/physical.activity.levels.validator'

let levels: Array<ActivityLevel> =
    [new ActivityLevel(Levels.SEDENTARY, Math.floor((Math.random() * 10) * 60000)),
        new ActivityLevel(Levels.LIGHTLY, Math.floor((Math.random() * 10) * 60000)),
        new ActivityLevel(Levels.FAIRLY, Math.floor((Math.random() * 10) * 60000)),
        new ActivityLevel(Levels.VERY, Math.floor((Math.random() * 10) * 60000))]

describe('Validators: PhysicalActivityLevelsValidator', () => {
    describe('validate(levels: Array<ActivityLevel>)', () => {
        context('when the physical activity levels in array has all the required parameters, and that they have valid values',
            () => {
                it('should return undefined representing the success of the validation', () => {
                    const result = PhysicalActivityLevelsValidator.validate(levels)
                    assert.equal(result, undefined)
                })
            })

        context('when the physical activity levels array is empty', () => {
            it('should throw a ValidationException', () => {
                levels = new Array<ActivityLevel>()
                try {
                    PhysicalActivityLevelsValidator.validate(levels)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'The levels array must have values for the following levels: ' +
                        'sedentary, lightly, fairly, very.')
                }
                levels = [new ActivityLevel(Levels.SEDENTARY, Math.floor((Math.random() * 10) * 60000)),
                    new ActivityLevel(Levels.LIGHTLY, Math.floor((Math.random() * 10) * 60000)),
                    new ActivityLevel(Levels.FAIRLY, Math.floor((Math.random() * 10) * 60000)),
                    new ActivityLevel(Levels.VERY, Math.floor((Math.random() * 10) * 60000))]
            })
        })

        context('when the physical activity levels array has an invalid level (invalid name)', () => {
            it('should throw a ValidationException', () => {
                const levelsJSON = {
                    name: 'lightlys',
                    duration: Math.floor((Math.random() * 10) * 60000)
                }

                let levelTest: ActivityLevel = new ActivityLevel()
                levelTest = levelTest.fromJSON(levelsJSON)
                levels[1] = levelTest

                try {
                    PhysicalActivityLevelsValidator.validate(levels)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'The names of the allowed levels are: sedentary, lightly, fairly, very.')
                }
                levels[1] = new ActivityLevel(Levels.LIGHTLY, Math.floor((Math.random() * 10) * 60000))
            })
        })

        context('when the physical activity levels array has an invalid level (missing one of the fields, the name)', () => {
            it('should throw a ValidationException', () => {
                const levelsJSON = {
                    name: undefined,
                    duration: Math.floor((Math.random() * 10) * 60000)
                }

                let levelTest: ActivityLevel = new ActivityLevel()
                levelTest = levelTest.fromJSON(levelsJSON)
                levels[1] = levelTest

                try {
                    PhysicalActivityLevelsValidator.validate(levels)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'The levels array must have values for the following levels: ' +
                        'sedentary, lightly, fairly, very.')
                }
                levels[1] = new ActivityLevel(Levels.LIGHTLY, Math.floor((Math.random() * 10) * 60000))
            })
        })

        context('when the physical activity levels array has an invalid level (missing one of the fields, the duration)', () => {
            it('should throw a ValidationException', () => {
                levels[1].duration = undefined!
                try {
                    PhysicalActivityLevelsValidator.validate(levels)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.REQUIRED_FIELDS)
                    assert.equal(err.description, 'levels.duration'.concat(Strings.ERROR_MESSAGE.REQUIRED_FIELDS_DESC))
                }
                levels[1].duration = Math.floor((Math.random() * 10) * 60000)
            })
        })

        context('when the physical activity levels array has an invalid level (missing all fields)', () => {
            it('should throw a ValidationException', () => {
                const levelsJSON = {
                    name: undefined,
                    duration: undefined
                }

                let levelTest: ActivityLevel = new ActivityLevel()
                levelTest = levelTest.fromJSON(levelsJSON)
                levels[1] = levelTest

                try {
                    PhysicalActivityLevelsValidator.validate(levels)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'The levels array must have values for the following levels: ' +
                        'sedentary, lightly, fairly, very.')
                }
                levels[1] = new ActivityLevel(Levels.LIGHTLY, Math.floor((Math.random() * 10) * 60000))
            })
        })

        context('when the physical activity levels array has an invalid level (the duration is negative)', () => {
            it('should throw a ValidationException', () => {
                levels[1].duration = -(Math.floor((Math.random() * 10 + 1) * 60000))
                try {
                    PhysicalActivityLevelsValidator.validate(levels)
                } catch (err) {
                    assert.equal(err.message, Strings.ERROR_MESSAGE.INVALID_FIELDS)
                    assert.equal(err.description, 'levels.duration'.concat(Strings.ERROR_MESSAGE.NEGATIVE_NUMBER))
                }
                levels[1].duration = Math.floor((Math.random() * 10 + 1) * 60000)
            })
        })
    })
})
