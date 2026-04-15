import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the job description and the resume between 0 to 100"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question"),
        intention: z.string().describe("The intention behind the technical question"),
        answer: z.string().describe("The expected answer to the technical question"),
        difficulty: z.string().describe("The difficulty level of the technical question"),
        topics: z.array(z.string()).describe("The topics covered in the technical question"),
    })).describe("The technical questions that can be asked in the interview"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question"),
        intention: z.string().describe("The intention behind the behavioral question"),
        answer: z.string().describe("The expected answer to the behavioral question"),
        difficulty: z.string().describe("The difficulty level of the behavioral question"),
        topics: z.array(z.string()).describe("The topics covered in the behavioral question"),
    })).describe("The behavioral questions that can be asked in the interview"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that is missing"),
        severity: z.string().describe("The severity of the skill gap"),
        suggestion: z.string().describe("The suggestion to overcome the skill gap"),
    })).describe("The skill gaps that can be identified in the interview"),

    preparationStrategy: z.array(z.object({
        day: z.number().describe("The day of the preparation"),
        focus: z.string().describe("The focus of the preparation"),
        tasks: z.array(z.string()).describe("The tasks to be completed on the day"),
    })).describe("The preparation strategy for the interview"),

    overallFeedback: z.object({
        strengths: z.array(z.string()).describe("The strengths of the candidate"),
        areasOfImprovement: z.array(z.string()).describe("The areas of improvement of the candidate"),
        recommendation: z.string().describe("The recommendation for the candidate"),
    }).describe("The overall feedback for the candidate"),
});

export const generateInterviewReport = async (jobDescription, resumeText, selfDescription) => {
    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Generate an interview report based on the following information:
                Job Description: ${jobDescription}
                Resume Text: ${resumeText}
                Self Description: ${selfDescription}
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            },
        });
        console.log(response.text);
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating interview report:", error);
        throw error;
    }
};
