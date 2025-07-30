"use client"

import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export function ManualCreation({ onAddQuestion }) {
    const [question, setQuestion] = useState("")
    const [options, setOptions] = useState(["", "", "", ""])
    const [correctAnswer, setCorrectAnswer] = useState("0")
    const [explanation, setExplanation] = useState("")
    const [marks, setMarks] = useState(0);
    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {}
        if (!question.trim()) errs.question = "Question is required."
        if (options.some((opt) => !opt.trim())) errs.options = "All options are required."
        if (options.length < 2) errs.options = "At least 2 options are required."
        if (
            Number.isNaN(Number.parseInt(correctAnswer)) ||
            !options[Number.parseInt(correctAnswer)]?.trim()
        ) {
            errs.correctAnswer = "Select a valid correct answer."
        }
        return errs
    }

    const handleAddOption = () => {
        setOptions([...options, ""])
    }

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index)
            setOptions(newOptions)
            if (Number.parseInt(correctAnswer) >= newOptions.length) {
                setCorrectAnswer("0")
            }
        }
    }

    const handleOptionChange = (index, value) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleSubmit = () => {
        const errs = validate()
        setErrors(errs)
        if (Object.keys(errs).length === 0) {
            const newQuestion = {
                id: "",
                question: question.trim(),
                options: options.filter((opt) => opt.trim()),
                correctAnswer: Number.parseInt(correctAnswer),
                explanation: explanation.trim() || undefined,
                marks: Number.parseInt(marks) || undefined,
                source: "manual",
            }
            console.log(newQuestion)
            onAddQuestion(newQuestion)
            setQuestion("")
            setOptions(["", "", "", ""])
            setCorrectAnswer("0")
            setExplanation("")
            setErrors({})
        }
    }

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 border border-slate-300 rounded-lg p-6 shadow-sm mx-auto">
            <h2 className="font-bold text-2xl mb-4">Create Question Manually</h2>
            <div className="mb-4">
                <label htmlFor="question" className="block font-medium mb-2">Question</label>
                <textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full min-h-[80px] p-2 border border-[#ccc] rounded-md"
                />
                {errors.question && (
                    <div className="text-red-500 text-xs mt-1">{errors.question}</div>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-1">Answer Options</label>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="radio"
                            name="correctAnswer"
                            value={index}
                            checked={correctAnswer === index.toString()}
                            onChange={() => setCorrectAnswer(index.toString())}
                            className="mr-2"
                            id={`option-${index}`}
                        />
                        <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="text-sm flex-1 p-2 border border-[#ccc] rounded-md mr-2"
                        />
                        {options.length > 2 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="text-[#ef4444] font-bold cursor-pointer"
                                title="Remove option"
                            >
                                <Trash2 className='w-4 h-4' />
                            </button>
                        )}
                    </div>
                ))}
                {errors.options && (
                    <div className="text-red-500 text-xs mt-1">{errors.options}</div>
                )}
                {errors.correctAnswer && (
                    <div className="text-red-500 text-xs mt-1">{errors.correctAnswer}</div>
                )}
                {options.length < 6 && (
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="w-full py-2 mt-2 flex items-center justify-center gap-4 rounded-md border border-slate-300"
                    >
                        <Plus className="w-4 h-4 font-bold" /> Add Option
                    </button>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="explanation" className="block mb-2">
                    Explanation (Optional)
                </label>
                <textarea
                    id="explanation"
                    placeholder="Provide an explanation for the correct answer..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full min-h-[60px] p-2 border border-[#ccc] rounded-md"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="marks" className="block mb-2">
                    Marks
                </label>
                <input
                    type="number"
                    id="marks"
                    placeholder="Enter marks for the question..."
                    value={marks}
                    min={0}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full p-2 border border-[#ccc] rounded-md"
                />
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-orange-500  to-orange-600 text-white rounded-md py-2 font-semibold  cursor-pointer opacity-100"
            >
                Add Question
            </button>
        </div>
    )
}
