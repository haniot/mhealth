import Mongoose, { Schema } from 'mongoose'

interface IDevice extends Mongoose.Document {
}

const deviceSchema = new Mongoose.Schema({
        name: {
            type: String,
            required: 'Name of device is required!'
        },
        address: {
            type: String,
            required: 'Address of device is required!',
            index: { unique: true }
        },
        type: {
            type: String,
            required: 'Type of device is required!'
        },
        model_number: {
            type: Number
        },
        manufacturer: {
            type: String,
            required: 'Manufacturer of device is required!'
        },
        user_id: {
            type: Schema.Types.ObjectId
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

export const DeviceRepoModel = Mongoose.model<IDevice>('Device', deviceSchema)
