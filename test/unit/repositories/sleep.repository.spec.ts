import sinon from 'sinon'
import { assert } from 'chai'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { ObjectID } from 'bson'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { SleepRepoModel } from '../../../src/infrastructure/database/schema/sleep.schema'
import { ISleepRepository } from '../../../src/application/port/sleep.repository.interface'
import { SleepRepository } from '../../../src/infrastructure/repository/sleep.repository'
import { SleepMock } from '../../mocks/models/sleep.mock'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { Query } from '../../../src/infrastructure/repository/query/query'

require('sinon-mongoose')

describe('Repositories: SleepRepository', () => {
    const defaultSleep: Sleep = new SleepMock()

    const modelFake: any = SleepRepoModel
    const sleepRepo: ISleepRepository = new SleepRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())

    const queryMock: any = {
        toJSON: () => {
            return {
                fields: {},
                ordination: {},
                pagination: { page: 1, limit: 100, skip: 0 },
                filters: {
                    start_time: defaultSleep.start_time,
                    patient_id: defaultSleep.patient_id
                }
            }
        }
    }

    afterEach(() => {
        sinon.restore()
    })

    describe('checkExist(sleep: Sleep)', () => {
        context('when the sleep is found', () => {
            it('should return true if exists in search by the filters bellow', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs(queryMock.toJSON().filters)
                    .chain('exec')
                    .resolves(true)

                return sleepRepo.checkExist(defaultSleep)
                    .then(result => {
                        assert.isTrue(result)
                    })
            })
        })

        context('when the sleep is not found in search without filters', () => {
            it('should return false', () => {
                const otherSleep: Sleep = new SleepMock()
                otherSleep.start_time = undefined
                otherSleep.patient_id = ''
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs()
                    .chain('exec')
                    .resolves(false)

                return sleepRepo.checkExist(otherSleep)
                    .then(result => {
                        assert.isFalse(result)
                    })
            })
        })

        context('when the sleep is not found', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOne')
                    .withArgs(queryMock.toJSON().filters)
                    .chain('exec')
                    .resolves(false)

                return sleepRepo.checkExist(defaultSleep)
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
                    .rejects({
                        message: 'An internal error has occurred in the database!',
                        description: 'Please try again later...'
                    })

                return sleepRepo.checkExist(defaultSleep)
                    .catch((err: any) => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })

    describe('removeByPatient(sleepId: string, patientId: string)', () => {
        context('when the sleep is found and the delete operation is done successfully', () => {
            it('should return true for confirm delete', () => {
                defaultSleep.patient_id = '5a62be07de34500146d9c544'

                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ patient_id: defaultSleep.patient_id, _id: defaultSleep.id })
                    .chain('exec')
                    .resolves(true)

                return sleepRepo.removeByPatient(defaultSleep.id!, defaultSleep.patient_id)
                    .then((result: boolean) => {
                        assert.isTrue(result)
                    })
            })
        })

        context('when the sleep is not found', () => {
            it('should return false for confirm that the sleep was not found', () => {
                const randomPatientId: any = new ObjectID()
                const randomId: any = new ObjectID()

                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ patient_id: randomPatientId, _id: randomId })
                    .chain('exec')
                    .resolves(false)

                return sleepRepo.removeByPatient(randomId, randomPatientId)
                    .then((result: boolean) => {
                        assert.isFalse(result)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should throw a RepositoryException', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ patient_id: defaultSleep.patient_id, _id: defaultSleep.id })
                    .chain('exec')
                    .rejects({
                        message: 'An internal error has occurred in the database!',
                        description: 'Please try again later...'
                    })

                return sleepRepo.removeByPatient(defaultSleep.id!, defaultSleep.patient_id)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })

    describe('removeAllSleepFromPatient(patientId: string)', () => {
        context('when there is at least one sleep associated with that patientId and the delete operation is done successfully',
            () => {
                it('should return true for confirm delete', () => {
                    defaultSleep.patient_id = '5a62be07de34500146d9c544'

                    sinon
                        .mock(modelFake)
                        .expects('deleteMany')
                        .withArgs({ patient_id: defaultSleep.patient_id })
                        .resolves(true)

                    return sleepRepo.removeAllByPatient(defaultSleep.patient_id)
                        .then((result: boolean) => {
                            assert.isTrue(result)
                        })
                })
            })

        context('when there is no sleep associated with that patientId', () => {
            it('should return false', () => {
                const randomPatientId: any = new ObjectID()

                sinon
                    .mock(modelFake)
                    .expects('deleteMany')
                    .withArgs({ patient_id: randomPatientId })
                    .resolves(false)

                return sleepRepo.removeAllByPatient(randomPatientId)
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
                    .withArgs({ patient_id: defaultSleep.patient_id })
                    .rejects({
                        message: 'An internal error has occurred in the database!',
                        description: 'Please try again later...'
                    })

                return sleepRepo.removeAllByPatient(defaultSleep.patient_id)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })

    describe('count(query: IQuery)', () => {
        context('when there is at least one sleep object associated with the patient received', () => {
            it('should return how many sleep objects are associated with such patient in the database', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ patient_id: defaultSleep.patient_id })
                    .chain('exec')
                    .resolves(2)

                return sleepRepo.count(new Query().fromJSON({ filters: { patient_id: defaultSleep.patient_id } }))
                    .then((countSleep: number) => {
                        assert.equal(countSleep, 2)
                    })
            })
        })

        context('when there are no sleep objects associated with the patient received', () => {
            it('should return 0', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ patient_id: defaultSleep.patient_id })
                    .chain('exec')
                    .resolves(0)

                return sleepRepo.count(new Query().fromJSON({ filters: { patient_id: defaultSleep.patient_id } }))
                    .then((countSleep: number) => {
                        assert.equal(countSleep, 0)
                    })
            })
        })

        context('when a database error occurs', () => {
            it('should throw a RepositoryException', () => {
                sinon
                    .mock(modelFake)
                    .expects('countDocuments')
                    .withArgs({ patient_id: defaultSleep.patient_id })
                    .chain('exec')
                    .rejects({
                        message: 'An internal error has occurred in the database!',
                        description: 'Please try again later...'
                    })

                return sleepRepo.count(new Query().fromJSON({ filters: { patient_id: defaultSleep.patient_id } }))
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                        assert.propertyVal(err, 'description', 'Please try again later...')
                    })
            })
        })
    })
})
