import Mongoose from 'mongoose'

interface ISleepModel extends Mongoose.Document {
}

const sleepSchema = new Mongoose.Schema({
        start_time: {
            type: Date,
            required: true
        },
        end_time: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        type: {
            type: String
        },
        pattern: [{
            start_time: {
                type: Date,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            duration: {
                type: Number,
                required: true
            }
        }],
        patient_id: {
            type: Mongoose.Schema.Types.ObjectId,
            required: true
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

sleepSchema.index({ patient_id: 1, start_time: 1 }, { unique: true }) // define index at schema level
export const SleepRepoModel = Mongoose.model<ISleepModel>('Sleep', sleepSchema)
