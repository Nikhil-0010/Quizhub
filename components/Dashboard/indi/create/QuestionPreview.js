import React, { useState } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';


export default function QuestionPreview({ question, index, isPreview=false, setGeneratedQuestions=null, setMarksError=null, updateQuestion=null, removeQuestion=null }) {

    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [editingQuestion, setEditingQuestion] = useState(null);

    const handleEdit = () => {
        setIsEditing(true);
        setEditingQuestion(question);
    }

    const handleRemoveQuestion = (index) => {
        setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index))
    }

    const validateQuestion = () => {
        const newerrors = {};

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

    const handleUpdateQuestion = (id, updatedQuestion) => {
        setGeneratedQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q)))
    }


    const handleSave = () => {
        if (isEditing) {
            if (!validateQuestion()) return;
            isPreview? updateQuestion(editingQuestion.id, editingQuestion):setMarksError((prev) => prev.filter((id) => id !== editingQuestion.id));  handleUpdateQuestion(editingQuestion.id, editingQuestion);
            setIsEditing(false);
        }
    }

    const handleCancel = () => {
        setIsEditing(false);
        setEditingQuestion
        setErrors({})
    }



    return (
        <div className="p-6 pt-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400"> {isPreview?"Q":"Question"} {index + 1}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full ${isPreview ? "text-xs" : "text-sm"} text-slate-500 dark:text-slate-400 bg-slate-100 font-semibold dark:bg-slate-800`}>
                        {question.marks === undefined ? "No marks assigned" : `${question.marks} marks`}
                    </span>
                </div>
                <div className="flex space-x-1">
                    <button
                        className="px-3 h-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                        title="Edit"
                        type="button"
                        onClick={() => handleEdit()}
                        tabIndex={-1}
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        className="px-3 h-9 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => isPreview? removeQuestion(question.id):  handleRemoveQuestion(index)}
                        type="button"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    {(editingQuestion.questionText.map((segment, index) => {
                        return (
                            <div key={index} className="flex flex-col space-y-1">
                                <textarea
                                    value={segment.value}
                                    onChange={(e) => {
                                        const newQuestionText = [...editingQuestion.questionText];
                                        newQuestionText[index] = { ...segment, value: e.target.value };
                                        setEditingQuestion({ ...editingQuestion, questionText: newQuestionText });
                                    }}
                                    className="w-full px-3 py-2 border rounded-md text-sm whitespace-pre-line"
                                    placeholder="Enter question here...">
                                    {segment.value}
                                </textarea>
                            </div>
                        )
                    }))}

                    {editingQuestion.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                checked={editingQuestion.correctAnswer === optIndex}
                                onChange={() =>
                                    setEditingQuestion({ ...editingQuestion, correctAnswer: optIndex })
                                }
                                className="text-orange-500"
                            />
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                    const newOptions = [...editingQuestion.options]
                                    newOptions[optIndex] = e.target.value
                                    setEditingQuestion({ ...editingQuestion, options: newOptions })
                                }}
                                className={`w-full px-3 py-2 border rounded-md ${isPreview ? "text-xs" : "text-sm"}`}
                                placeholder={`Option ${optIndex + 1}`}
                            />
                        </div>
                    ))}

                    <textarea
                        rows={4}
                        value={editingQuestion.explanation}
                        onChange={(e) =>
                            setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                        }

                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder="Enter explanation here..."
                    />

                    <input
                        type="number"
                        value={editingQuestion.marks ?? ''}
                        onChange={(e) =>
                            setEditingQuestion({ ...editingQuestion, marks: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder="Enter marks"
                        min={0}
                    />

                    {Object.keys(errors).length > 0 && (
                        <div className="text-red-500 text-xs my-1">
                            {errors.questionText && (
                                <div>{errors.questionText}</div>
                            )}
                            {errors.options && (
                                <div>{errors.options}</div>
                            )}
                            {errors.correctAnswer && (
                                <div>{errors.correctAnswer}</div>
                            )}
                            {errors.marks && (
                                <div>{errors.marks}</div>
                            )}
                        </div>)}

                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 px-3 h-9 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm whitespace-nowrap font-medium"
                            onClick={handleSave}
                        >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-3 h-9 rounded-md border border-slate-300 dark:border-slate-700 text-sm whitespace-nowrap font-medium"
                            onClick={handleCancel}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {(question.questionText.map((segment, index) => {
                        if (segment.type === "image") {
                            return (
                                <div key={index} className="mb-2">
                                    <img
                                        src={segment.value}
                                        alt={`Image ${index + 1}`}
                                        className="max-w-full h-auto rounded-md"
                                    />
                                </div>
                            );
                        }

                        if (segment.type !== "text" && segment.type !== "image") {
                            return (
                                <div key={index} className="font-medium mb-2">
                                    <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto">
                                        <code className={`text-sm language-${segment.lang}`}>{segment.value ?? ""}</code>
                                    </pre>
                                </div>
                            );
                        } else {
                            return (
                                <p key={index} className={`font-medium mb-2 whitespace-pre-line ${isPreview ? "text-sm" : ""}`}>{segment.value}</p>
                            );
                        }
                    }))}
                    <div className={`space-y-1 ${isPreview ? "text-xs" : "text-sm"}`}>
                        {question.options.map((option, optIndex) => (
                            <div
                                key={optIndex}
                                className={`p-2 rounded whitespace-pre-line ${optIndex === question.correctAnswer
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                    <p className={`text-slate-600 dark:text-slate-400 mt-2 ${isPreview ? "text-sm" : ""}`}>{question.explanation}</p>
                </>
            )}

        </div>
    )
}