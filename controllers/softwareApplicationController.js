import catchAsyncError from "../middleware/catchAsyncError.js";
import {ErrorHandler} from "../middleware/error.js";
import {Application} from "../models/softwareApplicationSchema.js"
import {v2 as cloudinary} from "cloudinary";

export const postSoftwareApplication = catchAsyncError(async(req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Software application icon required!", 400))
    }

    const {applicationIcon} = req.files;
    const {name} = req.body;
    if(!name){
        return next(new ErrorHandler("Software name is required!", 400))
    }


    // for avtar
    const cloudnaryResponse = await cloudinary.uploader.upload(applicationIcon.tempFilePath, {
        folder:"PORTFOLIO_SOFTWARE_APPLICATION"
    })

    if(!cloudnaryResponse || cloudnaryResponse.error){
        console.error("Cloudnary error", cloudnaryResponse.error || "Unknown clodinary error")
    }

    const softwareApplication = await Application.create({
        name,
        applicationIcon: {
            public_id: cloudnaryResponse.public_id,
            url: cloudnaryResponse.secure_url
        }
    })

    res.status(201).json({
        success: true,
        message: "New software application added!",
        softwareApplication
    })

})

export const deleteApplication = catchAsyncError(async(req, res, next) => {
    const {id} = req.params;
    const softwareApplication = await Application.findById(id);
    if(!softwareApplication){
        return next(new ErrorHandler("software application not forund."))
    }
    const softwareapplicationSvgId = softwareApplication.applicationIcon.public_id;
    if(softwareapplicationSvgId) {
        await cloudinary.uploader.destroy(softwareapplicationSvgId)
    }
    await softwareApplication.deleteOne();

    res.status(200).json({
        success: true,
        message: "Application deleted!",
        softwareApplication
    })
})

export const fetchAllApplications = catchAsyncError(async(req, res, next) => {
    const softwareApplication = await Application.find();

    res.status(201).json({
        success: true,
        message: "Application lists fetched!",
        softwareApplication
    })
})
