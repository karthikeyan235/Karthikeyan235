import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { postAPI } from "../../caller/axiosUrls";
import { useParams } from 'react-router-dom';

const AdaptiveQuiz = () => {
    const [responses, setResponses] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(true);
    const [question, setQuestion] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [finalResult, setFinalResult] = useState([]);
    const [loadingText, setLoadingText] = useState("");
    const { t } = useTranslation();
    const { qid } = useParams();
    const [adpid, setAdpid] = useState(sessionStorage.getItem("adpid") || "");
    const isFirstLoad = sessionStorage.getItem("first") !== "1";

    const lines = ["Sit tight!", "Hold Up!", "Loading...", "Hang on..."];

    useEffect(() => {
        setLoadingText(lines[0]);
        let i = 0;
        if (processing) {
            const interval = setInterval(() => {
                setLoadingText(lines[i++]);
                if (i === lines.length) i = 0;
            }, 2000);
            return () => clearInterval(interval);
        } 
    }, [processing]);

    const handleCancelSubmit = () => {
        setShowModal(false);
    };

    const fetchResult = async () => {
        setProcessing(true);

        try {
            const response = await postAPI(`/quiz/submitAdaptiveQuiz`, { adaptiveQuizId: adpid });
            sessionStorage.setItem('adaptiveResult', JSON.stringify(response.data));
            window.location.href = '/student/adaptive-quiz/result';
        } catch (error) {
            toast.error(error.message);
        } finally {
            setProcessing(false);
        }
    }

    const getQuestion = async () => {
        setProcessing(true);

        try {
            const payload = isFirstLoad || !responses.optionValue ? { quizId: qid } : { 
                quizId: qid,
                adaptiveQuizId: adpid,
                userAnswer: (responses.optionIndex + 1).toString(),
            };
            const response = await postAPI(`/quiz/getNextQuestion`, payload);

            if (isFirstLoad) {
                sessionStorage.setItem("adpid", response.question.currentAdaptiveQuizId);
                sessionStorage.setItem("first", "1");
                setAdpid(response.question.currentAdaptiveQuizId);
            }

            if (response.isCompleted) {
                setProcessing(true);
                setCompleted(true);
                toast.success("Quiz completed!")
                toast("Analyzing result...")
                await fetchResult();
            } else setQuestion(response.question);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setProcessing(false);
            setResponses({});
        }
    };

    const handleConfirmSubmit = async () => {
        setProcessing(true);

        try {
            setShowModal(false);
            await getQuestion();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleRadioChange = (optionIndex, optionValue) => {
        setResponses({ optionIndex, optionValue });
    };

    useEffect(() => {
        getQuestion();
    }, []);    

    return (
        <div className="relative flex flex-col justify-center items-center w-full h-screen">
            {/* Confirmation Modal */}
            <Modal
                show={showModal}
                onHide={handleCancelSubmit}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header>
                    <Modal.Title className="text-center mx-auto text-xl font-semibold">
                        {t("confirmsubmission")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center text-gray-700">
                    Are you sure? You cannot revert this step after!
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        disabled={processing}
                        onClick={handleCancelSubmit}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="primary"
                        disabled={processing}
                        onClick={handleConfirmSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                        {t("confirm")}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Quiz Content */}
            <div className="adaptive cust-shadow py-10 px-4 flex justify-center items-center rounded-2xl w-[60%] h-[80%] z-10">
                <div className="relative flex flex-col px-5 py-4 rounded-2xl w-full h-full bg-white shadow-md">
                    {processing || completed || !question ? (
                        <Loader text={loadingText} />
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row-reverse gap-x-2 md:justify-between">
                                <p
                                    className={`${
                                        question?.Difficulty === "easy"
                                            ? "text-green-700"
                                            : question?.Difficulty === "medium"
                                            ? "text-yellow-700"
                                            : "text-red-700"
                                    } font-semibold text-sm px-3 py-2 capitalize rounded-lg`}
                                >
                                    {question?.Difficulty}
                                </p>
                                <p className="text-xl text-gray-800 font-semibold mb-2">
                                    Question: {question.Question}
                                </p>
                            </div>
                            <ul className="space-y-3 py-2 overflow-y-auto">
                                {question.Options.map((option, oIndex) => (
                                    <li key={oIndex} className="text-gray-600 font-semibold break-words">
                                        <input
                                            type="radio"
                                            name="ques"
                                            id={`option-${oIndex}`}
                                            value={option}
                                            checked={responses?.optionValue === option}
                                            onChange={() => handleRadioChange(oIndex, option)}
                                            className="mr-2"
                                            required
                                        />
                                        <label className="text-md" htmlFor={`option-${oIndex}`}>
                                            {option}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="custom-button w-[200px] absolute right-8 bottom-6"
                                onClick={() => {
                                    if (!responses.optionValue) toast.error("No answer provided!");
                                    else setShowModal(true)
                                }}
                            >
                                Next
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="h-[60%] absolute w-full bottom-0 bg-customBlue rounded-t-2xl"></div>
        </div>
    );
};

export default AdaptiveQuiz;