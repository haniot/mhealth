import { ISleepRepository } from '../../../src/application/port/sleep.repository.interface'
import { Sleep } from '../../../src/application/domain/model/sleep'
import { SleepMock } from '../models/sleep.mock'

export class SleepRepositoryMock implements ISleepRepository {
    public checkExist(sleep: Sleep): Promise<boolean> {
        if (sleep.id === '507f1f77bcf86cd799439011')
            return Promise.resolve(true)
        return Promise.resolve(false)
    }

    public count(query: any): Promise<number> {
        return Promise.resolve(1)
    }

    public countByPatient(patientId: string): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: Sleep): Promise<Sleep> {
        if (item.id === '507f1f77bcf86cd799439013')
            return Promise.resolve(undefined!)
        return Promise.resolve(item)
    }

    public delete(id: string | number): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: any): Promise<Array<Sleep>> {
        const patient_id: string = query.filters.patient_id
        const sleepArr: Array<Sleep> = new Array<SleepMock>()
        // Only for the test case that returns a filled array
        if (!(patient_id === '507f1f77bcf86cd799439011')) {
            for (let i = 0; i < 3; i++) {
                sleepArr.push(new SleepMock())
            }
        }
        return Promise.resolve(sleepArr)
    }

    public findOne(query: any): Promise<Sleep> {
        const id: string = query.filters._id
        if (id === '507f1f77bcf86cd799439011') {
            return Promise.resolve(new SleepMock())
        }
        return Promise.resolve(undefined!)
    }

    public removeByPatient(sleepId: string, patientId: string): Promise<boolean> {
        if (sleepId === '507f1f77bcf86cd799439011')
            return Promise.resolve(true)
        return Promise.resolve(false)
    }

    public update(item: Sleep): Promise<Sleep> {
        return Promise.resolve(item)
    }

    public removeAllByPatient(patientId: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public updateOrCreate(item: any): Promise<any> {
        return Promise.resolve(item)
    }
}
