import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import blackListTokenModel from '../models/blacklist.model.js';

//register user controller
async function registerUserController(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({ message: "User already exist" })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({ username, email, password: hash })

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000
    })

    return res.status(201).json({ message: "User created successfully", user: { id: user._id, username: user.username, email: user.email } })
}

//login user controller
async function loginUserController(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!isUserAlreadyExist) {
        return res.status(400).json({ message: "User not found" })
    }

    const isPasswordValid = await bcrypt.compare(password, isUserAlreadyExist.password)

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" })

    }

    const token = jwt.sign({ id: isUserAlreadyExist._id, username: isUserAlreadyExist.username }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ message: "User logged in successfully", user: { id: isUserAlreadyExist._id, username: isUserAlreadyExist.username, email: isUserAlreadyExist.email } })
}

//logout user controller
async function logoutUserController(req, res) {
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ message: "User not logged in" })
    }
    try {
        await blackListTokenModel.create({ token })
        res.clearCookie("token")
        return res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.error("Logout error:", error)
        return res.status(500).json({ message: "Failed to logout" })
    }
}

export default { registerUserController, loginUserController, logoutUserController }