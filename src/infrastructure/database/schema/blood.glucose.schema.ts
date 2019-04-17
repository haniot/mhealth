import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const bloodGlucoseSchema = new Mongoose.Schema({
        value: {
            type: Number,
            required: 'Value of blood glucose measurement is required!'
        },
        unit: {
            type: String,
            required: 'Unit of blood glucose measurement is required!'
        },
        meal: {
            type: String,
            required: 'Meal Period of blood glucose measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of blood glucose measurement is required!'
        },
        timestamp: {
            type: Date,
            required: 'Timestamp of blood glucose measurement is required!'
        },
        user_id: {
            type: Schema.Types.ObjectId,
            required: 'Id of user associated with a blood glucose measurement is required!'
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

export const BloodGlucoseRepoModel =
    Mongoose.model<IMeasurement>('BloodGlucose', bloodGlucoseSchema, 'measurements')
