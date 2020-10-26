import { ActivityEntity } from './activity.entity'

export class SleepEntity extends ActivityEntity {
    public pattern?: Array<any> // Sleep pattern tracking.
    public night_awakening?: Array<any> // Sleep night awakenings set.
    public type?: string // Sleep Pattern type
}
