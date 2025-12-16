import express from "express";
import  { postSoftwareApplication, deleteApplication, fetchAllApplications } from "../controllers/softwareApplicationController.js";
import { isAuthenticated } from './../middleware/auth.js';

const applicationRouter = express.Router();

applicationRouter.post("/add", isAuthenticated, postSoftwareApplication);
applicationRouter.delete("/delete/:id", isAuthenticated, deleteApplication)
applicationRouter.get("/fetch", fetchAllApplications );

export default applicationRouter;