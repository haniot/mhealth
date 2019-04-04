import Mongoose, { Schema } from 'mongoose'

interface IMeasurement extends Mongoose.Document {
}

const measurementSchema = new Mongoose.Schema({
        value: {
            type: Number,
            required: 'Value of measurement is required!'
        },
        unit: {
            type: String,
            required: 'Unit of measurement is required!'
        },
        type: {
            type: String,
            required: 'Type of measurement is required!'
        },
        measurements: [{
            type: Schema.Types.ObjectId,
            ref: 'Measurement'
        }],
        contexts: [{
            type: {
                type: String
            },
            value: {
                type: Number
            }
        }],
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
