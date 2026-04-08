import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';


async function registerUserController(req, res) {
    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({message: "All fields are required"})
    }

    isUserAlreadyExist = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExist){
        return res.status(400).json({message: "User already exist"})
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({username, email, password: hash})

    const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "1d"})

    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000
    })

    return res.status(201).json({message: "User created successfully", user: {id: user._id, username: user.username, email: user.email}})
}


export default {registerUserController}