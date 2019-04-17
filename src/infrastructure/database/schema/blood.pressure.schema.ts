import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const bloodPressureSchema = new Mongoose.Schema({
        systolic: {
            type: Number,
            required: 'Value of systolic blood pressure measurement is required!'
        },
        diastolic: {
            type: Number,
            required: 'Value of diastolic blood pressure measurement is required!'
        },
        unit: {
            type: String,
            required: 'Unit of height measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of height measurement is required!'
        },
        timestamp: {
            type: Date,
            required: 'Timestamp of height measurement is required!'
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: 'Id of user associated with a height measurement is required!'
        },
        device_id: {
            type: Schema.Types.ObjectId,
            ref: 'Device'
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
    })

export const BloodPressureRepoModel =
    Mongoose.model<IMeasurement>('BloodPressure', bloodPressureSchema, 'measurements')
