import { useEffect, useRef, useState } from 'react';
import Universities from '../../assets/Universities.jpg';
import Teachers from '../../assets/Teachers.jpg';
import Learners from '../../assets/Learners.jpg';
import { useTranslation } from 'react-i18next'; 

const Types = ({ registerButton, setShowContactForm }) => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const parentRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing after it's visible
        }
      },
      { threshold: 0.2 }
    );

    if (parentRef.current) observer.observe(parentRef.current);

    return () => {
      if (parentRef.current) observer.unobserve(parentRef.current);
    };
  }, []);

  return (
    <>
      <div id="types" ref={parentRef} className="py-28 px-10 flex justify-between">
        {/* Learners Section */}
        <div
          className={`flex flex-col text-center items-center w-[400px] h-[550px] ${
            isVisible ? 'animate__animated animate__fadeIn animate__slow' : 'opacity-0'
          }`}
        >
          <div className="w-[210px] mb-10 h-[210px] overflow-hidden bg-cover bg-center bg-no-repeat rounded-full">
            <img className="w-full h-full object-cover object-top" src={Learners} alt="Learners" />
          </div>
          <p className="text-[24px] font-semibold mb-6">
          {i18n.language === "en" ? (
              <div>
                  Edulearn for <span className="linear-color">Learners</span>
              </div>
                    ) : (
                       
              <div>
                  {t('edulearnforlearners')}
              </div>
                )}     
          </p>
          <p className="text-[16px] font-medium mb-10 text-center px-2">
            {t('eopletaatthymsm')}
          </p>
          <span className="flex-1" />
          <button className="custom-button text-[24px] px-14" onClick={() => registerButton('/register/learners')}>{t('getedulearn')}</button>
        </div>

        {/* Teachers Section */}
        <div
          className={`flex flex-col text-center items-center w-[400px] h-[550px] ${
            isVisible ? 'animate__animated animate__fadeIn animate__slow' : 'opacity-0'
          }`}
        >
          <div className="w-[210px] mb-10 h-[210px] overflow-hidden bg-cover bg-bottom bg-no-repeat rounded-full">
            <img className="w-full h-full object-cover" src={Teachers} alt="Teachers" />
          </div>
          <p className="text-[24px] font-semibold mb-6">
          {i18n.language === "en" ? (
              <div>
                  Edulearn for <span className="linear-color">Teachers</span>
              </div>
                    ) : (
                       
              <div>
                  {t('edulearnforteachers')}
              </div>
                )}     
          </p>
          <p className="text-[16px] font-medium mb-10 text-center px-2">
            {t('epatfmspatae')}
          </p>
          <span className="flex-1" />
          <button className="custom-button text-[24px] px-14" onClick={() => registerButton('/register/teachers')}>{t('getedulearn')}</button>
        </div>

        {/* Universities Section */}
        <div
          className={`flex flex-col text-center items-center w-[400px] h-[550px] ${
            isVisible ? 'animate__animated animate__fadeIn animate__slow' : 'opacity-0'
          }`}
        >
          <div className="w-[210px] mb-10 h-[210px] overflow-hidden bg-cover bg-bottom bg-no-repeat rounded-full">
            <img className="w-full h-full object-cover" src={Universities} alt="Universities" />
          </div>
          <p className="text-[24px] font-semibold mb-6">
          {i18n.language === "en" ? (
              <div>
                  Edulearn for <span className="linear-color">Universities</span>
              </div>
                    ) : (
                       
              <div>
                  {t('edulearnforuniversities')}
              </div>
                )}           
          </p>
          <p className="text-[16px] font-medium mb-10 text-center px-2">
            {t('esembosastppsfioas')}
          </p>
          <span className="flex-1" />
          <button className="custom-button text-[24px] px-14" onClick={() => setShowContactForm(true)}>{t('learnmore')}</button>
        </div>
      </div>
    </>
  );
};

export default Types;
