import dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";
import app from "./app.js";
import dbConnection from "./database/dbConnection.js";
// Connect DB
dbConnection();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server is running in ${PORT}`);
})