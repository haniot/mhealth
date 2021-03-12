import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const measurementSchema = new Mongoose.Schema({
        value: { type: Number },
        unit: {
            type: String,
            required: 'Unit of measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of measurement is required!'
        },
        timestamp: {
            type: Date,
            index: true
        },
        device_id: {
            type: Schema.Types.ObjectId,
            ref: 'Device'
        },
        patient_id: {
            type: String,
            required: 'Id of patient associated with a measurement is required!',
            index: true
        },
        meal: { type: String }, // Blood Glucose
        systolic: { type: Number }, // Blood Pressure
        diastolic: { type: Number },
        pulse: { type: Number }, // Weight
        body_fat: { type: Number },
        hand: { type: String },  // HandGrip
        leg: { type: String }  // CalfCircumference
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: false },
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
                return ret
            }
        }
    }
)

export const MeasurementRepoModel = Mongoose.model<IMeasurement>('Measurement', measurementSchema)
