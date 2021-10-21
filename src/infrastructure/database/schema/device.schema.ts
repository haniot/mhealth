import Mongoose, { Schema } from 'mongoose'

interface IDevice extends Mongoose.Document {
}

const deviceSchema = new Mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        model_number: {
            type: String
        },
        manufacturer: {
            type: String,
            required: true
        },
        patient_id: { type: Schema.Types.ObjectId }
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

deviceSchema.index({ address: 1, patient_id: 1 }, { unique: true })

export const DeviceRepoModel = Mongoose.model<IDevice>('Device', deviceSchema)
