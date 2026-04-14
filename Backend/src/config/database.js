import mongoose from "mongoose";

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed", error);
    }
}

export default connectDB;