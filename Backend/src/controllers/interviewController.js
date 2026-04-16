import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { generateInterviewReport } from '../services/aiService.js';
import InterviewReportModel from '../models/interviewModel.js';

async function generateInterviewReportController(req, res) {
    try {
        const resumeFile = req.file
        if (!resumeFile) {
            return res.status(400).json({ message: "No file uploaded" })
        }
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText()
        const { jobDescription, selfDescription } = req.body
        if (!jobDescription) {
            return res.status(400).json({ message: "No job description provided" })
        }
        if (!selfDescription) {
            return res.status(400).json({ message: "No self description provided" })
        }
        const interviewReportAi = await generateInterviewReport({
            resumeText: resumeContent.text,
            jobDescription,
            selfDescription
        })

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resumeText: resumeContent.text,
            jobDescription,
            selfDescription,
            matchScore: interviewReportAi.matchScore,
            technicalQuestions: interviewReportAi.technicalQuestions,
            behaviouralQuestions: interviewReportAi.behaviouralQuestions,
            skillGapAnalysis: interviewReportAi.skillGapAnalysis,
            preparationStrategy: interviewReportAi.preparationStrategy,
            overallFeedback: interviewReportAi.overallFeedback,

        })
        await interviewReport.save()
        return res.status(200).json({ message: "Interview report generated successfully", interviewReport })
    } catch (error) {
        console.error("Generate interview report error:", error)
        return res.status(500).json({ message: "Failed to generate interview report" })
    }


}

export default { generateInterviewReportController }