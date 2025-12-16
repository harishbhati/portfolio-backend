import { mongoose } from 'mongoose';

const softwareApplicationSchema = new mongoose.Schema({
    name: String,
    applicationIcon: {
        public_id: {
            type: String,
            require: true
        },
        url:{
            type: String,
            require: true
        }
    }
})

export const Application = mongoose.model("Application", softwareApplicationSchema)
