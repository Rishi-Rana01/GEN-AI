import userModel from '../models/user.model';


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

    const user = await userModel.create({username, email, password})

    return res.status(201).json({message: "User created successfully", user})
}


export default {registerUserController}