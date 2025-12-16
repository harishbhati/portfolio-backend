import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    title: String,
    proficiency: String,
    skillIcon: {
        public_id: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        }
    }
})

export const Skill = mongoose.model("Skill", skillSchema);