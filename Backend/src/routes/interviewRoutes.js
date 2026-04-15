import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import interviewController from '../controllers/interviewController';
import upload from '../middlewares/fileMiddleware';


const interviewRouter = express.Router();

interviewRouter.post('/generate-report', authMiddleware.authUser, upload.single('resume'), interviewController.generateInterviewReportController);

export default interviewRouter;