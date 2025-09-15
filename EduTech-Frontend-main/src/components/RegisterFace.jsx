import React, { useRef, useState, useEffect } from "react";
import { postAPIMedia } from "../caller/axiosUrlsFast";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img2 from '../assets/register_BG.jpg';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
 
const RegisterFace = () => {
  const { i18n, t } = useTranslation();
  const videoRef = useRef(null);
  const [results, setResults] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
 
  const navigate = useNavigate();
 
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error(t('erroraccessingcamera'), err);
      }
    };
 
    startCamera();
 
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
 
  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
 
    const image = canvas.toDataURL("image/jpeg");
 
    try {
      const formData = new FormData();
      const username = sessionStorage.getItem('user-id');
      formData.append("username", username);
      formData.append("image", dataURLtoBlob(image));
 
      const response = await postAPIMedia("/register_face", formData);
      setResults(response.message);
      setIsRegistered(true);
 
      if (response.message.includes("Face registered successfully.")) {
        toast.success(t('registrationsuccessful'), {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
 
        setTimeout(() => {
          navigate(-1);
        }, 3000)
      }
      else if (response.message.includes("User already exists.")) {
        toast.warn(t('yaarntes'), {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
 
        setTimeout(() => {
          navigate(-1);
        }, 3000)
      }
      else {
        toast.error(t('rfpta'), {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
 
        setTimeout(() => {
          navigate(-1);
        }, 3000)
      }
    } catch (error) {
      toast.error(t('aeodrpta'), {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
 
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
 
  const handleTryAgain = () => {
    setIsRegistered(false);
    setResults(null);
 
    // Stop existing camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
 
    // Restart the camera stream
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error(t('erroraccessingcamera'), err);
      });
  };
 
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="proctoring-bgCustom rounded-[30px] shadow-lg w-full max-w-4xl flex relative">
        <div className="w-full sm:w-1/2 p-4 border-r border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-center text-customBlue">{t('candidatefaceregistration')}</h1>
          {!isRegistered ? (
            <>
              <div className="mb-4 flex justify-center">
                <video ref={videoRef} autoPlay className="w-full h-auto rounded-[30px] border border-gray-300" />
              </div>
              <div className="flex justify-center">
                <button onClick={captureFrame} className="bg-customBlue text-white font-bold py-2 px-4 rounded-[15px] shadow bg-customHover transition duration-300">
                  {t('captureandregister')}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{t('rr')}</h2>
              <p className="mb-4">{results}</p>
              {(results.includes(t('registrationsuccessful')) || results.includes(t('use'))) && (
                <button onClick={handleTryAgain} className="bg-customBlue text-white font-bold py-2 px-4 rounded-[15px] shadow bg-customHover transition duration-300">
                  {t('tryagain')}
                </button>
              )}
             
            </div>
          )}
        </div>
        <div className="w-full sm:w-1/2 p-4">
          <h2 className="text-xl font-semibold mb-4">{t('instructions')}</h2>
          <ul className="list-disc list-inside mb-4">
            <li>{t('li21')}</li>
            <li>{t('li22')}</li>
            <li>{t('li23')}</li>
            <li>{t('li24')}</li>
          </ul>
          {/* <img src={img2} alt="Background" className="w-full h-auto rounded-md mt-6"/> */}
          <div className="flex justify-center items-center">
            <dotlottie-player
              src="https://lottie.host/6c402fdb-8506-4bb2-86b3-bd6a32eb5f42/v1aD4CEZpw.json"
              background="transparent"
              border="2px solid black"
              speed="1"
              loop
              autoplay
              style={{ width: '60%', height: '60%' }}
            />
          </div>
 
        </div>
      </div>
    </div>
  );
};
 
export default RegisterFace;