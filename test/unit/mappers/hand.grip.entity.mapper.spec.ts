import { assert } from 'chai'
import { HandGripEntityMapper } from '../../../src/infrastructure/entity/mapper/hand.grip.entity.mapper'
import { HandGrip } from '../../../src/application/domain/model/hand.grip'
import { HandGripEntity } from '../../../src/infrastructure/entity/hand.grip.entity'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { HandGripMock } from '../../mocks/models/hand.grip.mock'
import { MeasurementTypes } from '../../../src/application/domain/utils/measurement.types'

describe('MAPPERS: HandGripEntityMapper', () => {
    const handGripEntityMapper: HandGripEntityMapper = new HandGripEntityMapper()

    // Create HandGrip model.
    const handGrip: HandGrip = new HandGripMock().generate()

    // Create HandGrip JSON.
    const handGripJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.HAND_GRIP))

    describe('transform(item: any)', () => {
        context('when the parameter is of type HandGrip', () => {
            it('should return a HandGripEntity from a complete HandGrip', () => {
                const result: HandGripEntity = handGripEntityMapper.transform(handGrip)

                assert.propertyVal(result, 'id', handGrip.id)
                assert.propertyVal(result, 'value', handGrip.value)
                assert.propertyVal(result, 'unit', handGrip.unit)
                assert.propertyVal(result, 'type', handGrip.type)
                assert.propertyVal(result, 'timestamp', handGrip.timestamp)
                assert.propertyVal(result, 'device_id', handGrip.device_id)
                assert.propertyVal(result, 'patient_id', handGrip.patient_id)
            })

            it('should return an empty HandGripEntity from empty HandGrip', () => {
                const emptyHandGrip: HandGrip = new HandGrip()
                emptyHandGrip.type = undefined
                const result: HandGripEntity = handGripEntityMapper.transform(emptyHandGrip)

                assert.isEmpty(result)
            })
        })

        context('when the parameter is a JSON', () => {
            it('should return a HandGrip from a complete JSON', () => {
                const result: HandGrip = handGripEntityMapper.transform(handGripJSON)

                assert.propertyVal(result, 'id', handGripJSON.id)
                assert.propertyVal(result, 'type', handGripJSON.type)
                assert.propertyVal(result, 'value', handGripJSON.value)
                assert.propertyVal(result, 'unit', handGripJSON.unit)
                assert.propertyVal(result, 'timestamp', handGripJSON.timestamp)
                assert.propertyVal(result, 'device_id', handGripJSON.device_id)
                assert.propertyVal(result, 'patient_id', handGripJSON.patient_id)
            })

            it('should return a HandGrip with some attributes equal to undefined from an empty JSON', () => {
                const result: HandGrip = handGripEntityMapper.transform({})

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.HAND_GRIP)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a HandGrip with some attributes equal to undefined from undefined json', () => {
                const result: HandGrip = handGripEntityMapper.transform(undefined)

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'type', MeasurementTypes.HAND_GRIP)
            })
        })
    })

    describe('modelEntityToModel()', () => {
        context('when try to use modelEntityToModel() function', () => {
            it('should throw an error', () => {
                try {
                    handGripEntityMapper.modelEntityToModel(new HandGripEntity())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
