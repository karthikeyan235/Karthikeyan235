import React, { useEffect } from 'react';
import cautionImage from '../assets/caution.png';  
import { useTranslation } from 'react-i18next';

const TestTerminated = () => {
  const { i18n,t } = useTranslation();
  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [navigator]);

  return (
    <div className='flex flex-col justify-center items-center h-100 gap-y-8'>
      {cautionImage && <img src={cautionImage} alt="Caution" width={"200px"} />}
      <h1 className="font-semibold text-3xl">{t('ytit')}</h1>
    </div>
  );
}

export default TestTerminated;
