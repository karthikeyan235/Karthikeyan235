import { useState, useEffect, useContext, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import BookCard from "../components/BookCard";
import { getAPI } from "../caller/axiosUrls";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { PlanContext } from "../contexts/PlanContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import UploadVec from '../assets/Upload.png';
import NotFound from '../components/NotFound';
import InstituteFooter from "../components/InstituteFooter";
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { IoMic, IoMicOff } from "react-icons/io5";

const Upload = () => {
  const { i18n, t } = useTranslation();
  const [localBooks, setLocalBooks] = useState([]);
  const [globalBooks, setGlobalBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Local Books');
  const { iid } = useContext(PlanContext);
  const navigate = useNavigate();

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (iid) {
        getBooks();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, iid]);

  const getBooks = async () => {
    setLoading(true);
    setLocalBooks([]);
    setGlobalBooks([]);
    try {
      console.log("API called with ", search);
      const response = await getAPI(`/books/get-books?search=${search.trim()}`);
      setLocalBooks(response.userBooks || []);
      setGlobalBooks(response.publicBooks || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Speech recognition effect
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
      setSearch("");
    }
  };

  return (
    <div className="w-screen">
      <div className="flex justify-around bg-customBlueLight rounded-t-[20px] h-[70px]">
        <button
          className={`h-full grow focus:outline-none ${activeTab === 'Local Books' ? 'text-customBlue active-bg animate__animated animate__fadeInRight' : 'text-white'
            } tracking-wide`}
          onClick={() => setActiveTab('Local Books')}
        >
          <span className='text-[24px] font-semibold'>{t('localbooks')}</span>
        </button>
        <button
          className={`h-full grow focus:outline-none ${activeTab === 'Global Books' ? 'text-customBlue active-bg animate__animated animate__fadeInLeft' : 'text-white'
            } tracking-wide`}
          onClick={() => setActiveTab('Global Books')}
        >
          <span className='text-[24px] font-semibold'>{t('globalbooks')}</span>
        </button>
      </div>

      <div className="flex justify-center items-center mt-10 w-9/12 mx-auto gap-x-4 relative">
        <div className="search relative w-full mx-auto bg-[#F5F5F5] flex items-center h-[50px] px-8 rounded-[15px]">
          <input
            ref={inputRef}
            className="py-[10px] px-3 w-full bg-transparent outline-b-none border-gray-300 focus:outline-none outline-none grow px-2"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchbooks')}
            value={search}
            maxLength={50}
          />
          <FaSearch className="absolute left-3 text-[20px] top-1/2 transform -translate-y-1/2 text-blue-500" />
          <button
            onClick={handleMicClick}
            className="absolute right-4 text-[22px] top-1/2 transform -translate-y-1/2"
            title={isListening ? t('stoprecording') : t('startrecording')}
          >
           {isListening ? <IoMic  className="text-red-500"/> :<IoMic  className="text-blue-500"/>}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "Local Books" && (
          <div className="flex px-2 md:mx-8 flex-col justify-center items-center gap-8">
            <div className="md:ml-4 justify-center w-full h-96 flex md:flex-wrap overflow-x-auto md:overflow-y-auto rounded-lg p-2 mb-4 gap-8">
              {loading ? (
                <Loader type={2} />
              ) : localBooks.length === 0 ? (
                <div className="pb-4">
                  <div onClick={() => navigate(`/${sessionStorage.getItem('role')}/create-book`)} className="min-w-[270px] flex flex-col relative justify-center items-center card-book cursor-pointer h-[230px] bg-[#DEE8F5] rounded-2xl">
                    <div className="w-[180px] h-[180px] rounded-full bg-white absolute top-1/2 left-1/2 add-book"></div>
                    <div className="add-button flex flex-col items-center justify-center top-1/3 left-1/2 z-0">
                      <img src={UploadVec} alt="Upload Vector" />
                      <p className="font-semibold mt-2 text-[#2E5BFF]">{t('createbook')}</p>
                    </div>
                    <p className="absolute bottom-[-30px] text-gray-400 text-sm font-medium mt-2 ml-[-15px] text-start truncate w-11/12">
                      {t('cabtgs')}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div onClick={() => navigate(`/${sessionStorage.getItem('role')}/create-book`)} className="min-w-[270px] flex flex-col relative justify-center items-center card-book cursor-pointer h-[230px] bg-[#DEE8F5] rounded-2xl">
                    <div className="w-[180px] h-[180px] rounded-full bg-white absolute top-1/2 left-1/2 add-book"></div>
                    <div className="add-button flex flex-col items-center justify-center top-1/3 left-1/2 z-0">
                      <img src={UploadVec} alt="Upload Vector" />
                      <p className="font-semibold mt-2 text-[#2E5BFF]">{t('createbook')}</p>
                    </div>
                    <p className="absolute bottom-[-28px] text-gray-400 text-sm font-medium mt-2 ml-[-15px] text-start truncate w-11/12">
                      {t('cnb..')}
                    </p>
                  </div>
                  {localBooks.map((book, index) => (
                    <BookCard
                      key={`local-${index}`}
                      type={sessionStorage.getItem('role')}
                      book={book}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "Global Books" && (
          <div className="flex md:mx-8 flex-col justify-center items-center gap-8">
            <div className="md:ml-4 justify-center w-full h-96 flex md:flex-wrap overflow-x-auto md:overflow-y-auto rounded-lg p-2 mb-4 gap-8">
              {loading ? (
                <Loader type={2} />
              ) : globalBooks.length === 0 ? (
                <div className="pb-4">
                  <NotFound info={"Oops!"} text={t('tanbcy')} />
                </div>
              ) : (
                <>
                  {globalBooks.map((book, index) => (
                    <BookCard
                      key={`global-${index}`}
                      type={sessionStorage.getItem('role')}
                      book={book}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <InstituteFooter />
    </div>
  );
};
export default Upload;