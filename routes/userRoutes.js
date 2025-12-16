import express from "express";
import  { forgotPassword, getUser, getUserForPortfolio, login, logout, register, resetPassword, updatepassword, updateProfile } from "../controllers/userController.js";
import { isAuthenticated } from './../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", isAuthenticated, logout);
userRouter.get('/me', isAuthenticated, getUser);
userRouter.put('/update/me', isAuthenticated, updateProfile);
userRouter.put('/update/password', isAuthenticated, updatepassword);
userRouter.get('/me/portfolio', getUserForPortfolio);
userRouter.post('/password/forgot', forgotPassword);
userRouter.put('/password/reset/:token', resetPassword);

export default userRouter;