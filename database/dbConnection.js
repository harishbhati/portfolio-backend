import mongoose from "mongoose";

const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "PORTFOLIO", 
    }).then(() => {
        console.log("Database connected!");
    }).catch((error)=>{
        console.log(`Error while conection with datbase ${error}`)
    })
}

export default dbConnection;