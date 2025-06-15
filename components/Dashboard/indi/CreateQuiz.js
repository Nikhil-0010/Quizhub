'use client';
import { getUserId, storeQuizData } from '@/actions/useractions.js';
import { useSession } from 'next-auth/react';
import React, { useRef, useState } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';

const CreateQuiz = () => {
    const { data: session } = useSession();

    const [create, setCreate] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [mcqs, setMcqs] = useState([
        { question: '', options: ['', '', '', ''], correctAnswer: '', marks: '' },
    ]);

    const toggleCreate = () => {
        setCreate((prevState) => !prevState);
        setSuccessMessage(''); // Clear any previous success message
        setErrors({}); // Clear errors on toggle
    };

    // console.log(getUserId(session.user.email))

    function convertToMongoDate(inputDate) {
        const [day, month, year] = inputDate.split('/').map(Number); // Split and convert to numbers
        return new Date(year, month - 1, day); // Month is 0-indexed
    }

    const handleChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('mc_')) {
            // Update multiple choice question options dynamically
            const updatedQuestions = [...mcqs];
            const [_, category, i] = name.split('_'); // Better destructuring
            if (category === "question") updatedQuestions[index].question = value;
            else if (category === "correctAnswer") updatedQuestions[index].correctAnswer = value;
            else updatedQuestions[index].options[category] = value;
            setMcqs(updatedQuestions);

        } else if (name.startsWith('marks')) {
            const updatedQuestions = [...mcqs];
            updatedQuestions[index].marks = value;
            setMcqs(updatedQuestions);
        }
        else setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddQuestion = () => {
        setMcqs([
            ...mcqs,
            { question: '', options: ['', '', '', ''], correctAnswer: '', marks: '' },
        ]);
    };

    const handleDeleteQuestion = (index) => {
        const updatedMcqs = mcqs.filter((_, i) => i !== index);
        setMcqs(updatedMcqs);
        //clear of that index
        const newErrors = { ...errors };
        delete newErrors[`question_${index}`];
        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title?.trim()) newErrors.title = 'Quiz title is required';
        if (!formData.subject?.trim()) newErrors.subject = 'Subject is required';
        if (!formData.endless && !formData.endDate?.trim()) newErrors.endDate = 'End date is required';

        mcqs.forEach((mcq, index) => {
            if (!newErrors[`question_${index}`]) {
                newErrors[`question_${index}`] = {};
            }
            if (!mcq.question.trim()) newErrors[`question_${index}`].question = `Question ${index + 1} is required`;
            if (!mcq.options.every(opt => opt.trim())) newErrors[`question_${index}`].option = `All options for Q${index + 1} must be filled`;
            if (!mcq.correctAnswer?.trim()) newErrors[`question_${index}`].correctAnswer = `Correct answer for question ${index + 1} is required`;
            if (!mcq.marks || isNaN(Number(mcq.marks)) || Number(mcq.marks) <= 0) {
                newErrors[`question_${index}`].marks = `Valid marks for question ${index + 1} are required`;
            }
        });
        // console.log(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        
        if (Object.values(validationErrors).some(error => typeof error === 'object' ? Object.keys(error).length > 0 : error)) {
            setErrors(validationErrors);
            return;
        }
        
        const userId = await getUserId(session.user.email);
        const quizData = {
            creater: userId,
            title: formData.title.charAt(0).toUpperCase() + formData.title.slice(1).toLowerCase(),
            subject: formData.subject.charAt(0).toUpperCase() + formData.subject.slice(1).toLowerCase(),
            endless: formData.endless,
            endDate: formData.endless ? null : convertToMongoDate(formData.endDate),
            questions: mcqs.map((mcq) => ({
                questionText: mcq.question,
                options: mcq.options.map((option, index) => ({
                    text: option,
                    isCorrect: mcq.correctAnswer === option, // Mark the correct option
                })),
                marks: mcq.marks,
            })),
        };

        const quiz = await storeQuizData(quizData);
        // console.log(quiz);
        // console.log('Quiz submitted:', formData, mcqs);
        // console.log('Quiz submitted:', quiz);


        // setSuccessMessage('Quiz successfully created!');
        toast.success('Quiz successfully created!', {
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
        // Clear form data and mcqs
        setFormData({});
        setMcqs([
            { question: '', options: ['', '', '', ''], correctAnswer: '', marks: '' },
        ]);
        
        toggleCreate();
    };

    return (
        <>
            {!create ?

                <div className="menu-section h-full w-full">
                    <h3 className='text-2xl text-center mb-2 font-bold'>Create a Quiz</h3>
                    <button onClick={toggleCreate} className="bg-[#FF4F1F] hover:bg-[#e64400] transition-all hover:rounded-3xl duration-200 text-white w-24 h-9 rounded-md mx-auto block">
                        Create
                    </button>
                </div> :

                        <div className="quizSection flex flex-col gap-4">
                            <div className="heading flex justify-between">
                                <h3 className="text-lg underline font-bold">Enter quiz details</h3>
                                <button onClick={toggleCreate} className='w-20 h-9 bg-red-600 transition-all hover:bg-red-700 hover:rounded-3xl duration-200 rounded-md text-white'>Cancel</button>
                            </div>
                            {/* {successMessage && <p className="text-green-500">{successMessage}</p>} */}
                            <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
                                <div className="flex md:flex-row flex-col justify-center gap-4 md:gap-16 border-b-2 border-orange-400 dark:border-neutral-600 pb-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-1 md:gap-2">
                                            <label htmlFor="title">Quiz title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title ? formData.title : ""}
                                                placeholder="Quiz Title"
                                                className="border-[1.4px] dark:border-neutral-600 dark:focus:border-orange-400 bg-transparent px-2 py-1 rounded focus:border-orange-400 outline-none border-gray-300"
                                                onChange={handleChange}
                                            />
                                            {errors.title && <p className="text-red-500 text-xs mt-2">{errors.title}</p>}
                                        </div>
                                        <div className="flex flex-col gap-1 md:gap-2">
                                            <label htmlFor="subject">Subject</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject ? formData.subject : ""}
                                                placeholder="Subject"
                                                className="border-[1.4px] dark:border-neutral-600 dark:focus:border-orange-400 bg-transparent px-2 py-1 rounded focus:border-orange-400 outline-none border-gray-300"
                                                onChange={handleChange}
                                            />
                                            {errors.subject && <p className="text-red-500 text-xs mt-2">{errors.subject}</p>}
                                        </div>
                                    </div>
                                    <fieldset>
                                        <legend>Validity</legend>
                                        <div className="flex flex-col gap-2 md:flex-row md:gap-6 md:items-center pt-2">
                                            <div id="validity" className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="endless"
                                                    id="endless"
                                                    className="cursor-pointer "
                                                    checked={formData.endless ? formData.endless : false}
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor="endless">Till you close</label>
                                            </div>
                                            <span>or</span>
                                            <div>
                                                <label htmlFor="endDate">Enter date:</label>
                                                <input
                                                    type="text"
                                                    name="endDate"
                                                    id="endDate"
                                                    placeholder="dd/mm/yyyy"
                                                    className="border-[1.4px] dark:border-neutral-600 dark:focus:border-orange-400 bg-transparent disabled:bg-gray-200 dark:disabled:bg-neutral-700 px-2 py-1 rounded ml-2 focus:border-orange-400 outline-none disabled:border-gray-300 border-gray-300"
                                                    value={formData.endDate ? formData.endDate : ""}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
                                                        if (e.target.value === "" || regex.test(e.target.value)) {
                                                            setErrors((prevErrors) => {
                                                                const { endDate, ...rest } = prevErrors;
                                                                return rest;
                                                            });
                                                        } else {
                                                            setErrors((prevErrors) => ({
                                                                ...prevErrors,
                                                                endDate: "Invalid date format. Use dd/mm/yyyy.",
                                                            }));
                                                        }
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (isNaN(e.key) && e.key !== "/") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    disabled={formData.endless ? formData.endless : false}
                                                />
                                                {errors.endDate && <p className="text-red-500 text-xs mt-2">{errors.endDate}</p>}
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <label htmlFor="questions font-bold">Questions</label>
                                <AnimatePresence>
                                <div id='questions' className="questions flex flex-col gap-6 mt-2">
                                    {/* Multiple choice Question */}
                                    {mcqs.map((mcq, index) => (
                                        <motion.div
                                            initial={{ opacity:0, x:-50 }}
                                            animate={{ opacity:1, x:0 }}
                                            exit={{ opacity:0, x:50 }}
                                            transition={{ duration:0.3 }}
                                            layout
                                            key={index} className="flex flex-col md:flex-row gap-6 lg:gap-12 shadow-md dark:shadow-neutral-950 p-3 sm:p-6 rounded-lg border-[1.4px] dark:border-neutral-600 dark:focus:border-orange-400 dark:bg-neutral-800 bg-slate-50">
                                            {/* MCQ */}
                                            <div className='flex flex-col gap-2 w-full'>
                                                {/* question */}
                                                <div className=" question flex items-center gap-2 w-full">
                                                    <label htmlFor={`question_${index + 1}`}>Q{index + 1}.</label>
                                                    <input
                                                        type="text"
                                                        name={`mc_question_${index}`}
                                                        value={mcq.question}
                                                        id={`question_${index + 1}`}
                                                        autoComplete='off'
                                                        placeholder="Enter question"
                                                        className="border-b-[1.4px] dark:border-neutral-600 dark:focus:border-orange-400 bg-transparent px-2 py-1 focus:border-orange-400 outline-none border-gray-300 w-full"
                                                        onChange={(e) => handleChange(e, index)}
                                                    />
                                                </div>
                                                {errors[`question_${index}`]?.question && <p className="text-red-500 text-xs mt-2">{errors[`question_${index}`]?.question}</p>}
                                                {/* options */}
                                                <div className="options pl-3 md:pl-10 flex flex-col gap-2">
                                                    {mcq.options.map((option, optIndex) => (
                                                        <div key={optIndex} className="flex items-center gap-2 w-full">
                                                            <label htmlFor={`option_${optIndex + 1}`}>{String.fromCharCode(65 + optIndex)}</label>
                                                            <input
                                                                type="text"
                                                                name={`mc_${optIndex}_${index}`}
                                                                value={option}
                                                                id={`option_${optIndex + 1}`}
                                                                autoComplete='off'
                                                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                                                className="border-[1.4px] dark:border-neutral-600 dark:focus:border-orange-400 bg-transparent px-2 py-1 rounded focus:border-orange-400 outline-none border-gray-300 w-full"
                                                                onChange={(e) => handleChange(e, index)}
                                                            />
                                                        </div>

                                                    ))}
                                                    {errors[`question_${index}`]?.option && <p className="text-red-500 text-xs mt-2">{errors[`question_${index}`]?.option}</p>}
                                                </div>
                                                {/* <div className="correct_option flex items-center gap-2">
                                        <label className='' htmlFor={`correctAnswer_${index}`}>Correct Option</label>
                                        <input
                                            type="text"
                                            name={`mc_correctAnswer_${index}`}
                                            value={mcq.correctAnswer}
                                            placeholder="Enter correct option"
                                            className="border-b-[1.4px] px-2 py-1 focus:border-orange-400 outline-none border-gray-300 "
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </div> */}
                                                <select
                                                    name={`mc_correctAnswer_${index}`}
                                                    value={mcq.correctAnswer}
                                                    onChange={(e) => handleChange(e, index)}
                                                    className="border-[1.4px] dark:border-neutral-600 dark:focus:border-orange-400 dark:bg-neutral-800  p-1 rounded focus:border-orange-400 outline-none bg-transparent border-gray-300"
                                                >
                                                    <option value="">Select correct option</option>
                                                    {mcq.options.map((option, optIndex) => (
                                                        <option key={optIndex} value={option}>
                                                            {`${String.fromCharCode(65 + optIndex)} : ${option}`}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[`question_${index}`]?.correctAnswer && (
                                                    <p className="text-red-500 text-xs mt-2">{errors[`question_${index}`]?.correctAnswer}</p>
                                                )}

                                                {errors[`question_${index}`]?.marks && <p className="text-red-500 text-xs mt-2">{errors[`question_${index}`]?.marks}</p>}
                                            </div>
                                            {/* Modify */}
                                            <div className="modify flex flex-col gap-2 items-end">
                                                {/* <button className="edit bg-[#FF4F1F] text-white w-20 h-9 rounded ">Edit</button> */}
                                                <div className='flex md:flex-col flex-row gap-2 items-center md:items-start'><label htmlFor=''>Marks</label>
                                                    <input
                                                        type="number"
                                                        name={`marks_${index}`}
                                                        value={mcq.marks}
                                                        placeholder="Enter marks"
                                                        onChange={(e) => handleChange(e, index)}
                                                        className="border-[1.4px] dark:border-neutral-600 dark:focus:border-orange-400 bg-transparent px-2 py-1 rounded focus:border-orange-400 outline-none border-gray-300"
                                                    /></div>
                                                <button onClick={(e) => {e.preventDefault(); handleDeleteQuestion(index)}} className="delete bg-[#FF4F1F] hover:bg-[#e64400] text-white w-20 h-9 rounded-md ">Delete</button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                    </AnimatePresence>
                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="bg-[#FF4F1F] hover:bg-[#e64400] text-white w-24 h-9 rounded-md mt-4"
                                >
                                    Add MCQ
                                </button>
                                <button type="submit" className="bg-[#FF4F1F] hover:bg-[#e64400] text-white w-20 h-9 rounded-md">
                                    Submit
                                </button>
                            </form>
                        </div>
            }
        </>
    );
}

export default CreateQuiz;
