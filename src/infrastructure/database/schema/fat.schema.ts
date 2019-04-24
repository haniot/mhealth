import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const fatSchema = new Mongoose.Schema({
        value: {
            type: Number,
            required: 'Value of fat measurement is required!'
        },
        unit: {
            type: String,
            required: 'Unit of fat measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of fat measurement is required!'
        },
        timestamp: {
            type: Date,
            required: 'Timestamp of fat measurement is required!'
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: 'Id of user associated with a fat measurement is required!'
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

export const FatRepoModel = Mongoose.model<IMeasurement>('Fat', fatSchema, 'measurements')
