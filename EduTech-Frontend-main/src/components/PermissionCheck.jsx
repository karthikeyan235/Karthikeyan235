import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { postAPI } from '../caller/axiosUrlsFast';
import DialogSystem from './DialogSystem';
import { useTranslation } from 'react-i18next';

const PermissionsCheck = ({ isMobile, setIsExamActive, setIsFullscreen }) => {
  const { i18n,t } = useTranslation();
  const [micPermission, setMicPermission] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [canProceed, setCanProceed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showPermissionToast = (message) => {
    toast.error(message, {
      toastId: 'permission-toast',
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const checkPermissions = async () => {
    try {
      // Default states for permissions
      let micGranted = false;
      let cameraGranted = false;
  
      // Check and request permissions
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micGranted = !!micStream;
      } catch (micError) {
        console.error(t('madona'), micError);
      }
  
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraGranted = !!cameraStream;
      } catch (cameraError) {
        console.error(t('cadona'), cameraError);
      }
  
      // Update state based on permissions granted
      setMicPermission(micGranted);
      setCameraPermission(cameraGranted);
  
      // Show toasts for denied permissions
      if (!micGranted) {
        showPermissionToast(t('mairftte'));
      }
      if (!cameraGranted) {
        showPermissionToast(t('cairftte'));
      }
  
      // Enable proceeding only if both permissions are granted
      setCanProceed(micGranted && cameraGranted);
    } catch (error) {
      console.error(t('ecp'), error);
      toast.error(t('anowcp'), {
        toastId: 'permission-toast',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };  

  const handleClick = async () => {
    if (canProceed) {
      try {
        // await postAPI('/start_window_monitoring');

        // Attempt to enter fullscreen mode
        const goFullscreen = () => {
          return new Promise((resolve, reject) => {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen()
                .then(() => resolve(true))
                .catch((err) => {
                  console.error(t('eatefm'), err);
                  reject(false);
                });
            } else {
              // Fullscreen API is not supported
              console.warn(t('fmns'));
              resolve(false);
            }
          });
        };

        // Handle fullscreen mode and navigation
        const isFullscreenEnabled = await goFullscreen();
        handleOpenDialog();
        setIsFullscreen(isFullscreenEnabled);
        setIsExamActive(true);
      } catch (error) {
        console.error(t('eswm'), error);
        toast.error(t('aeowswm'), {
          toastId: 'start-monitor-toast',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  // Re-run checkPermissions when permission status changes
  useEffect(() => {
    checkPermissions();
  }, [micPermission, cameraPermission]);

  return (
    <>
      <DialogSystem isOpen={isDialogOpen} onClose={handleCloseDialog} />
      {isMobile ? null : 
      isDialogOpen ? null :
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white flex justify-center items-center flex-col rounded-[20px] shadow-lg p-8 w-[550px] mx-auto" style={{ minHeight: '350px' }}>
            <h1 className="text-[24px] font-bold text-gray-800 mb-2 text-center">{t('cc')}</h1>
            <br />
            <div className="text-left space-y-2">
              <div className={`flex items-center space-x-3 ${micPermission ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-2xl">{micPermission ? '✅' : '❌'}</span>
                <span className="text-lg font-medium">{t('microphoneaccess')} {micPermission ? t('granted') + "!" : t('denied')}</span>
              </div>

              <div className={`flex items-center space-x-3 ${cameraPermission ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-2xl">{cameraPermission ? '✅' : '❌'}</span>
                <span className="text-lg font-medium">{t('ca')} {cameraPermission ? t('granted') + "!" : t('denied')}</span>
              </div>
            </div>

            <button
              onClick={handleClick}
              disabled={!canProceed}
              className="custom-button mt-5 w-11/12 rounded-[30px]"
              title={!canProceed ? t('fgatptstt') : ''}
            >
              {t('verifyuser')}
            </button>
          </div>
        </div>}
    </>
  );
};

export default PermissionsCheck;
