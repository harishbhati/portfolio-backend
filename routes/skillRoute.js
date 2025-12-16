import express from "express";
import  { addSkill, deleteSkill, fetchAllSkills, updateSkill } from "../controllers/skillController.js";
import { isAuthenticated } from './../middleware/auth.js';

const skillRouter = express.Router();

skillRouter.post("/add", isAuthenticated, addSkill);
skillRouter.delete("/delete/:id", isAuthenticated, deleteSkill);
skillRouter.get("/fetch", fetchAllSkills );
skillRouter.put("/update/:id", updateSkill);

export default skillRouter;