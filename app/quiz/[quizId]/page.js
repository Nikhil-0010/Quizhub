'use server'
import React from 'react'
import QuizPage from '@/components/QuizPage';
import { fetchQuizData } from '@/actions/useractions.js';

const QuizId = async ({ params }) => {

    const quizId = (await params).quizId;
    const quizData = await fetchQuizData(quizId);
    // console.log(quizData);
    // console.log(quizData.endDate, new Date(), quizData.endDate < new Date());
    if (quizData.error) {
        return (
            <div>{quizData.error}</div>
        )
    }
    else if(!quizData.endless && quizData.endDate < new Date()){
        return (
            <div className='text-3xl font-light flex flex-col items-center gap-2 justify-center h-[90.4vh]'> Oops ≡ƒÿÉ  <span className='text-base'>Seems like quiz has expired..</span></div>
        )
    }

    return (
        <>
            <QuizPage quizData={quizData} />
        </>
    )
}

export default QuizId
