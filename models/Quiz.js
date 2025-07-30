import mongoose from "mongoose";
const {Schema, model} = mongoose;

const optionSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
});

const segmentSchema = new Schema({
        type: {
        type: String,
        enum: ['text', 'code'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    lang: {
        type: String,
        required: function () {
            return this.type === 'code'; // lang is required only for code questions
        },
    }
}, { _id: false });

const questionTextSchema = new Schema({
    segments: {
        type: [segmentSchema],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0; // Ensure there is at least one segment
            },
            message: 'Question text must have at least one segment.',
        }
    },
}, { _id: false });

const questionSchema = new Schema({
    questionText: {
        type: questionTextSchema,
        required: true,
        validate: {
            validator: function (value) {
                return value.segments.length > 0; // Ensure there is at least one segment
            },
            message: 'Question text must have at least one segment.',
        },
    },
    options: {
        type: [optionSchema],
        validate: {
            validator: function (value) {
                return value.length === 4; // Ensures there are exactly 4 options
            },
            message: 'Each question must have exactly 4 options.',
        },
        required: true,
    },
    marks: {
        type: Number,
        required: true,
        validate: {
        validator: (val) => val >= 1,
        message: 'Each question must have minimum 1 mark.',
        }
    },
    explanation: {
        type: String,
        trim: true,
        default: '',
    },
});

const QuizSchema = new Schema({
    quizId: {
        type: String,
        required: true,
        unique: true,
    },
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    endless: {
        type: Boolean,
        default: false,
    },
    endDate: {
        type: Date,
        required: function () {
            return !this.endless;
        },
        // validate: {
        //     validator: function (value) {
        //         return this.endless || value > Date.now(); // Ensure endDate is in the future if not endless
        //     },
        //     message: 'End date must be in the future for non-endless quizzes.',
        // },
    },
    questions:{
        type: [questionSchema],
        validate: {
            validator: function (value) {
                return value.length > 0; // Ensure there's at least one question
            },
            message: 'Quiz must have at least one question.',
        },
        required: true,
    },
    totalMarks: {
        type: Number,
        default: function () {
            return (this.questions || []).reduce((total, question) => total + question.marks, 0);
        },
    },
    attempts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizAttempt',  // Reference to QuizAttempt
    }],
},{ timestamps: true });

// Add index on title and subject to optimize search queries
QuizSchema.index({ title: 1, subject: 1, quizId: 1, creater: 1 });  // 1 represents ascending order


export default mongoose.models.IndividualQuiz || model("IndividualQuiz", QuizSchema);
