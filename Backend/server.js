import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";

dotenv.config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Database connection failed", error);
    });