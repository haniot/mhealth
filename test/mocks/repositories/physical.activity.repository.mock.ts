import { PhysicalActivity } from '../../../src/application/domain/model/physical.activity'
import { IPhysicalActivityRepository } from '../../../src/application/port/physical.activity.repository.interface'
import { PhysicalActivityMock } from '../models/physical.activity.mock'

export class PhysicalActivityRepositoryMock implements IPhysicalActivityRepository {
    public checkExist(activity: PhysicalActivity): Promise<boolean> {
        if (activity.id === '507f1f77bcf86cd799439011')
            return Promise.resolve(true)
        return Promise.resolve(false)
    }

    public count(query: any): Promise<number> {
        return Promise.resolve(1)
    }

    public countByPatient(patientId: string): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: PhysicalActivity): Promise<PhysicalActivity> {
        if (item.id === '507f1f77bcf86cd799439013')
            return Promise.resolve(undefined!)
        return Promise.resolve(item)
    }

    public delete(id: string | number): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: any): Promise<Array<PhysicalActivity>> {
        const patient_id: string = query.filters.patient_id
        const activitiesArr: Array<PhysicalActivity> = new Array<PhysicalActivityMock>()
        // Only for the test case that returns a filled array
        if (!(patient_id === '507f1f77bcf86cd799439011')) {
            for (let i = 0; i < 3; i++) {
                activitiesArr.push(new PhysicalActivityMock())
            }
        }
        return Promise.resolve(activitiesArr)
    }

    public findOne(query: any): Promise<PhysicalActivity> {
        const id: string = query.filters._id
        if (id === '507f1f77bcf86cd799439011') {
            return Promise.resolve(new PhysicalActivityMock())
        }
        return Promise.resolve(undefined!)
    }

    public removeByPatient(activityId: string, patientId: string): Promise<boolean> {
        if (activityId === '507f1f77bcf86cd799439011')
            return Promise.resolve(true)
        return Promise.resolve(false)
    }

    public update(item: PhysicalActivity): Promise<PhysicalActivity> {
        return Promise.resolve(item)
    }

    public removeAllByPatient(patientId: string): Promise<boolean> {
        return Promise.resolve(true)
    }
}
