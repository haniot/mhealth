import sinon from 'sinon'
import { assert } from 'chai'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { PhysicalActivity } from '../../../src/application/domain/model/physical.activity'
import { ActivityRepoModel } from '../../../src/infrastructure/database/schema/activity.schema'
import { IPhysicalActivityRepository } from '../../../src/application/port/physical.activity.repository.interface'
import { PhysicalActivityRepository } from '../../../src/infrastructure/repository/physical.activity.repository'
import { ObjectID } from 'bson'
import { PhysicalActivityMock } from '../../mocks/models/physical.activity.mock'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'

require('sinon-mongoose')

describe('Repositories: PhysicalActivityRepository', () => {
    const defaultActivity: PhysicalActivity = new PhysicalActivityMock()

    const modelFake: any = ActivityRepoModel
    const activityRepo: IPhysicalActivityRepository =
        new PhysicalActivityRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())

    const queryMock: any = {
        toJSON: () => {
            return {
                fields: {},
                ordination: {},
                pagination: { page: 1, limit: 100, skip: 0 },
                filters: {  start_time: defaultActivity.start_time,
                            patient_id: defaultActivity.patient_id }
            }
        }
    }

    afterEach(() => {
        sinon.restore()
    })

    describe('checkExist(activity: PhysicalActivity)', () => {
        context('when the physical activity is found', () => {
            it('should return true if exists in search by the filters bellow', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs(queryMock.toJSON().filters)
                    .chain('exec')
                    .resolves(true)

                return activityRepo.checkExist(defaultActivity)
                    .then(result => {
                        assert.isTrue(result)
                    })
            })
        })

        context('when the physical activity is not found in search without filters', () => {
            it('should return false', () => {
                const otherActivity: PhysicalActivity = new PhysicalActivityMock()
                otherActivity.start_time = undefined
                otherActivity.patient_id = ''
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs()
                    .chain('exec')
                    .resolves(false)

                return activityRepo.checkExist(otherActivity)
                    .then(result => {
                        assert.isFalse(result)
                    })
            })
        })

        context('when the physical activity is not found', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs(queryMock.toJSON().filters)
                    .chain('exec')
                    .resolves(false)

                return activityRepo.checkExist(defaultActivity)
                    .then(result => {
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should throw a RepositoryException', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs(queryMock.toJSON().filters)
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!',
                               description: 'Please try again later...' })

                return activityRepo.checkExist(defaultActivity)
                    .catch((err: any) => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })

    describe('removeByPatient(activityId: string | number, patientId: string)', () => {
        context('when the physical activity is found and the delete operation is done successfully', () => {
            it('should return true for confirm delete', () => {
                defaultActivity.patient_id = '5a62be07de34500146d9c544'

                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ patient_id: defaultActivity.patient_id, _id: defaultActivity.id })
                    .chain('exec')
                    .resolves(true)

                return activityRepo.removeByPatient(defaultActivity.id!, defaultActivity.patient_id)
                    .then((result: boolean) => {
                        assert.isTrue(result)
                    })
            })
        })

        context('when the physical activity is not found', () => {
            it('should return false for confirm that the physical activity was not found', () => {
                const randomPatientId: any = new ObjectID()
                const randomId: any = new ObjectID()

                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ patient_id: randomPatientId, _id: randomId })
                    .chain('exec')
                    .resolves(false)

                return activityRepo.removeByPatient(randomId, randomPatientId)
                    .then((result: boolean) => {
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should throw a RepositoryException', () => {
                defaultActivity.id = '1a2b3c'

                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ patient_id: defaultActivity.patient_id, _id: defaultActivity.id })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!',
                               description: 'Please try again later...' })

                return activityRepo.removeByPatient(defaultActivity.id, defaultActivity.patient_id)
                    .catch (err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })

    describe('removeAllActivitiesFromPatient(patientId: string)', () => {
        context('when there is at least one physical activity associated with that patientID and the delete operation is ' +
            'done successfully', () => {
            it('should return true for confirm delete', () => {
                sinon
                    .mock(modelFake)
                    .expects('deleteMany')
                    .withArgs({ patient_id: defaultActivity.patient_id })
                    .resolves(true)

                return activityRepo.removeAllByPatient(defaultActivity.patient_id)
                    .then((result: boolean) => {
                        assert.isTrue(result)
                    })
            })
        })

        context('when there is no physical activity associated with that patientId', () => {
            it('should return false', () => {
                const randomPatientId: any = new ObjectID()

                sinon
                    .mock(modelFake)
                    .expects('deleteMany')
                    .withArgs({ patient_id: randomPatientId })
                    .resolves(false)

                return activityRepo.removeAllByPatient(randomPatientId)
                    .then((result: boolean) => {
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should throw a RepositoryException', () => {
                sinon
                    .mock(modelFake)
                    .expects('deleteMany')
                    .withArgs({ patient_id: defaultActivity.patient_id })
                    .rejects({ message: 'An internal error has occurred in the database!',
                               description: 'Please try again later...' })

                return activityRepo.removeAllByPatient(defaultActivity.patient_id)
                    .catch (err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })

    describe('countActivities(patientId: string)', () => {
        context('when there is at least one physical activity associated with the patient received', () => {
            it('should return how many physical activities are associated with such patient in the database', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ patient_id: defaultActivity.patient_id })
                    .chain('exec')
                    .resolves(2)

                return activityRepo.countByPatient(defaultActivity.patient_id)
                    .then((countActivities: number) => {
                        assert.equal(countActivities, 2)
                    })
            })
        })

        context('when there are no physical activities associated with the patient received', () => {
            it('should return 0', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ patient_id: defaultActivity.patient_id })
                    .chain('exec')
                    .resolves(0)

                return activityRepo.countByPatient(defaultActivity.patient_id)
                    .then((countActivities: number) => {
                        assert.equal(countActivities, 0)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should throw a RepositoryException', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ patient_id: defaultActivity.patient_id })
                    .chain('exec')
                    .rejects({ message: 'An internal error has occurred in the database!',
                               description: 'Please try again later...' })

                return activityRepo.countByPatient(defaultActivity.patient_id)
                    .catch (err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })
})
