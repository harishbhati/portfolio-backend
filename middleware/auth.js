import { User } from "../models/userSchema.js";
import catchAsyncError from "./catchAsyncError.js";
import {ErrorHandler} from "./error.js";
import jwt from "jsonwebtoken"

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    let token;

    // Try reading from cookies first
    if (req.cookies.token) {
        token = req.cookies.token;
    }

    // If not found, try Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorHandler("No token provided", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorHandler("Invalid or expired token!", 401));
    }
});
 