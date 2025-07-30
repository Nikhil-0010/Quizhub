"use client"

import { useState, useEffect } from "react"
import { Brain, Sparkles, Plus, X } from "lucide-react"
import { toast, Bounce } from "react-toastify";
import QuestionPreview from "./QuestionPreview";


const Popup = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Info</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="max-h-60 text-sm overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}


export function AIGeneration({ onAddMultipleQuestions }) {
    const [topic, setTopic] = useState("")
    const [difficulty, setDifficulty] = useState("")
    const [numQuestions, setNumQuestions] = useState("5")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedQuestions, setGeneratedQuestions] = useState([])
    const [showPreview, setShowPreview] = useState(false)
    const [marksError, setMarksError] = useState([]);
    const [customEnabled, setCustomEnabled] = useState(false)
    const [customPrompt, setCustomPrompt] = useState("")
    const [showPopup, setShowPopup] = useState(false);
    const [generationVersion, setGenerationVersion] = useState(0);



    useEffect(() => {
        if (generatedQuestions?.length > 0) {
            const ids = generatedQuestions.map(q => q.id);
            setMarksError([...ids]);
            setShowPopup(true);
        }
        return () => {
            setMarksError([]);
        }
    }, [generationVersion]);

    async function generateQuiz(prompt) {
        const res = await fetch('/api/quiz/generate-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        })

        const data = await res.json();
        console.log(data);
        return data;
    }

    const handleGenerate = async () => {
        if (!customEnabled && (!topic.trim() || !difficulty)) return

        const prompt = {
            mode: customEnabled ? 'custom' : 'guided',
            topic,
            difficulty,
            numQuestions,
            userPrompt: customEnabled ? customPrompt : '',
        }

        console.log(prompt)

        setIsGenerating(true)
        setShowPreview(false)

        const data = await generateQuiz(prompt);

        if (data.error) {
            toast.error("Something went wrong", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }

        // await new Promise((resolve) => setTimeout(resolve, 2000))

        // const mockQuestions = Array.from({ length: Number.parseInt(numQuestions) }, (_, i) => ({
        //     question: `${topic} question ${i + 1}: What is the main concept related to ${topic.toLowerCase()}?`,
        //     options: [`Correct answer for ${topic}`, `Incorrect option A`, `Incorrect option B`, `Incorrect option C`],
        //     correctAnswer: 0,
        //     explanation: `This is the explanation for the ${topic} question ${i + 1}.`,
        //     source: "ai",
        //     id: (Date.now() + i).toString(36) + Math.random().toString(36).substring(2, 15),
        // }))

        setGeneratedQuestions(data.questions)
        // setGeneratedQuestions(mockQuestions);
        setGenerationVersion((prev) => prev + 1);
        setIsGenerating(false);
        setShowPreview(true);
    }

    const handleAddToQuiz = () => {
        if (marksError.length > 0) {
            setShowPopup(true)
            return;
        }
        onAddMultipleQuestions(generatedQuestions)
        setGeneratedQuestions([])
        setShowPreview(false)
        setTopic("")
        setDifficulty("")
        setNumQuestions("5")
    }

    return (
        <div className="space-y-6">
            <Popup
                show={showPopup}
                onClose={() => setShowPopup(false)}
                children={"Please ensure all questions have valid marks assigned before proceeding."}
            />
            <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700 shadow-sm">
                <div className="p-6">
                    <div className="flex items-center space-x-2 text-2xl leading-none tracking-tight font-semibold">
                        <Brain className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>AI-Powered Quiz Generation</span>
                        <span className="hidden sm:block ml-2 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">New</span>
                    </div>
                </div>
                <div className="p-6 pt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="topic" className="block text-sm leading-none font-medium">Topic</label>
                            <input
                                id="topic"
                                className="w-full h-10 text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                                placeholder="e.g., JavaScript, History, Biology"
                                disabled={customEnabled}
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="difficulty" className="block text-sm leading-none font-medium">Difficulty</label>
                            <select
                                id="difficulty"
                                className="w-full h-10 flex items-center justify-between text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                                value={difficulty}
                                disabled={customEnabled}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="">Select difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="numQuestions" className="block text-sm leading-none font-medium">Number of Questions</label>
                        <select
                            id="numQuestions"
                            className="w-full h-10 text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                            value={numQuestions}
                            disabled={customEnabled}
                            onChange={(e) => setNumQuestions(e.target.value)}
                        >
                            <option value="3">3 Questions</option>
                            <option value="5">5 Questions</option>
                            <option value="10">10 Questions</option>
                            <option value="15">15 Questions</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <input
                                type="checkbox"
                                id="customEnabled"
                                name="customEnabled"
                                checked={customEnabled}
                                className="cursor-pointer scale-90"
                                onChange={(e) => setCustomEnabled(e.target.checked)}
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Want to use your own custom prompt? (Full flexibility)</span>
                        </div>
                        <div className={`space-y-2 ${customEnabled ? 'block' : 'hidden'}`}>
                            <textarea
                                className={`w-full border rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${customEnabled ? '' : 'hidden'}`}
                                rows="4"
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="Enter your custom prompt here..."
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!customEnabled && (!topic.trim() || !difficulty) || isGenerating}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white text-sm font-medium transition
                            ${isGenerating
                                ? "bg-gradient-to-r from-purple-400 to-blue-400 opacity-70 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"}
                        `}
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                                Generating Quiz...
                            </>
                        ) : (
                            <>
                                <Brain className="h-4 w-4 mr-2" />🎯 Generate Quiz with AI
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isGenerating && (
                <div className="rounded-lg border shadow-sm">
                    <div className="p-6">
                        <div className="text-xl font-semibold">Generating Questions...</div>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        {Array.from({ length: Number.parseInt(numQuestions) }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                                <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                                <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Preview Generated Questions */}
            {showPreview && generatedQuestions?.length > 0 && (
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="p-6 ">
                        <div className="flex items-center justify-between text-xl font-semibold">
                            <span>Generated Questions Preview</span>
                            <span className="px-2.5 py-0.5 rounded-full font-semibold border text-xs">{generatedQuestions.length} questions</span>
                        </div>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        {generatedQuestions.map((q, index) => (
                            <div key={index} className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm mb-2">
                                <QuestionPreview question={q} index={index} setGeneratedQuestions={setGeneratedQuestions} setMarksError={setMarksError} />
                            </div>
                        ))}
                        <div className="flex space-x-3 pt-4">
                            <button
                                onClick={handleAddToQuiz}
                                className="flex-1 flex items-center justify-center px-4 py-2 rounded-md text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add All to Quiz
                            </button>
                            <button
                                className=" flex items-center justify-center px-4 py-2 rounded-md border font-semibold hover:bg-slate-100"
                                onClick={() => setShowPreview(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
