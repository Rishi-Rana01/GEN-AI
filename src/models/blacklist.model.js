import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, { timestamps: true })

const blackListTokenModel = mongoose.model("blackListTokens", blackListTokenSchema)

export default blackListTokenModel