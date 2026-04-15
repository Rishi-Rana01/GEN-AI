import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false })

const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false })

const skillGapAnalysisSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["high", "medium", "low"],
        required: true
    },
    suggestion: {
        type: String,
        required: true
    }
}, { _id: false })

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    focus: {
        type: String,
        required: true
    },
    tasks: [
        {
            type: String,
            required: true
        }
    ]
}, { _id: false })

const overallFeedbackSchema = new mongoose.Schema({
    strengths: [
        {
            type: String,
            required: true
        }
    ],
    areasOfImprovement: [
        {
            type: String,
            required: true
        }
    ],
    recommendation: {
        type: String,
        required: true
    }
}, { _id: false })

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resumeText: {
        type: String,
        required: [true, "Resume text is required"]
    },
    selfDescription: {
        type: String,

    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],

    behaviouralQuestions: [behaviouralQuestionSchema],

    skillGapAnalysis: [skillGapAnalysisSchema],

    preparationStrategy: [preparationPlanSchema],

    overallFeedback: [overallFeedbackSchema]
})

const InterviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

export default InterviewReportModel;


// Job decription
// resume text
// self description

// Match Score

// Technical question
// Behavioural question
// skill gap analysis
// prepration stratergy