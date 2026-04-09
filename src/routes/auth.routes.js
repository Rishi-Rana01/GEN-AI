import express from 'express';
import authController from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/register', authController.registerUserController)
authRouter.post("/login", authController.loginUserController)


export default authRouter