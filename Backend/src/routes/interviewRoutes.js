import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import interviewController from '../controllers/interviewController.js';
import upload from '../middlewares/fileMiddleware.js';


const interviewRouter = express.Router();

interviewRouter.post('/generate-report', authMiddleware.authUser, upload.single('resume'), interviewController.generateInterviewReportController);

export default interviewRouter;