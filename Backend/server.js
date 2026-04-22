import 'dotenv/config';
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Database connection failed", error);
    });