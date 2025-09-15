import { useState, useEffect, useContext, useRef } from "react";
import { getAPI } from "../caller/axiosUrls";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import NotFound from "../components/NotFound";
import QuizCard from "../components/QuizCard";
import Loader from "../components/Loader";
import { useTranslation } from 'react-i18next';
import { PlanContext } from "../contexts/PlanContext";
import UploadVec from '../assets/Upload.png';
import { useNavigate, useLocation } from "react-router-dom";
import ToggleButton from "../components/ToggleButton";
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { IoMic, IoMicOff } from "react-icons/io5";
const QuizSearch = () => { 
    const { i18n, t } = useTranslation();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [localQuiz, setLocalQuiz] = useState([]);
    const [globalQuiz, setGlobalQuiz] = useState([]);
    const [activeTab, setActiveTab] = useState('Local Quiz');
    const { iid } = useContext(PlanContext);
    const [adaptiveMode, setAdaptiveMode] = useState(false);
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef(null);
    const location = useLocation();

    const getQuiz = async (adv = adaptiveMode) => {
        setLoading(true);
        setLocalQuiz([]);
        setGlobalQuiz([]);
        // console.log("API called with ", search);

        try {
            let response;
            if (location.pathname === '/student/quiz-attend') {
                response = await getAPI(`/quiz/get-quizzes?search=${search.trim()}&adv=${adv}`);
            } else {
                response = await getAPI(`/quiz/get-quizzes?search=${search.trim()}`);
            }
            // console.log(response);
            setLocalQuiz(response.userQuizzes || []);
            setGlobalQuiz(response.publicQuizzes || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };    

    const toggleAdaptive = () => {
        setAdaptiveMode((prevMode) => {
            const newMode = !prevMode;
            getQuiz(newMode); // Pass the updated state directly to the function
            return newMode;
        });
    };    

    useEffect(() => {
        sessionStorage.removeItem('adpid');
        sessionStorage.removeItem('first');
        sessionStorage.removeItem("adaptiveResult");
    })

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (iid) {
                getQuiz();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, iid]);
    useEffect(() => {
        if (!isListening) return;
    
        const API = import.meta.env.VITE_SPEECH_KEY;
        const REGION = import.meta.env.VITE_SPEECH_REGION;
    
        const sttLangs = {
          en: 'en-US',
          ar: 'ar-AE',
          pl: 'pl-PL',
          hi: 'hi-IN',
        };
    
        const selectedLang = sttLangs[i18n.language] || 'en-US';
    
        const speechConfig = speechsdk.SpeechConfig.fromSubscription(API, REGION);
        speechConfig.speechRecognitionLanguage = selectedLang;
    
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
    
        recognizer.recognized = (s, e) => {
          if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
            const text = e.result.text.trim().replace(/[.,!?;:]+$/, '');
            const remaining = 50 - search.length;
            const trimmed = text.slice(0, remaining);
            console.log("trimmed",trimmed)
            setSearch((prev) => prev + (prev ? ' ' : '') + trimmed);
            console.log("message",setSearch)
          }
        };
    
        recognizer.startContinuousRecognitionAsync(
          () => console.log("Speech recognition started."),
          (err) => {
            toast.error("Speech recognition error: " + err);
            setIsListening(false);
          }
        );
    
        return () => {
          recognizer.stopContinuousRecognitionAsync(
            () => {
              console.log("Speech recognition stopped.");
              setIsListening(false);
            },
            (err) => console.error("Stop failed:", err)
          );
        };
      }, [isListening, search, i18n.language]);
    
      const handleMicClick = () => {
        if (isListening) {
          setIsListening(false);
        } else {
          setIsListening(true);
          setSearch(" ");
        }
      };
    return (
        <div className="w-screen mb-5">
            <div className="flex justify-around bg-customBlueLight rounded-t-[20px] h-[70px]">
                <button
                    className={`h-full grow focus:outline-none ${activeTab === 'Local Quiz' ? 'text-customBlue active-bg animate__animated animate__fadeInRight' : 'text-white'
                        } tracking-wide`}
                        style={{ borderRadius: '0px 0px 0px 0px' }}
                        onClick={() => setActiveTab('Local Quiz')}
                >
                    <span className='text-[24px] font-semibold'>{t('localquiz')}</span>
                </button>
                <button
                    className={`h-full grow focus:outline-none ${activeTab === 'Global Quiz' ? 'text-customBlue active-bg animate__animated animate__fadeInLeft' : 'text-white'
                        } tracking-wide`}
                        style={{ borderRadius: '0px 0px 0px 0px'}}

                    onClick={() => setActiveTab('Global Quiz')}
                >
                    <span className='text-[24px] font-semibold'>{t('globalquiz')}</span>
                </button>
            </div>

            <div className="flex justify-center items-center mt-10 w-9/12 mx-auto gap-x-4 relative">
  <div className="search relative w-full mx-auto bg-[#F5F5F5] flex items-center h-[50px] px-6 rounded-[15px] pr-16">
    <input 
      className="py-[10px] px-4 w-full bg-transparent outline-none grow"
      onChange={(e) => setSearch(e.target.value)}
      placeholder={t('searchquiz')}
      value={search}
      maxLength={50}
      ref={inputRef}
    />

    {/* Search Icon */}
    <FaSearch className="absolute left-3 text-[20px] top-1/2  transform -translate-y-1/2 text-blue-500" />

    {/* Mic Button */}
    <button
      onClick={handleMicClick}
      className="absolute right-4 text-[22px] top-1/2 transform -translate-y-1/2"
      title={isListening ? t('stoprecording') : t('startrecording')}
    >
      {isListening ? <IoMic className="text-red-500" /> : <IoMic className="text-blue-500" />}
    </button>
  </div>

                {location.pathname === '/student/quiz-attend' ? 
                <div className="flex flex-col items-center w-[150px]">
                    <ToggleButton
                        defaultChecked={adaptiveMode}
                        onChange={toggleAdaptive}
                        disabled={loading}
                    />
                    <p className="text-sm mt-1 font-semibold text-center">Adaptive Quiz</p>
                </div> : null}
            </div>

            {/* Tab content */}
            <div className="mt-4">
                {activeTab === "Local Quiz" && (
                <div className="flex px-2 md:mx-8 flex-col justify-center items-center gap-8">
                    <div className="md:ml-4 justify-center w-full h-96 flex md:flex-wrap overflow-x-auto md:overflow-y-auto rounded-lg p-2 mb-4 gap-8">
                    {loading ? (
                        <Loader type={2} />
                    ) : localQuiz.length === 0 ? (
                        <div className="pb-4">
                        <div onClick={() => navigate(`/${sessionStorage.getItem('role')}/create-quiz`)} className="min-w-[270px] flex flex-col relative justify-center items-center relative card-book cursor-pointer h-[230px] bg-[#DEE8F5] rounded-2xl">
                            <div className="w-[180px] h-[180px] rounded-full bg-white absolute top-1/2 left-1/2 add-book"></div>
                            <div className="add-button flex flex-col items-center justify-center top-1/3 left-1/2 z-0">
                                <img src={UploadVec} alt="Upload Vector" />
                                <p className="font-semibold mt-2 text-[#2E5BFF]">{t('createquiz')}</p>
                            </div>
                            <p className="absolute bottom-[-30px] text-gray-400 text-sm font-medium mt-2 ml-[-15px] text-start truncate w-11/12">
                                {t('caqtgs')}
                            </p>
                        </div>
                        </div>
                    ) : (
                        <>
                        <div onClick={() => navigate(`/${sessionStorage.getItem('role')}/create-quiz`)} className="min-w-[270px] flex flex-col relative justify-center items-center relative card-book cursor-pointer h-[230px] bg-[#DEE8F5] rounded-2xl">
                            <div className="w-[180px] h-[180px] rounded-full bg-white absolute top-1/2 left-1/2 add-book"></div>
                            <div className="add-button flex flex-col items-center justify-center top-1/3 left-1/2 z-0">
                                <img src={UploadVec} alt="Upload Vector" />
                                <p className="font-semibold mt-2 text-[#2E5BFF]">{t('createquiz')}</p>
                            </div>
                            <p className="absolute bottom-[-28px] text-gray-400 text-sm font-medium mt-2 ml-[-15px] text-start truncate w-11/12">
                                {t('amq...')}
                            </p>
                            </div>
                            {localQuiz.map((quiz, index) => (
                                <QuizCard
                                    key={`local-${index}`}
                                    type={sessionStorage.getItem('role')}
                                    quiz={quiz}
                                    adaptive={adaptiveMode}
                                    attend={location.pathname === '/student/quiz-attend'}
                                />
                            ))}
                        </>
                    )}
                    </div>
                </div>
                )}
        
                {activeTab === "Global Quiz" && (
                <div className="flex md:mx-8 flex-col justify-center items-center gap-8">
                    <div className="md:ml-4 justify-center w-full h-96 flex md:flex-wrap overflow-x-auto md:overflow-y-auto rounded-lg p-2 mb-4 gap-8">
                    {loading ? (
                        <Loader type={2} />
                    ) : globalQuiz.length === 0 ? (
                        <div className="pb-4">
                            <NotFound info={"Oops!"} text={t('tanqcy')} />
                        </div>
                    ) : (
                        <>
                        {globalQuiz.map((quiz, index) => (
                            <QuizCard
                                key={`global-${index}`}
                                type={sessionStorage.getItem('role')}
                                quiz={quiz}
                                adaptive={adaptiveMode}
                                attend={location.pathname === '/student/quiz-attend'}
                            />
                        ))}
                        </>
                    )}
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}
export default QuizSearch;