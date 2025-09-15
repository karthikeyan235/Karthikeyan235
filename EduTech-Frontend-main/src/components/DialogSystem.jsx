import React, { useRef, useState, useEffect } from "react";
import img1 from "../assets/bgg_proct2.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postAPIMedia } from "../caller/axiosUrlsFast";
import { useTranslation } from 'react-i18next';
 
const DialogSystem = ({ isOpen, onClose }) => {
  const { i18n, t } = useTranslation();
  const videoRef = useRef(null);
  const [results, setResults] = useState(null);
  const [sender, setSender] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const username = sessionStorage.getItem('user-id');
 
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
 
  const restartCameraStream = async () => {
    // Stop the current stream if it exists
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
 
    // Request a new stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraPermissionGranted(true);
    } catch (err) {
      setCameraPermissionGranted(false);
      console.error(t('erroraccessingcamera'), err);
    }
  };
 
  const captureFrame = async () => {
    if (!cameraPermissionGranted) {
      toast.error(t('pgcpbv'), {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
 
    if (sender) return;
    else setSender(true);
 
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
 
    const image = canvas.toDataURL("image/jpeg");
 
    try {
      const formData = new FormData();
      formData.append("image", dataURLtoBlob(image));
      formData.append("camera_no", 1);
 
      const response = await postAPIMedia("/verify_face", formData);
      const data = await response.userid || null;
      setResults(response.message);
 
      if (response.message.includes("Verification successful")) {
        if (data !== username) {
          toast.error(t('fidnmwvu'), {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }); 
        } else {
          setIsVerified(true);
          
          toast.success(t('vsrttep'), {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          setTimeout(() => {
            onClose();
            navigate(`${pathname}/exam`, { state: { isExamActive: true } });
          }, 3000);
        }
      } else {
        toast.error(t('vfrttrp'), {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(t('aeodvpta'), {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSender(false);
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
 
  const handleTryAgain = async () => {
    console.log(t('trbc'));
    setIsVerified(false);
    setResults(null);
    await restartCameraStream();
  };
 
  useEffect(() => {
    const requestCameraPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraPermissionGranted(true);
        videoRef.current.srcObject = stream;
      } catch (err) {
        setCameraPermissionGranted(false);
        console.error(t('erroraccessingcamera'), err);
      }
    };
 
    if (isOpen) {
      requestCameraPermissions();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
 
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);
 
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="proctoring-bgCustom rounded-[30px] shadow-lg w-full max-w-5xl flex flex-col relative">
        <div className="flex w-full ">
          <div className="w-full sm:w-1/2 p-4 flex flex-col items-center mb-[-2rem]">
            {/* <h1 className="text-2xl text-customBlue font-bold mb-4 text-center">{t('systemcompatibilitycheck')}</h1> */}
            {!isVerified ? (
              <div className="mb-[-2rem]">
                <div className="mb-3 flex justify-center">
                  <video ref={videoRef} autoPlay className="w-full h-auto rounded-[30px] border border-gray-300" />
                </div>
                <div className="flex justify-center mt-8 z-30">
                  <button disabled={sender} onClick={captureFrame} className="bg-customBlue text-white font-bold py-2 px-4 rounded-[15px] shadow bg-customHover transition duration-300 z-30">
                    {t('captureandverify')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">{t('verificationresults')}</h2>
                <p className="mb-4">{results}</p>
                {!results.includes(t('verificationsuccessful')) ? (
                  <button disabled={sender} onClick={handleTryAgain} className="bg-customBlue text-white font-bold py-2 px-4 rounded-[15px] shadow bg-customHover transition duration-300" style={{}}>
                    {t('tryagain')}
                  </button>
                ):(
                  <div className="flex justify-center items-center mt-4">
                  <dotlottie-player
                    src="https://lottie.host/a500fe66-612a-4e68-a5b5-c2ef0bb13c92/VGvSFiPMuc.json"
                    background="transparent"
                    border="2px solid black"
                    speed="1"
                    loop
                    autoplay
                    style={{ width: '60%', height: '60%' }}
                  />
                </div>
                )}
              </div>
            )}
          </div>
          <div className="w-full sm:w-1/2 p-4 relative">
            <div
              className="absolute inset-0 bg-cover rounded-[30px] bg-center"
              style={{
                backgroundImage: `url(${img1})`,
                zIndex: -1,
              }}
            />
            <div className="text-center p-4 border-gray-200 w-full">
              <h1 className="text-2xl text-customBlue font-bold">{t('systemcompatibilitycheck')}</h1>
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('instructions')}:</h2>
            <ul className="list-disc list-inside">
              <li>{t('li11')}</li>
              <li>{t('li12')}</li>
              <li>{t('li13')}</li>
              <li>{t('li14')}</li>
              <li>{t('li15')}</li>
            </ul>
            <div className="flex flex-col gap-y-2 mt-4 justify-end items-center">
              <p className="text-customBlue mx-2"><b>{t('notregistered')}</b></p>
              <button
                disabled={sender}
                onClick={() => navigate(`${pathname}/register`)}
                className="bg-customBlue text-white font-bold py-2 px-4 rounded-[15px] shadow transition duration-300"
              >
                {t('candidatefaceregistration')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default DialogSystem;