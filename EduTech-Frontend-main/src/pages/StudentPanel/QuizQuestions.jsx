import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-hot-toast';
import Processing from '../../components/Processing';
import { postAPI } from '../../caller/axiosUrls';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
 
function QuizQuestions({ template, qid, onSubmit }) {
    const { i18n,t } = useTranslation();
    const [isExamActive, setIsExamActive] = useState(true);
    const [responses, setResponses] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [quizResults, setQuizResults] = useState(null);
 
    const navigate = useNavigate();
 
    // Ref to scroll to the top
    const topRef = useRef(null);
 
    const language = i18n.language;
 
    const listLang = {
        'en': 'english',
        'ar': 'arabic',
        'pl': 'polish',
        'hi': 'hindi'
    }
 
    // Handle change for MCQ radio buttons
    const handleRadioChange = (questionId, optionIndex, optionValue) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: { optionIndex, optionValue } // Storing both index and value
        }));
    };
 
    // Handle change for Descriptive text areas
    const handleTextChange = (questionId, event) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: event.target.value
        }));
    };
 
    // Open confirmation modal
    const handleSubmit = (event) => {
        event.preventDefault();
        setShowModal(true);
    };
 
    // Confirm submission
    const handleConfirmSubmit = async () => {
        setProcessing(true);
        setShowModal(false);
        try {
            const formattedResponses = {
                questions: {
                    MCQ: [],
                    Descriptive: [],
                    Numerical: []
                },
                langauge: listLang[language]
            };
 
            template.forEach(sectionObj => {
                const sectionTitle = Object.keys(sectionObj)[0]; // 'MCQ' or 'Descriptive'
                const questions = sectionObj[sectionTitle]; // Array of questions
 
                questions.forEach((question, qIndex) => {
                    const questionId = `${sectionTitle}-${qIndex}`;
                    const userResponse = responses[questionId];
 
                    if (sectionTitle === 'MCQ') {
                        formattedResponses.questions.MCQ.push({
                            Question: question.Question,
                            difficulty: question.difficulty,
                            userAnswer: (userResponse.optionIndex + 1).toString() // Option number (1-based index)
                        });
                    } else if (sectionTitle === 'Descriptive') {
                        formattedResponses.questions.Descriptive.push({
                            Question: question.Question,
                            difficulty: question.difficulty,
                            userAnswer: userResponse
                        });
                    } else if (sectionTitle === 'Numerical') {
                        formattedResponses.questions.Numerical.push({
                            Question: question.Question,
                            difficulty: question.difficulty,
                            userAnswer: userResponse
                        });
                    }
                });
            });
 
            if (onSubmit) await onSubmit(t('testsubmitted'));
            const responsebackend = await postAPI(`/quiz/submit-quiz?quizID=${qid}`, formattedResponses);
            console.log("response --> ",responsebackend);
            setQuizResults(responsebackend); // Set quiz results
            toast.success(t('quizsubmittedsuccessfully'));
            setIsExamActive(false);
           
            // Lines added
            localStorage.setItem('quizResults', JSON.stringify(responsebackend));
            localStorage.setItem('template', JSON.stringify(template));
            location.href=`/student/summary`;
        } catch (error) {
            toast.error(error.message);
        } finally {
            setProcessing(false);
        }
    };
 
    // Cancel submission
    const handleCancelSubmit = () => {
        setShowModal(false);
    };
 
    // Scroll to the top when quiz results are available
    useEffect(() => {
        if (!isExamActive && quizResults) {
            topRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [quizResults, isExamActive]);
 
    return (
        <>
            {/* Add a div at the top of the component to serve as a scroll target */}
            <div ref={topRef}></div>
 
            {isExamActive &&
                <form onSubmit={handleSubmit}>
                    <div>
                        {processing ? <Processing /> : null}
                        {template.map((sectionObj, index) => {
                            const sectionTitle = Object.keys(sectionObj)[0]; // 'MCQ' or 'Descriptive'
                            const questions = sectionObj[sectionTitle]; // Array of questions
 
                            return (
                                <div key={index} className="pb-8">
                                    <h2 className="text-2xl font-bold text-customBlue mb-4 text-center">
                                        {sectionTitle} {t('questions')}
                                    </h2>
                                    <div className="space-y-6">
                                        {questions.map((question, qIndex) => {
                                            const questionId = `${sectionTitle}-${qIndex}`; // Unique identifier for the question
 
                                            return (
                                                <div
                                                    key={questionId}
                                                    className="flex flex-col bg-white p-4 rounded-[30px] border-2 shadow-md hover:shadow-lg" style={{ borderColor: '#2E5BFF' }}
 
                                                >
                                                    <div className="md:flex-row-reverse gap-x-2 flex flex-col md:justify-between">
                                                        <p className={`${question.difficulty === 'easy' ?
                                                            ' text-green-700' : question.difficulty === 'medium' ?
                                                                ' text-yellow-700' : 'text-red-700'}
                                                        } h-fit mb-2 font-semibold text-sm px-3 py-2  w-fit capitalize rounded-lg`}>{question.difficulty}</p>
                                                        <p className="text-lg text-gray-800 md:w-11/12 font-semibold mb-2">
                                                            {t('questions')} {qIndex + 1} : {question.Question}
                                                        </p>
                                                    </div>
 
                                                    {/* Render MCQ options with radio buttons */}
                                                    {sectionTitle === 'MCQ' && question.options?.length > 0 && (
                                                        <ul className="space-y-2">
                                                            {question.options.map((option, oIndex) => (
                                                                <li key={oIndex} className="text-gray-600 font-semibold">
                                                                    <input
                                                                        type="radio"
                                                                        name={questionId}
                                                                        disabled={processing}
                                                                        id={`option-${questionId}-${oIndex}`}
                                                                        value={option}
                                                                        checked={responses[questionId]?.optionValue === option}
                                                                        onChange={() => handleRadioChange(questionId, oIndex, option)}
                                                                        className="mr-2"
                                                                        required
                                                                    />
                                                                    <label htmlFor={`option-${questionId}-${oIndex}`}>
                                                                        {option}
                                                                    </label>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
 
                                                    {/* Render text area for Descriptive and Numerical questions */}
                                                    {(sectionTitle === 'Descriptive' || sectionTitle === 'Numerical') && (
                                                        <textarea
                                                            disabled={processing}
                                                            className="w-full mt-4 p-4 border rounded-[30px]"
                                                            rows="5"
                                                            placeholder={t('wyah')}
                                                            maxLength={2000}
                                                            value={responses[questionId] || ''}
                                                            onChange={(event) => handleTextChange(questionId, event)}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="custom-button rounded-[15px] w-full mb-10"
                    >
                        {t('submitquiz')}
                    </button>
                </form>
            }
 
            {showModal ? <div className="fixed bg-black w-screen opacity-50 h-screen top-0 left-0 z-30"></div> : null}
 
            {/* Confirmation Modal */}
            <Modal
                show={showModal}
                onHide={handleCancelSubmit}
                backdrop="static"
                keyboard={false}
                className='z-30'
                centered
            >
                <Modal.Header className="flex justify-center">
                    <Modal.Title className="text-center text-xl font-semibold">{t('confirmsubmission')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center text-gray-700">
                    {t('aysywtstq')}
                </Modal.Body>
 
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        disabled={processing}
                        onClick={handleCancelSubmit}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-[20px] border-none"
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        disabled={processing}
                        onClick={handleConfirmSubmit}
                        className="bg-customBlue bg-customHover text-white font-semibold py-2 px-4 rounded-[20px] border-none"
                    >
                        {t('confirm')}
                    </Button>
                </Modal.Footer>
            </Modal>
 
            {/* Render the QuizAnswerPanel component with quizResults */}
            {/* {!isExamActive && quizResults && (
                <div className="quiz-results-container">
                    <QuizAnswerPanel quizResults={quizResults} template={template}/>
                </div>
            )} */}
        </>
    );
}
 
export default QuizQuestions;