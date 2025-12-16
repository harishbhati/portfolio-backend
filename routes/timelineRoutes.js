import express from "express";
import  { postTimeline, deleteTimeline, fetchAllTimelines } from "../controllers/timelineController.js";
import { isAuthenticated } from './../middleware/auth.js';

const timelineRouter = express.Router();

timelineRouter.post("/add", isAuthenticated, postTimeline);
timelineRouter.delete("/delete/:id", isAuthenticated, deleteTimeline)
timelineRouter.get("/fetch", fetchAllTimelines );

export default timelineRouter;