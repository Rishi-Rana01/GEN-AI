import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, { timestamps: true })

const blackListTokenModel = mongoose.model("blackListTokens", blackListTokenSchema)

export default blackListTokenModel