export class ActivityEntity {
    public id?: string
    public start_time?: string // PhysicalActivity start time according to the UTC.
    public end_time?: string // PhysicalActivity end time according to the UTC.
    public duration?: number // Total time in milliseconds spent in the activity.
    public patient_id?: string // Patient ID belonging to activity.
}
