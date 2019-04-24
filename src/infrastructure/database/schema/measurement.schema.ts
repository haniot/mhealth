import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const measurementSchema = new Mongoose.Schema({
        value: {
            type: Number
        },
        unit: {
            type: String,
            required: 'Unit of measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of measurement is required!'
        },
        timestamp: {
            type: Date
        },
        device_id: {
            type: Schema.Types.ObjectId,
            ref: 'Device'
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: 'Id of user associated with a measurement is required!'
        },
        meal: { // Blood Glucose
            type: String
        },
        dataset: [{ // Heart Rate
            value: {
                type: Number
            },
            timestamp: {
                type: Date
            }
        }],
        systolic: { // Blood Pressure
            type: Number
        },
        diastolic: {
            type: Number
        },
        pulse: {
            type: Number
        }, // Weight
        fat: {
            type: Schema.Types.ObjectId,
            ref: 'Measurement'
        }
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
