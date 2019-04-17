import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const bodyTemperatureSchema = new Mongoose.Schema({
        value: {
            type: Number,
            required: 'Value of body temperature measurement is required!'
        },
        unit: {
            type: String,
            required: 'Unit of body temperature measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of body temperature measurement is required!'
        },
        timestamp: {
            type: Date,
            required: 'Timestamp of body temperature measurement is required!'
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: 'Id of user associated with a body temperature measurement is required!'
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

export const BodyTemperatureRepoModel =
    Mongoose.model<IMeasurement>('BodyTemperature', bodyTemperatureSchema, 'measurements')
