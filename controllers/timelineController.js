import catchAsyncError from "../middleware/catchAsyncError.js";
import {Timeline} from "../models/timelineSchema.js";

export const postTimeline = catchAsyncError(async(req, res, next) => {
    const {title, description, from, to} = req.body;
    const newTitmeline = await Timeline.create({
        title,
        description,
        timeline: { from, to }
    })
    res.status(201).json({
        success: true,
        message: "Timeline added successfully!",
        newTitmeline
    })

})

export const deleteTimeline = catchAsyncError(async(req, res, next) => {
    const id = req.params.id;
    
    const timeline = await Timeline.findByIdAndDelete(id);
    res.status(201).json({
        success: true,
        message: "Timeline deleted successfully!",
        timeline
    })
    
})

export const fetchAllTimelines = catchAsyncError(async(req, res, next) => {
    const timeline = await Timeline.find();
    res.status(201).json({
        success: true,
        message: "Timline fetch successfully!",
        timeline
    })
    
})