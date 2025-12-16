import express from "express";
import  { sendMessage, getAllMessage, deleteMessage } from "../controllers/messageController.js";
import { isAuthenticated } from './../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.post("/send", sendMessage);
messageRouter.get("/fetch",getAllMessage);
messageRouter.delete("/delete/:id", isAuthenticated, deleteMessage)

export default messageRouter;