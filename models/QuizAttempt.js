import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const quizAttemptSchema = new Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IndividualQuiz',  // Link to the quiz
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,  // Store email in lowercase
    },
    score: {
        type: Number,
        required: true,
        default: 0,  // The score the user achieved
        validate: {
            validator: function (value) {
                return value <= this.maxMarks;
            },
            message: 'Score cannot exceed maximum marks.',
        },
    },
    maxMarks: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    correctQuestions: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value <= this.totalQuestions;
            },
            message: 'Correct questions cannot exceed total questions.',
        },
    },
    answers: {
        type: Map,
        of: String,
        required: true,  // Stores questionId as key and selected answer text as value
    }
}, { timestamps: true });

// Add an index on quizId and userEmail to optimize queries
quizAttemptSchema.index({ quizId: 1, userEmail: 1 });
quizAttemptSchema.index({ quizId: 1 });

export default mongoose.models.QuizAttempt || model('QuizAttempt', quizAttemptSchema);
