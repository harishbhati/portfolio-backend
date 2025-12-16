import { mongoose } from 'mongoose';

const messageScheme = new mongoose.Schema({
    senderName:{
        type: String,
        minLength: [4, "Name must be contain at least 4 characters!"]
    },
    subject: {
        type: String,
        minLength: [6, "Subject must be contains at least 6 characters!"]
    },
    message: {
        type: String,
        minLength: [10, "Message must be contains at least 10 characters!"]
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

export const Message = mongoose.model("Message", messageScheme)
