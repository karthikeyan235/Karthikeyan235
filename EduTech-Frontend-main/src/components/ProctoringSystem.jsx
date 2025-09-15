import React, { useState, useEffect, useRef } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { toast } from 'react-toastify';
import { toast as tst } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { postAPI, postAPIMedia } from '../caller/axiosUrlsFast';
import { useParams } from "react-router-dom"; 
import AttendQuizProctor from '../pages/StudentPanel/AttendQuizProctor';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import AdaptiveQuiz from '../pages/StudentPanel/AdaptiveQuiz';

const SPEECH_KEY = import.meta.env.VITE_SPEECH_KEY;
const SPEECH_REGION = import.meta.env.VITE_SPEECH_REGION;

function ProctoringWithWindowWatcher({ adaptive, setIsExamActive, setIsFullscreen, isExamActive, isFullscreen }) {
  const { i18n,t } = useTranslation();
  const [noiseCount, setNoiseCount] = useState(0);
  const [exitCount, setExitCount] = useState(0);
  const [switchCount, setSwitchCount] = useState(0);
  const [lastSwitchTime, setLastSwitchTime] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [userChanged, setUserChanged] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let speechConfig;
  let audioConfig;
  const { qid } = useParams();
  const username = sessionStorage.getItem('user-id');

  const enterFullscreen = () => {
    if (!submitted && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          setIsExamActive(true);
        })
        .catch(err => console.error(t('eatefm'), err));
    }
  };

  // Cleanup to stop all streams
  const stopAllStreams = async () => {
    // Stop camera stream
    if (videoRef && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null; // Ensure the video element is cleared
    }
    
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
    window.removeEventListener('blur', handleSwitch);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  };

  // Stop camera stream on exam submission
  const submitExam = async (reason) => {
    const payload = {
      username,
      quiz_id: qid,
      deviation_count: switchCount,
      fullscreen_exit_count: exitCount,
      submission_status: reason,
      noise_count: noiseCount,
    };

    try {
      await postAPI('/submit_exam', payload);
      setSubmitted(true);
      stopAllStreams();
    } catch (error) {
      console.error(t('errorsubmittingexam'), error);
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleFullscreenExit = () => {
    if (!submitted) {
      setIsFullscreen(false);
      setExitCount(prevExitCount => prevExitCount + 1);
      setIsExamActive(false);
      toast.warn(t('fectbbtrte'));
    }
  };

  useEffect(() => {
    if (switchCount > 4) {
      window.location.href=window.location.origin + '/student/terminate'
    }
  }, [switchCount])

  // Increment the switch count with debounce logic
  const handleSwitch = () => {
    // Minimum delay (in ms) between increments to avoid duplicate counting
    const MIN_DELAY = 500;

    const currentTime = Date.now();

    // Only increment if enough time has passed since the last switch
    if (currentTime - lastSwitchTime > MIN_DELAY) {
      setSwitchCount(switchCount + 1);
      setLastSwitchTime(currentTime); // Update last switch time
      toast.error(t('tabswitched'), {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Listen for both tab visibility changes and window blur events
  const visibilityChangeHandler = () => {
    if (document.hidden && !submitted) {
      handleSwitch();
    }
  };

  useEffect(() => {
    if (!submitted) {
      document.addEventListener('visibilitychange', visibilityChangeHandler);
      window.addEventListener('blur', handleSwitch);
  
      // Cleanup
      return () => {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
        window.removeEventListener('blur', handleSwitch);
      };
    }
  }, [submitted, lastSwitchTime]);

  useEffect(() => {
      let recognizer;

      if (!submitted) {
        speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
        audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizing = (sender, event) => {
          console.log(submitted);
          if (!submitted && event.result.reason === sdk.ResultReason.RecognizingSpeech) {
            if (((event.result.text.split(' ').length) % 5) === 4) {
              toast.error(t('noisedetected'), {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
              setNoiseCount(prevNoiseCount => prevNoiseCount + 1);
            }
          }
        };

        recognizer.sessionStopped = (sender, event) => {
          recognizer.stopContinuousRecognitionAsync();
          console.log(t('srsto'));
        };
        
        recognizer.startContinuousRecognitionAsync(() => {
          console.log(t('srsta'));
        });
      }

      return () => {
        if (recognizer) {
          recognizer.stopContinuousRecognitionAsync(() => {
            recognizer.close();
            recognizer = null; // Ensures it's fully cleared
          }, (error) => {
            console.error(t('esr'), error);
            recognizer = null; // Set to null even on error
          });
        }
      }
  }, [submitted]);

  useEffect(() => {
    // Check if the videoRef is attached to the DOM element
    if (!submitted && videoRef) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // Set the video source object to the stream
          videoRef.current.srcObject = stream;
  
          // Play the video once the stream is set
          videoRef.current.play();
        })
        .catch(err => {
          console.error(t('erroraccessingcamera'), err);
          toast.error(t('cairftte'));
        });
    }

    return () => {
      if (videoRef && videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null; // Ensure the video element is cleared
      }
    }
  }, [submitted, videoRef]); // Dependency array includes videoRef to make sure it's updated  

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!submitted) captureAndVerifyImage();
    }, 5000)

    const interval = setInterval(() => {
      if (!submitted) captureAndCheckImage();
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, [submitted])

  const captureAndCheckImage = async () => {
    if (submitted) return; // Stop capturing if exam is submitted

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'snapshot.jpg');

      try {
        const response = await postAPIMedia('/proctoring/detect-faces', formData);
        
        const data = await response;

        let message = '';
        if (data.face_count > 1) {
          message = t('mfd');
          toast.error(message, { autoClose: 5000 });
        } else if (data.face_count < 1) {
          message = t('nfd');
          toast.error(message, { autoClose: 5000 });
        } else {
          message = t('sfdeeis');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }, 'image/jpeg');
  };

  const captureAndVerifyImage = async () => {
    if (submitted) return; // Stop capturing if exam is submitted

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'snapshot.jpg');
      formData.append('camera_no', 1);

      try {
        const response = await postAPIMedia('/verify_face_during_exam', formData);
        
        const data = await response.userid || null;

        if (data !== username) {
          setUserChanged(userChanged + 1);
          toast.error(t('fidnmwvu'), {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }); 
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }, 'image/jpeg');
  };

  useEffect(() => {
    if (!submitted && userChanged > 4) {
      toast.error(t('te'), {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      stopAllStreams();
      setIsExamActive('false')
      window.location.href=window.location.origin + '/student/terminate'
    }
  }, [submitted])

  useEffect(() => {
    if (submitted) return;

    const timeout = setTimeout(() => {
      if (!submitted) captureAndVerifyImage();
    }, 5000)

    const interval = setInterval(() => {
      if (!submitted) captureAndVerifyImage();
    }, 20000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, [submitted])

  const handleFullscreenChange = () => {
    if (document.fullscreenElement && !isFullscreen) {
      setIsFullscreen(true);
      setIsExamActive(true);
    } else if (!document.fullscreenElement && isFullscreen) {
      handleFullscreenExit();
    }
  };

  useEffect(() => {
    enterFullscreen();
    if (submitted) return;
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [submitted]);

  useEffect(() => {
    if (!isExamActive) {
      stopAllStreams();
      tst.error(t('pvy'));
      window.location.href=window.location.origin + '/student/quiz-attend'
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      stopAllStreams();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopAllStreams(); // Ensure streams are stopped on component unmount as well
    };
  }, []);

  return (
    <div className={`${(!isFullscreen || !isExamActive && !submitted) ? 'justify-center' : ''} flex flex-col items-center ${adaptive ? '' : 'p-6'} space-y-4 h-screen overflow-y-auto`}>
      {!isFullscreen || !isExamActive && !submitted && (
        <button 
          className="bg-green-500 text-white font-semibold text-3xl px-4 py-2 rounded"
          onClick={enterFullscreen}
        >
          {t('resumeexam')}
        </button>
      )}

      {/* {submitted && 
      <button className="bg-white absolute top-20 left-20 flex items-center gap-x-3 bg- px-2 w-fit p-1 hover:scale-110 active:scale-90 z-30 text-3xl" onClick={() => window.location.href=window.location.origin + '/student/quiz'}>
          <IoMdArrowRoundBack /> <p className='text-2xl font-semibold mr-2'>{t('exit')}</p>
      </button>} */}

      {!submitted && (
        <>
          <video
            ref={videoRef}
            className="fixed bottom-10 left-10 w-36 h-auto z-50 rounded-lg shadow-lg"
          />
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
      {adaptive ? ((isExamActive || submitted) ? <AdaptiveQuiz /> : null) : <AttendQuizProctor isExamActive={isExamActive || submitted} onSubmit={submitExam} />}
    </div>
  );
}

export default ProctoringWithWindowWatcher;