import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Name required!']
    },
    email: {
        type: String,
        required: [true, 'Email required!']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required!']
    },
    aboutMe: {
        type: String,
        required: [true, 'About message is required!']
    },
    password: {
        type: String,
        required: function () { return this.isNew },
        minLength: [8, 'Password must contains at least 8 characters'],
        select: false,
        validate: {
            validator: function (value) {
            // ONLY validate if password is being modified
            if (!this.isModified("password")) return true;
            return value && value.length >= 8;
            },
            message: "Password must contains at least 8 characters"
        }
    },
    avtar:{
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    resume: {
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    portfolio: {
        type: String,
        required: [true, 'Portfolio url is required!']
    },
    githubURL: String,
    instaURL: String,
    facebookURL: String,
    twitterURL: String,
    linkedinURL: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// for hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // use 'return' so execution stops here
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// compare entered and database pasword
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// generate Json web token
userSchema.methods.generateJsonWebtoken = async function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d" // or whatever expiry you want
    })
}

userSchema.methods.getResetPasswordToken = async function() {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    //reset pasword expire after 15 mint
    this.resetPasswordExpire = Date.now() + 15 * 60 *1000;
    return resetToken;
}

export const User = mongoose.model("User", userSchema);