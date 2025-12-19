import catchAsyncError from "../middleware/catchAsyncError.js";
import {ErrorHandler} from "../middleware/error.js";
import {Skill} from "../models/skillSchema.js";
import {v2 as cloudinary} from "cloudinary";
import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory
export const upload = multer({ storage });


export const addSkill = catchAsyncError(async(req, res, next) => {
     if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Skill icon required!", 400))
    }

    const { skillIcon } = req.files;
    const {title, proficiency} = req.body;
    if(!title){
        return next(new ErrorHandler("Skill title is required!", 400))
    }
     if(!proficiency){
        return next(new ErrorHandler("Skill proficiency is required!", 400))
    }


    // for avtar
    const cloudnaryResponse = await cloudinary.uploader.upload(skillIcon.tempFilePath, {
        folder:"PORTFOLIO_SKILL"
    })

    if(!cloudnaryResponse || cloudnaryResponse.error){
        console.error("Cloudnary error", cloudnaryResponse.error || "Unknown clodinary error")
    }
    const skill = await Skill.create({
        title,
        proficiency,
        skillIcon: {
            public_id: cloudnaryResponse.public_id,
            url: cloudnaryResponse.secure_url
        }
    })

    res.status(201).json({
        success: true,
        message: "New skill is added!",
        skill
    })
})

export const deleteSkill = catchAsyncError(async(req, res, next) => {
    const {id} = req.params;
    const skill = await Skill.findById(id);
    if(!skill){
        return next(new ErrorHandler("Skill not found!", 400))
    }

    const skillSvgid = skill.skillIcon?.public_id;
    if(skillSvgid){
        await cloudinary.uploader.destroy(skillSvgid);
    }
    
    await skill.deleteOne();
    res.status(200).json({
        success: true,
        message: "Skill deleted successfully",
        skill
    })
})

export const updateSkill = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    let skill = await Skill.findById(id);
    if (!skill) return next(new ErrorHandler("Skill not found!", 400));

    if (req.body.title) skill.title = req.body.title;
    if (req.body.proficiency) skill.proficiency = req.body.proficiency;

    if (req.files && req.files.skillIcon) { // check for file
        const skillIcon = req.files.skillIcon;

        // Delete old image if exists
        if (skill.skillIcon?.public_id) {
            await cloudinary.uploader.destroy(skill.skillIcon.public_id);
        }

        // Upload new image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(skillIcon.tempFilePath, {
            folder: "PORTFOLIO_SKILL"
        });

        skill.skillIcon = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        };
    }

    await skill.save();

    res.status(200).json({
        success: true,
        message: "Skill updated successfully!",
        skill
    });
});


export const fetchAllSkills = catchAsyncError(async(req, res, next) => {
    const skill = await Skill.find();

    res.status(201).json({
        success: true,
        message: "Skill list fetched!",
        skill
    })
})