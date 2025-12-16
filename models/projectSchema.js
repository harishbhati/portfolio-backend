import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    gitRepoLink: { type: String, required: true },
    projectLink: { type: String, required: true },
    technology: { type: [String], required: true }, 
    deployed: { type: Boolean, required: true },
    projectBanner: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
});

export const Project = mongoose.model("Project", projectSchema);
