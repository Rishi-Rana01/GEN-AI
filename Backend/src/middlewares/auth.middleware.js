import jwt from 'jsonwebtoken'
import blackListTokenModel from '../models/blacklist.model.js'

async function authUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided"
        })
    }

    const isTokenBlacklisted = await blackListTokenModel.findOne({ token })
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Token is blacklisted"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        next()

    } catch (error) {
        console.error(error)
        return res.status(401).json({
            message: "Invalid Token. ",

        })
    }

}

export default { authUser }