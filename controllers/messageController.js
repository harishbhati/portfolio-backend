import catchAsyncError from '../middleware/catchAsyncError.js';
import {ErrorHandler} from './../middleware/error.js';
import { Message } from './../models/messageSchema.js';

//controller to create message
const sendMessage = catchAsyncError(async(req, res, next) => {
    const {senderName, subject, message} = req.body;

    if(!senderName || !subject || !message){
        return next(new ErrorHandler("Please fill full form", 400))
    }

    const data = await Message.create({senderName, subject, message});
    res.status(201).json({
        success: true,
        message: "message sent",
        data
    })
})

// controller to fetch all message
const getAllMessage = catchAsyncError(async(req,res,next) => {
    const messages = await Message.find();
    res.status(201).json({
        success: true,
        message: "Messages fetch successfully !",
        messages
    })
})

// controller to delete the message
const deleteMessage = catchAsyncError(async(req,res,next) => {
    const id = req.params.id;

    const message = await Message.findByIdAndDelete(id);

    if(!message){
        return next(new ErrorHandler("Message already deleted!", 404))
    }
    res.status(201).json({
        success: true,
        message: "Message is deleted successfully!",
        message
    })
})

export { sendMessage, getAllMessage, deleteMessage}
