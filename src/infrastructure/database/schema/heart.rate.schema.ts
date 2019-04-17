import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const heartRateSchema = new Mongoose.Schema({
        dataset: [{
            value: {
                type: String,
                required: 'Value of heart rate measurement is required!'
            },
            timestamp: {
                type: Date,
                required: 'Timestamp of heart rate measurement is required!'
            }
        }],
        unit: {
            type: String,
            required: 'Unit of heart rate measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of heart rate measurement is required!'
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: 'Id of user associated with a heart rate measurement is required!'
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
    }
)

export const HeartRateRepoModel = Mongoose.model<IMeasurement>('HeartRate', heartRateSchema, 'measurements')
