import { GoogleGenAI } from "@google/genai";

// Native Gemini API schema format (OpenAPI 3.0 subset)
// zodToJsonSchema is NOT compatible with Gemini's responseSchema - use this format directly
const interviewReportSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The job title extracted from the job description"
        },
        matchScore: {
            type: "number",
            description: "Overall match score between the candidate resume and job description, from 0 to 100"
        },
        technicalQuestions: {
            type: "array",
            description: "List of technical interview questions tailored to the job role",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical interview question" },
                    intention: { type: "string", description: "Why this question is being asked" },
                    answer: { type: "string", description: "A model expected answer" },
                    difficulty: { type: "string", description: "easy, medium, or hard" },
                    topics: { type: "array", items: { type: "string" }, description: "Topics or skills this question covers" }
                },
                required: ["question", "intention", "answer", "difficulty", "topics"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "List of behavioral interview questions",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral interview question" },
                    intention: { type: "string", description: "Why this question is being asked" },
                    answer: { type: "string", description: "A model expected answer using STAR format" },
                    difficulty: { type: "string", description: "easy, medium, or hard" },
                    topics: { type: "array", items: { type: "string" }, description: "Soft skills or themes this question covers" }
                },
                required: ["question", "intention", "answer", "difficulty", "topics"]
            }
        },
        skillGaps: {
            type: "array",
            description: "Skills required by the job that the candidate is missing or weak in",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The missing or weak skill" },
                    severity: { type: "string", description: "high, medium, or low" },
                    suggestion: { type: "string", description: "How to address this skill gap" }
                },
                required: ["skill", "severity", "suggestion"]
            }
        },
        preparationStrategy: {
            type: "array",
            description: "Day-by-day preparation plan for the interview",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "Day number of the preparation plan" },
                    focus: { type: "string", description: "Main focus area for this day" },
                    tasks: { type: "array", items: { type: "string" }, description: "List of tasks to complete on this day" }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        overallFeedback: {
            type: "object",
            description: "Overall assessment of the candidate",
            properties: {
                strengths: { type: "array", items: { type: "string" }, description: "Key strengths of the candidate" },
                areasOfImprovement: { type: "array", items: { type: "string" }, description: "Areas where the candidate needs to improve" },
                recommendation: { type: "string", description: "Final recommendation for the candidate" }
            },
            required: ["strengths", "areasOfImprovement", "recommendation"]
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationStrategy", "overallFeedback"]
};

// Retries the API call up to maxRetries times for transient 503/429 errors
async function generateWithRetry(genAI, requestConfig, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await genAI.models.generateContent(requestConfig);
        } catch (err) {
            const isRetryable = err?.status === 503 || err?.status === 429;
            if (isRetryable && attempt < maxRetries) {
                const delayMs = 1000 * Math.pow(2, attempt); // 2s, 4s, 8s
                console.warn(`Gemini API returned ${err.status}. Retrying in ${delayMs / 1000}s (attempt ${attempt}/${maxRetries - 1})...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } else {
                throw err;
            }
        }
    }
}

export const generateInterviewReport = async ({ jobDescription, resumeText, selfDescription }) => {
    // Instantiate here so GOOGLE_API_KEY is always read after dotenv has loaded
    const genAI = new GoogleGenAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });

    try {
        const response = await generateWithRetry(genAI, {
            model: "gemini-2.0-flash",  // stable v1beta model with good availability
            contents: `
                You are an expert technical recruiter and interview coach.
                Generate a detailed, structured interview report based on the following:

                Job Description:
                ${jobDescription}

                Candidate Resume:
                ${resumeText}

                Candidate Self Description:
                ${selfDescription}

                Provide exactly 5-8 technical questions, 4-6 behavioral questions, all skill gaps you identify, 
                a 7-day preparation strategy, and comprehensive overall feedback.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema,
            },
        });

        const parsed = JSON.parse(response.text);
        console.log("AI report generated successfully. Title:", parsed.title, "| Match Score:", parsed.matchScore);
        return parsed;
    } catch (error) {
        console.error("Error generating interview report:", error);
        throw error;
    }
};
