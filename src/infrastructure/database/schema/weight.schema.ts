import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const weightSchema = new Mongoose.Schema({
        value: {
            type: Number,
            required: 'Value of weight measurement is required!'
        },
        unit: {
            type: String,
            required: 'Unit of weight measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of weight measurement is required!'
        },
        timestamp: {
            type: Date,
            required: 'Timestamp of weight measurement is required!'
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: 'Id of user associated with a weight measurement is required!'
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

export const WeightRepoModel = Mongoose.model<IMeasurement>('Weight', weightSchema, 'measurements')
