import axios from "axios";

export const interviewApi = axios.create({
    baseURL: 'http://localhost:3000/api/interview',
    withCredentials: true,
});

/**
 * Generate a new interview report by uploading resume + form data.
 * @param {FormData} formData - Must include: resume (file), jobDescription, selfDescription, experienceLevel
 * @returns {Promise<{message: string, interviewReport: object}>}
 */
export async function generateReport(formData) {
    try {
        const response = await interviewApi.post('/generate-report', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (err) {
        console.error('Generate report error:', err);
        throw err;
    }
}

/**
 * Fetch a previously generated interview report by its MongoDB ID.
 * @param {string} interviewId
 * @returns {Promise<{interviewReport: object}>}
 */
export async function getReportById(interviewId) {
    try {
        const response = await interviewApi.get(`/report/${interviewId}`);
        return response.data;
    } catch (err) {
        console.error('Get report error:', err);
        throw err;
    }
}
