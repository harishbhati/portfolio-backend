import catchAsyncError from '../middleware/catchAsyncError.js';
import {ErrorHandler} from '../middleware/error.js';
import {User} from '../models/userSchema.js';
import {v2 as cloudinary} from 'cloudinary';
import generateToken from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from "crypto";

export const register = catchAsyncError(async(req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Avtar and resume required!", 400))
    }

    const {avtar, resume} = req.files;
    // for avtar
    const cloudnaryResponseForAvtar = await cloudinary.uploader.upload(avtar.tempFilePath, {
        folder:"AVATARS"
    })

    if(!cloudnaryResponseForAvtar || cloudnaryResponseForAvtar.error){
        console.error("Cloudnary error", cloudnaryResponseForAvtar.error || "Unknown clodinary error")
    }

    // --- Check if resume is PDF ---
    if (resume.mimetype !== "application/pdf") {
        return next(new ErrorHandler("Resume must be a PDF file", 400));
    }

    // Upload to Cloudinary
    const cloudnaryResponseForResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "MY_RESUME",
        resource_type: "raw", // important for PDFs
    });

    if(!cloudnaryResponseForResume || cloudnaryResponseForResume.error){
        console.error("Cloudnary error", cloudnaryResponseForResume.error || "Unknown clodinary error")
    }

    const {fullname,email,phone,aboutMe,password,portfolio,githubURL,instaURL,facebookURL,twitterURL,linkedinURL} = req.body;
    const user = await User.create({
        fullname,
        email,
        phone,
        aboutMe,
        password,
        portfolio,
        githubURL,
        instaURL,
        facebookURL,
        twitterURL,
        linkedinURL,
        avtar: {
            public_id: cloudnaryResponseForAvtar.public_id,
            url: cloudnaryResponseForAvtar.secure_url
        },
        resume: {
            public_id:cloudnaryResponseForResume.public_id,
            url: cloudnaryResponseForResume.secure_url
        }
    })
    generateToken(user, "User register successfully!", 201, res);
})

export const login = catchAsyncError(async(req, res, next) => {
    const { email, password } = req.body || {};

    if(!email || !password) {
        return next(new ErrorHandler("Email & password are required!", 400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password!"))
    }

    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid email or password!"))
    }

    generateToken(user, "Logged In", 200, res)
})

export const logout = catchAsyncError(async(req, res, next) => {
    res.status(201).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).json({
        success: true,
        message: "Log out!"
    })
})

export const getUser = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req?.user?.id);
    res.status(201).json({
        success: true,
        message: "user fetch",
        user
    })
})

export const updateProfile = catchAsyncError(async (req, res, next) => {
  if (
    (!req.body || Object.keys(req.body).length === 0) &&
    (!req.files || Object.keys(req.files).length === 0)
  ) {
    return next(new ErrorHandler("Request body is missing", 400));
  }

  // Build dynamic update object ONLY with fields provided
  const newUserData = {};
  const allowedFields = [
    "fullname",
    "email",
    "phone",
    "aboutMe",
    "portfolio",
    "githubURL",
    "instaURL",
    "facebookURL",
    "twitterURL",
    "linkedinURL",
  ];

  allowedFields.forEach((key) => {
    if (req.body[key] !== undefined) {
      newUserData[key] = req.body[key];
    }
  });

  // Block password update here
  if (req.body.password) {
    return next(
      new ErrorHandler(
        "Password cannot be updated here. Use /update-password route.",
        400
      )
    );
  }

  // Avatar Update
  if (req.files?.avtar) {
    const avtar = req.files.avtar;
    const user = await User.findById(req?.user?.id);

    await cloudinary.uploader.destroy(user.avtar.public_id);

    const uploaded = await cloudinary.uploader.upload(avtar.tempFilePath, {
      folder: "AVATARS",
    });

    newUserData.avtar = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  }

  // Resume Update
  if (req.files?.resume) {
    const resume = req.files.resume;

    // Validate PDF
    if (resume.mimetype !== "application/pdf") {
        return next(new ErrorHandler("Resume must be a PDF file", 400));
    }

    const user = await User.findById(req?.user?.id);

    // Delete old resume if exists
    if (user.resume?.public_id) {
        await cloudinary.uploader.destroy(user.resume.public_id, { resource_type: "raw" });
    }

    // Upload new resume
    const uploaded = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "MY_RESUME",
        resource_type: "raw",
        use_filename: true,
        unique_filename: false,
    });

    newUserData.resume = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
    };
}

  // Update user
  const user = await User.findByIdAndUpdate(req?.user?.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    message: "Profile updated!",
    user,
  });
});

export const updatepassword = catchAsyncError(async(req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if(!currentPassword || !newPassword || !confirmNewPassword ){
        return next(new ErrorHandler("Please fill all fields", 400))
    }
    const user = await User.findById(req?.user?.id).select("+password");
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if(!isPasswordMatch){
        return next(new ErrorHandler("Incorrect current password", 400))
    }
    if(newPassword !== confirmNewPassword){
        return next(new ErrorHandler("Confirm password and new password are not match", 400))
    }

    user.password = newPassword;
    await user.save();

    res.status(201).json({
        success: true,
        message: "Password updated!",
        user
    })
})

export const getUserForPortfolio = catchAsyncError(async(req, res, next) => {
    const id = "69413ca9346c68c74f552d21";
    const user = await User.findById(id);

    res.status(201).json({
        success: true,
        message:"Portfolio fetch successfully!",
        user
    })
})

export const forgotPassword = catchAsyncError(async(req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({email});
    if(!user){
        return next(new ErrorHandler("User not found!", 400));
    }
    // @ts-nocheck
    const resetToken = await user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordURL = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
    const message = `Reset password url is: \n\n ${resetPasswordURL} \n\n if you have not request it please ignore it.`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Personal portfolio dashboard recovery password.',
            message
        });

        res.status(201).json({
            success: true,
            message:`Email sent to ${user.email} successfully.`
        })

    } catch(error){
        user.resetPasswordExpire = undefined,
        user.resetPasswordToken = undefined
        await user.save();
        return next(new ErrorHandler(error.message, 500))
    }
})

export const resetPassword = catchAsyncError(async(req, res, next) => {
  try {
    const token = req.params.token;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user){
        return res.status(400).json({ success: false, message: "Reset password token is invalid or expired!" });
    }

    const { password, confirmNewPassword } = req.body;
    if(password !== confirmNewPassword){
        return res.status(400).json({ success: false, message: "Passwords do not match!" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully!" });
    } catch(err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
    }
})