import Mongoose from 'mongoose'

interface IPhysicalActivityModel extends Mongoose.Document {
}

const physicalActivitySchema = new Mongoose.Schema({
        name: {
            type: String,
            required: true
        },
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
        calories: {
            type: Number,
            required: true
        },
        steps: {
            type: Number
        },
        distance: {
            type: Number
        },
        levels: [
            {
                name: {
                    type: String,
                    required: true
                },
                duration: {
                    type: Number,
                    required: true
                }
            }
        ],
        calories_link: {
            type: String
        },
        heart_rate_link: {
            type: String
        },
        heart_rate_average: {
            type: Number
        },
        heart_rate_zones: {
            fat_burn: {
                min: {
                    type: Number
                },
                max: {
                    type: Number
                },
                duration: {
                    type: Number
                }
            },
            cardio: {
                min: {
                    type: Number
                },
                max: {
                    type: Number
                },
                duration: {
                    type: Number
                }
            },
            peak: {
                min: {
                    type: Number
                },
                max: {
                    type: Number
                },
                duration: {
                    type: Number
                }
            },
            out_of_range: {
                min: {
                    type: Number
                },
                max: {
                    type: Number
                },
                duration: {
                    type: Number
                }
            }
        },
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

physicalActivitySchema.index({ patient_id: 1, start_time: 1 }, { unique: true }) // define index at schema level
export const ActivityRepoModel = Mongoose.model<IPhysicalActivityModel>('PhysicalActivities', physicalActivitySchema)
