import catchAsyncError from "../middleware/catchAsyncError.js";
import {ErrorHandler} from "../middleware/error.js";
import {v2 as cloudinary} from "cloudinary";
import {Project} from "../models/projectSchema.js"

export const addProject = catchAsyncError(async(req, res, next) => {
    if(!req.files || !req.files.projectBanner){
        return next(new ErrorHandler("Project banner image is required!", 400));
    }

    const { projectBanner } = req.files;
    const { title, description, gitRepoLink, projectLink, technology, deployed } = req.body;

    if(!title || !description || !gitRepoLink || !projectLink || !technology || deployed === undefined){
        return next(new ErrorHandler("Please fill the form!", 400));
    }

    const techArray = technology.split(",").map(t => t.trim());
    const deployedBoolean = deployed === "true" || deployed === true;

    // Upload to Cloudinary first
    let cloudinaryResponse;
    try {
        cloudinaryResponse = await cloudinary.uploader.upload(projectBanner.tempFilePath, {
            folder: "PORTFOLIO_PROJECT_IMAGE"
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error.message || error);
        return next(new ErrorHandler("Failed to upload project banner", 500));
    }

    // Only save to DB if Cloudinary succeeded
    const project = await Project.create({
        title,
        description,
        gitRepoLink,
        projectLink,
        technology: techArray,
        deployed: deployedBoolean,
        projectBanner: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    });

    res.status(201).json({
        success: true,
        message: "New project is added!",
        project
    });
});

export const updateProject = catchAsyncError(async(req, res, next) => {
    const newProjectData = {
        title: req.body.fulltitlename,
        description: req.body.description,
        gitRepoLink: req.body.gitRepoLink,
        projectLink: req.body.projectLink,
        technology: req.body.technology,
        deployed: req.body.deployed
    };

    // Check avatar and upload it
    if(req.files && req.files.projectBanner){
        const projectBanner = req.files.projectBanner;

        // Get existing project
        const project = await Project.findById(req.params.id);
        if(!project){
            return next(new ErrorHandler("Project not found", 404));
        }

        // Delete previous image from Cloudinary if exists
        if(project.projectBanner && project.projectBanner.public_id){
            await cloudinary.uploader.destroy(project.projectBanner.public_id);
        }

        // Upload new image
        const cloudnaryResponse = await cloudinary.uploader.upload(projectBanner.tempFilePath, {
            folder: "PORTFOLIO_PROJECT_IMAGE"
        });

        // Add new banner to update data
        newProjectData.projectBanner = {
            public_id: cloudnaryResponse.public_id,
            url: cloudnaryResponse.secure_url
        };
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, newProjectData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: "Project updated successfully!",
        project: updatedProject
    });
});

export const deleteProject = catchAsyncError(async(req, res, next) => {
    const {id} = req.params;
    const project = await Project.findById(id);

    if(!project){
        return next(new ErrorHandler("Project not found", 400))
    }
    await project.deleteOne();

    res.status(201).json({
        success: true,
        message: "Project deleted successfully!",
        project
    })
})
export const fetchAllProjects = catchAsyncError(async(req, res, next) => {
    const project = await Project.find();

    res.status(201).json({
        success: true,
        message: "All project fetched successfully!",
        project
    })
    
})
export const getSingleProject = catchAsyncError(async(req, res, next) => {
    const {id} = req.params;
    const project = await Project.findById(id);

    if(!project){
        return next(new ErrorHandler("Project not found by this id", 400))
    }

    res.status(201).json({
        success: true,
        message: "Single project fetched!",
        project
    })
})