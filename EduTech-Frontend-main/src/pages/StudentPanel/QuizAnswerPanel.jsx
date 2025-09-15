import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Processing from '../../components/Processing';
import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
 
function QuizAnswerPanel() {
 
     // State to store fetched data (Newly added)
     const [quizResults, setQuizResults] = useState(null);
     const [template, setTemplate] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
 
    // Define difficulty scores
    const { i18n,t } = useTranslation();
    const mcqDifficultyScores = {
        easy: 1,
        medium: 3,
        hard: 5,
    };
 
    const descriptiveDifficultyScores = {
        easy: 3,
        medium: 5,
        hard: 10,
    };
 
    const numericalDifficultyScores = {
        easy: 3,
        medium: 5,
        hard: 10,
    };
 
    useEffect(() => {
        fetchData();
    },[]);

    useEffect(() => {
        sessionStorage.removeItem('adpid');
        sessionStorage.removeItem("adaptiveResult");
        sessionStorage.removeItem('first');
    })
 
    const fetchData = () => {
        const quizResultsData = JSON.parse(localStorage.getItem('quizResults'));
        const templateData = JSON.parse(localStorage.getItem('template'));
 
        if (quizResultsData && templateData) {
            setQuizResults(quizResultsData);
            setTemplate(templateData);
            setIsLoading(false);
        } else {
            console.error("Error: quizResults or template data not found in localStorage.");
            setIsLoading(false); // Avoid indefinite loading
        }
    };
 
 
    if (isLoading) {
        return <Processing/> // Show a loading message while data is fetched
    }
 
    if (!quizResults || !template) {
        return <p>{t('eutulqdpta')}</p>;
    }
 
    const mcqSection = template.find(sectionObj => sectionObj.MCQ);
    const descriptiveSection = template.find(sectionObj => sectionObj.Descriptive);
    const numericalSection = template.find(sectionObj => sectionObj.Numerical);
 
    // Get the number of MCQ, Descriptive, and Numerical questions
    const mcqCount = mcqSection?.MCQ?.length || 0;
    const descriptiveCount = descriptiveSection?.Descriptive?.length || 0;
    const numericalCount = numericalSection?.Numerical?.length || 0;
 
    const colorPallete = {
        "O": 'text-yellow-600',
        "A+": 'text-green-500',
        "A": 'text-green-300',
        "B+": 'text-yellow-500',
        "B": 'text-yellow-400',
        "C": 'text-black',
        "D": 'text-black',
        "E": 'text-red-400',
        "F": 'text-red-600',
    }
 
 
    function back(){
        localStorage.removeItem('quizResults');
        localStorage.removeItem('template');
        window.location.href=window.location.origin + '/student';
    }
 
    return (
        <div className="p-8 mx-28">
            <button
                onClick={() => back()} // Navigate to the previous page
                className="fixed top-4 text-[30px] left-4 gap-x-4 flex items-center text-black font-semibold px-4 py-2"
                >
                <IoIosArrowBack />
            </button>
 
            {/* Overall Quiz Result Box */}
            <div className="mb-8">
                <div className="custom-gradientBG text-white p-6 rounded-[30px] shadow-lg text-center">
                    <h1 className="text-4xl font-bold">{t('quizsummary')}</h1>
                    <p className="text-xl mt-4">{t('totalscore')} {quizResults.totalScore} / {quizResults.totalMarks}</p>
                    <p className="text-xl mt-4">{t('netpercentage')} {quizResults.totalPercentage.toFixed(2)}%</p>
                    <p className={`${colorPallete[quizResults.grade]} px-3 py-2 mx-auto bg-white rounded-[15px] border w-fit text-3xl mt-3 font-semibold`}>{quizResults.grade}</p>
                </div>
            </div>
 
            {/* Quiz Results Section */}
            {template.map((sectionObj, index) => {
                const sectionTitle = Object.keys(sectionObj)[0]; // 'MCQ', 'Descriptive', or 'Numerical'
                const questions = sectionObj[sectionTitle]; // Array of questions
 
                return (
                    <div key={index} className="pb-8">
                        <h2 className="text-2xl font-bold text-customBlue text-gray-700 mb-4 text-center">
                            {sectionTitle} {t('questions')}
                        </h2>
                        <div className="space-y-6">
                            {questions.map((question, qIndex) => {
                                // Fetch user score based on question type
                                const userScore = sectionTitle === 'MCQ'
                                    ? quizResults.MCQS.find(score => score.question === question.Question)
                                    : sectionTitle === 'Descriptive'
                                        ? quizResults.DESCRIPTIVE.find(score => score.question === question.Question)
                                        : quizResults.NUMERICAL.find(score => score.question === question.Question);
 
                                // Select the appropriate scoring map
                                const possibleScore = sectionTitle === 'MCQ'
                                    ? mcqDifficultyScores[question.difficulty] || 0
                                    : sectionTitle === 'Descriptive'
                                        ? descriptiveDifficultyScores[question.difficulty] || 0
                                        : numericalDifficultyScores[question.difficulty] || 0;
 
                                return (
                                    <div
                                        key={qIndex}
                                        className="flex flex-col bg-white p-4 rounded-[30px] border-2 shadow-md hover:shadow-lg" style={{ borderColor: '#2E5BFF' }}
                                    >
                                        <div className="md:flex-row-reverse gap-x-2 flex flex-col md:justify-between">
                                            <p className={`${question.difficulty === 'easy' ?
                                                ' text-green-700' : question.difficulty === 'medium' ?
                                                    ' text-yellow-700' : ' text-red-700'}
                                            } h-fit mb-2 font-semibold text-sm px-3 py-2  w-fit capitalize rounded-lg`}>{question.difficulty}</p>
                                            <p className="text-lg text-gray-800 md:w-11/12 font-semibold mb-2">
                                                Q{qIndex + 1}: {question.Question}
                                            </p>
                                        </div>
 
                                        {/* MCQ Options */}
                                        {question.options?.length > 0 && (
                                            <ul className="space-y-2">
                                                {question.options.map((option, oIndex) => (
                                                    <li key={oIndex} className="text-gray-600">
                                                        <span
                                                            name={`question-${qIndex}`}
                                                            id={`option-${qIndex}-${oIndex}`}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor={`option-${qIndex}-${oIndex}`}>
                                                            {oIndex + 1}. {option}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
 
                                        <div className="flex flex-col">
                                            {/* User's Answer */}
                                            <div className={`gap-x-2 p-3 rounded-[20px] text-sm flex-col flex md:shadow mt-3 ${userScore?.score > 0 ? 'bg-green-100 text-green-700 md:border-green-500' : 'bg-red-100 text-red-700 md:border-red-500'} md:border-2 md:p-3`}>
                                                <p className="font-semibold">{t('youranswer')}</p>
                                                <p>{sectionTitle === 'MCQ' ? <>{userScore?.userAnswer ? `Option ${userScore.userAnswer}: ${question.options[userScore.userAnswer - 1]}` : 'Not Answered'}</> : userScore?.userAnswer || 'Not Answered'}</p>
                                            </div>
 
                                            {/* Correct Answer */}
                                            {sectionTitle === 'MCQ' && (
                                                <div className="gap-x-2 p-3 rounded-[20px] text-sm bg-green-100 text-green-700 flex-col flex md:shadow mt-3 md:border-green-500 md:border-2 md:p-3">
                                                    <p className="font-semibold">{t('correctanswer')}</p>
                                                    <p>{sectionTitle === 'MCQ' ? `Option ${userScore.correctAnswer}: ${question.options[userScore.correctAnswer - 1]}` : userScore?.correctAnswer}</p>
                                                </div>
                                            )}
 
                                            {/* Feedback - only for Descriptive Questions */}
                                            {(sectionTitle === 'Descriptive' || sectionTitle === 'Numerical') && (
                                                <>
                                                    <div className="gap-x-2 p-3 rounded-[20px] text-sm bg-yellow-100 text-yellow-700 flex-col flex md:shadow mt-3 md:border-yellow-400 md:border-2 md:p-3">
                                                        <p className="font-semibold">{t('feedback')}</p>
                                                        <p>{userScore?.feedback}</p>
                                                    </div>
                                                    {sectionTitle === 'Descriptive' ? <div className='gap-x-2 p-3 rounded-[20px] text-sm bg-gray-100 text-gray-700 flex-col flex md:shadow mt-3 md:border-gray-400 md:border-2 md:p-3'>
                                                        <p className='font-semibold'>{t('strongtopics')}</p>
                                                        <p className='mb-2'>{userScore?.strong_topics}</p>
                                                        <p className='font-semibold'>{t('weaktopics')}</p>
                                                        <p className='mb-2'>{userScore?.weak_topics}</p>
                                                        <p className='font-semibold'> {userScore?.sentiment}</p>
                                                    </div> : null}
                                                </>
                                            )}
 
                                            {/* Score */}
                                            <div className="gap-x-2 p-3 rounded-[20px] text-sm bg-gray-100 text-gray-700 flex-col flex md:shadow mt-3 md:border-gray-400 md:border-2 md:p-3">
                                                <p className="font-semibold">{t('score')}</p>
                                                <p>{userScore?.score || 0} / {possibleScore}</p>
                                            </div>
                                            {(sectionTitle === 'Descriptive' && userScore.ratings) ? <div className='flex mt-3 flex-wrap gap-x-2'>
                                                <p className='px-3 py-2 text-sm border border-3 rounded-[15px] font-semibold border-gray-600'>{t('readability')} {userScore.ratings.readability} / 10</p>
                                                <p className='px-3 py-2 text-sm border border-3 rounded-[15px] font-semibold border-gray-600'>{t('grammar')} {userScore.ratings.grammar_correctness} / 10</p>
                                                <p className='px-3 py-2 text-sm border border-3 rounded-[15px] font-semibold border-gray-600'>{t('correctness')} {userScore.ratings.answer_correctness} / 10</p>
                                                <p className='px-3 py-2 text-sm border border-3 rounded-[15px] font-semibold border-gray-600'>{t('depth')} {userScore.ratings.depth_of_explanation} / 10</p>
                                                <p className='px-3 py-2 text-sm border border-3 rounded-[15px] font-semibold border-gray-600'>{t('relevance')} {userScore.ratings.relevance_and_conciseness} / 10</p>
                                            </div> : null}
                                        </div>                                  
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
 
            <div className="mt-8">
                <div className="custom-gradientBG text-white p-6 rounded-[30px] shadow-lg">
                    <h2 className="text-3xl font-bold text-center mb-6">{t('sectionscores')}</h2>
                    <div className="flex flex-row -mx-4 justify-around gap-x-4 px-4">
                        {/* MCQ Section */}
                        {mcqCount > 0 && (
                            <div className="bg-white p-6 rounded-[30px] shadow-lg w-1/3">
                                <h3 className="text-2xl font-semibold text-gray-700">{t('mcqscore')}</h3>
                                <p className="text-lg mt-4 text-black">
                                    {quizResults.mcqScore} / {quizResults.mcqTotalMarks}
                                </p>
                                <p className="text-md mt-2 text-gray-500">
                                    {t('percentage')} {quizResults.mcqPercentage.toFixed(2)}%
                                </p>
                            </div>
                        )}
 
                        {/* Descriptive Section */}
                        {descriptiveCount > 0 && (
                            <div className="bg-white p-6 rounded-[30px] shadow-lg w-1/3">
                                <h3 className="text-2xl font-semibold text-gray-700">{t('descriptivescore')}</h3>
                                <p className="text-lg mt-4 text-black">
                                    {quizResults.descriptiveScore} / {quizResults.descriptiveTotalMarks}
                                </p>
                                <p className="text-md mt-2 text-gray-500">
                                    {t('percentage')} {quizResults.descriptivePercentage.toFixed(2)}%
                                </p>
                            </div>
                        )}
 
                        {/* Numerical Section */}
                        {numericalCount > 0 && (
                            <div className="bg-white p-6 rounded-[30px] shadow-lg w-1/3">
                                <h3 className="text-2xl font-semibold text-gray-700">{t('numericalscore')}</h3>
                                <p className="text-lg mt-4 text-black">
                                    {quizResults.numericalScore} / {quizResults.numericalTotalMarks}
                                </p>
                                <p className="text-md mt-2 text-gray-500">
                                    {t('percentage')} {quizResults.numericalPercentage.toFixed(2)}%
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default QuizAnswerPanel;