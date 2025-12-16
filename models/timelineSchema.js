import { mongoose } from 'mongoose';

const timelineScheme = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: [1, "Title cannot be empty"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [1, "Description cannot be empty"]
    },
    timeline: {
        from: {
            type: String,
            require: [true, "Timeline start date is required!"]
        },
        to: {
            type: String,
        }
    }
})

export const Timeline = mongoose.model("Timeline", timelineScheme)
