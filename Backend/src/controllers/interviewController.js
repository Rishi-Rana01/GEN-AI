import { PDFParse } from 'pdf-parse';
import { generateInterviewReport } from '../services/aiService.js';
import InterviewReportModel from '../models/interviewModel.js';

async function generateInterviewReportController(req, res) {
    try {
        const resumeFile = req.file
        if (!resumeFile) {
            return res.status(400).json({ message: "No file uploaded" })
        }
        const parser = new PDFParse({ data: Uint8Array.from(resumeFile.buffer) });
        const resumeContent = await parser.getText();
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
            title: interviewReportAi.title,
            matchScore: interviewReportAi.matchScore,
            technicalQuestions: interviewReportAi.technicalQuestions,
            behaviouralQuestions: interviewReportAi.behavioralQuestions,  // AI returns 'behavioral' (no 'u')
            skillGapAnalysis: interviewReportAi.skillGaps,                // AI returns 'skillGaps'
            preparationStrategy: interviewReportAi.preparationStrategy,
            overallFeedback: interviewReportAi.overallFeedback
        })
        await interviewReport.save()
        return res.status(200).json({ message: "Interview report generated successfully", interviewReport })
    } catch (error) {
        console.error("Generate interview report error:", error)
        return res.status(500).json({ message: "Failed to generate interview report" })
    }


}

async function getInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        const report = await InterviewReportModel.findById(interviewId);

        if (!report) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        // Ensure the report belongs to the requesting user
        if (report.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        return res.status(200).json({ interviewReport: report });
    } catch (error) {
        console.error("Get interview report error:", error);
        return res.status(500).json({ message: "Failed to fetch interview report" });
    }
}

// controller to get all the interview reports of logged in user.

async function getAllInterviewReportController(req,res) {
    
}

export default { generateInterviewReportController, getInterviewReportController }
