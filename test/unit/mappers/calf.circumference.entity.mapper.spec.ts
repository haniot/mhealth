import { assert } from 'chai'
import { CalfCircumferenceEntityMapper } from '../../../src/infrastructure/entity/mapper/calf.circumference.entity.mapper'
import { CalfCircumference } from '../../../src/application/domain/model/calf.circumference'
import { CalfCircumferenceEntity } from '../../../src/infrastructure/entity/calf.circumference.entity'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { CalfCircumferenceMock } from '../../mocks/models/calf.circumference.mock'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'

describe('MAPPERS: CalfCircumferenceEntityMapper', () => {
    const calfCircumferenceEntityMapper: CalfCircumferenceEntityMapper = new CalfCircumferenceEntityMapper()

    // Create CalfCircumference model.
    const calfCircumference: CalfCircumference = new CalfCircumferenceMock().generate()

    // Create CalfCircumference JSON.
    const calfCircumferenceJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.CALF_CIRCUMFERENCE))

    describe('transform(item: any)', () => {
        context('when the parameter is of type CalfCircumference', () => {
            it('should return a CalfCircumferenceEntity from a complete CalfCircumference', () => {
                const result: CalfCircumferenceEntity = calfCircumferenceEntityMapper.transform(calfCircumference)

                assert.propertyVal(result, 'id', calfCircumference.id)
                assert.propertyVal(result, 'value', calfCircumference.value)
                assert.propertyVal(result, 'unit', calfCircumference.unit)
                assert.propertyVal(result, 'type', calfCircumference.type)
                assert.propertyVal(result, 'timestamp', calfCircumference.timestamp)
                assert.propertyVal(result, 'device_id', calfCircumference.device_id)
                assert.propertyVal(result, 'patient_id', calfCircumference.patient_id)
                assert.propertyVal(result, 'leg', calfCircumference.leg)
            })

            it('should return an empty CalfCircumferenceEntity from empty CalfCircumference', () => {
                const emptyCalfCircumference: CalfCircumference = new CalfCircumference()
                emptyCalfCircumference.type = undefined
                const result: CalfCircumferenceEntity = calfCircumferenceEntityMapper.transform(emptyCalfCircumference)

                assert.isEmpty(result)
            })
        })

        context('when the parameter is a JSON', () => {
            it('should return a CalfCircumference from a complete JSON', () => {
                const result: CalfCircumference = calfCircumferenceEntityMapper.transform(calfCircumferenceJSON)

                assert.propertyVal(result, 'id', calfCircumferenceJSON.id)
                assert.propertyVal(result, 'type', calfCircumferenceJSON.type)
                assert.propertyVal(result, 'value', calfCircumferenceJSON.value)
                assert.propertyVal(result, 'unit', calfCircumferenceJSON.unit)
                assert.propertyVal(result, 'timestamp', calfCircumferenceJSON.timestamp)
                assert.propertyVal(result, 'device_id', calfCircumferenceJSON.device_id)
                assert.propertyVal(result, 'patient_id', calfCircumferenceJSON.patient_id)
                assert.propertyVal(result, 'leg', calfCircumferenceJSON.leg)
            })

            it('should return a CalfCircumference with some attributes equal to undefined from an empty JSON', () => {
                const result: CalfCircumference = calfCircumferenceEntityMapper.transform({})

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.CALF_CIRCUMFERENCE)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a CalfCircumference with some attributes equal to undefined from undefined json', () => {
                const result: CalfCircumference = calfCircumferenceEntityMapper.transform(undefined)

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.CALF_CIRCUMFERENCE)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    calfCircumferenceEntityMapper.modelEntityToModel(new CalfCircumferenceEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
