import express from 'express';
import authController from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/register', authController.registerUserController)
authRouter.post("/login", authController.loginUserController)
authRouter.post("/logout", authController.logoutUserController)


export default authRouter