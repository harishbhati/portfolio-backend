import express from "express";
import  { addProject, deleteProject, fetchAllProjects, updateProject, getSingleProject } from "../controllers/projectController.js";
import { isAuthenticated } from './../middleware/auth.js';

const projectRouter = express.Router();

projectRouter.post("/add", isAuthenticated, addProject);
projectRouter.delete("/delete/:id", isAuthenticated, deleteProject);
projectRouter.get("/fetch", fetchAllProjects );
projectRouter.put("/update/:id", updateProject);
projectRouter.get("/fetch/:id", getSingleProject);

export default projectRouter;