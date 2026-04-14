import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
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
        });
        console.log(response.text);
        return response.text;
    } catch (error) {
        console.error("Error generating interview report:", error);
        throw error;
    }
};
