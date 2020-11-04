import { ActivityEntity } from './activity.entity'

export class SleepEntity extends ActivityEntity {
    public pattern?: Array<any> // Sleep pattern tracking.
    public awakenings?: Array<any> // Sleep awakenings set.
    public type?: string // Sleep Pattern type
}
