import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const waistCircumferenceSchema = new Mongoose.Schema({
        value: {
            type: Number,
            required: 'Value of waist circumference measurement is required!'
        },
        unit: {
            type: String,
            required: 'Unit of waist circumference measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of waist circumference measurement is required!'
        },
        timestamp: {
            type: Date,
            required: 'Timestamp of waist circumference measurement is required!'
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: 'Id of user associated with a waist circumference measurement is required!'
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

export const WaistCircumferenceRepoModel =
    Mongoose.model<IMeasurement>('WaistCircumference', waistCircumferenceSchema, 'measurements')
