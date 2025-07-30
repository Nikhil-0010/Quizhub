"use client"

import { useState } from "react"
import { Edit, Trash2, Save, X, CheckCircle, PenTool, Brain, Upload } from "lucide-react"
import QuestionPreview from "./QuestionPreview"

export function QuizPreview({ questions, onUpdateQuestion, onRemoveQuestion, setFinalise, finalise }) {
    const [editingId, setEditingId] = useState(null)
    const [editingQuestion, setEditingQuestion] = useState(null)
    const [errors, setErrors] = useState({});

    const validateQuestion = () => {
        const newerrors = {};
        if( editingQuestion?.isCode && (!editingQuestion.questionText.beforeCode?.trim() || !editingQuestion.questionText.codePart?.trim() || !editingQuestion.questionText.afterCode?.trim())) {
            newerrors.questionText = "Question is required.";
        }
        else if (!editingQuestion.questionText?.codePart && !editingQuestion.questionText?.trim()) {
            newerrors.questionText = "Question is required.";
        }
        if (!editingQuestion.options.every(opt => typeof opt === 'string' && opt.trim() !== '')) {
            newerrors.options = "Option cannot be empty.";
        }
        if (!(editingQuestion.correctAnswer + 1)) {
            newerrors.correctAnswer = "Correct answer is required.";
        }
        if (!editingQuestion.marks) {
            newerrors.marks = "Marks are required.";
        }
        setErrors(newerrors);
        return Object.keys(newerrors).length === 0;
    }

    const handleEdit = (question) => {
        setEditingId(question.id)
        setEditingQuestion({ ...question })
    }

    const handleSave = () => {
        if (editingQuestion && editingId) {
            if (!validateQuestion()) return;
            onUpdateQuestion(editingId, editingQuestion)
            setEditingId(null)
            setEditingQuestion(null)
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditingQuestion(null)
    }



    return (
        <div className="sticky top-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <div className="p-6 space-y-1.5 font-semibold leading-none tracking-tight flex items-center justify-between">
                <span className="text-2xl font-semibold">Quiz Preview</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs  bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                    {questions.length} questions
                </span>
            </div>
            <div className="p-6 pt-0 space-y-4 max-h-[600px] overflow-y-auto">
                {questions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No questions added yet</p>
                        <p className="text-sm">Create questions using the tabs on the left</p>
                    </div>
                ) : (
                    <>
                        {questions.map((question, index) => (
                            <div key={question.id} className="shadow-2xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                                <QuestionPreview
                                    question={question}
                                    index={index}
                                    isPreview={true}
                                    updateQuestion={onUpdateQuestion}
                                    removeQuestion={onRemoveQuestion}
                                />
                            </div>
                        ))}

                        {!finalise && (
                            <button
                                type="button"
                                className="w-full h-10 px-4 py-2 rounded-md whitespace-nowrap text-sm transition-colors bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium disabled:opacity-50"
                                disabled={questions.length === 0}
                                onClick={() => { console.log(questions); setFinalise(true) }}
                            >
                                Finalise Quiz ({questions.length} questions)
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
