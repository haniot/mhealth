import { ActivityEntity } from './activity.entity'

export class SleepEntity extends ActivityEntity {
    public pattern?: Array<any> // Sleep pattern tracking.
    public type?: string // Sleep Pattern type
}
