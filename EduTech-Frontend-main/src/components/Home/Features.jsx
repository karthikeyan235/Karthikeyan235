import { useEffect, useRef, useState } from 'react';
import Learners from '../../assets/Features/Learners.png';
import Teachers from '../../assets/Features/Teachers.png';
import Admins from '../../assets/Features/Admins.png';
import { useTranslation } from 'react-i18next'; 

const Features = ({ registerButton, setShowContactForm }) => {
  // State for visibility tracking
  const { t,i18n } = useTranslation();
  const [isLearnersVisible, setIsLearnersVisible] = useState(false);
  const [isTeachersVisible, setIsTeachersVisible] = useState(false);
  const [isAdminsVisible, setIsAdminsVisible] = useState(false);

  // Refs for the individual sections
  const learnersRef = useRef();
  const teachersRef = useRef();
  const adminsRef = useRef();

  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    // Intersection Observer for Learners
    const learnersObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLearnersVisible(true);
          learnersObserver.unobserve(entry.target);
        }
      },
      observerOptions
    );

    // Intersection Observer for Teachers
    const teachersObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTeachersVisible(true);
          teachersObserver.unobserve(entry.target);
        }
      },
      observerOptions
    );

    // Intersection Observer for Admins
    const adminsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAdminsVisible(true);
          adminsObserver.unobserve(entry.target);
        }
      },
      observerOptions
    );

    // Observing each section
    if (learnersRef.current) learnersObserver.observe(learnersRef.current);
    if (teachersRef.current) teachersObserver.observe(teachersRef.current);
    if (adminsRef.current) adminsObserver.observe(adminsRef.current);

    return () => {
      if (learnersRef.current) learnersObserver.unobserve(learnersRef.current);
      if (teachersRef.current) teachersObserver.unobserve(teachersRef.current);
      if (adminsRef.current) adminsObserver.unobserve(adminsRef.current);
    };
  }, []);

  return (
    <div id="Features" className="px-20 py-10 flex flex-col justify-center">
      <p className="font-medium text-[48px] mb-32 text-black text-center animate__animated animate__fadeInUp">
        {t('odaps')}<br />{t('foreducation')}
      </p>

      {/* Learners Section */}
      <div ref={learnersRef} className={`flex mb-40 relative h-[500px] items-end`}>
        <div
            className={`flex flex-col self-end ${
                isLearnersVisible ? 'animate__animated animate__fadeInUp animate_faster' : 'opacity-0'
            }`}
        > {i18n.language === "en" ? (
          <div>
              <p className="font-semibold text-[24px] mb-6">
            For <span className="linear-color">Learners</span>
          </p>
          </div>
            ) : (
          <div>
             <p className="font-semibold text-[24px] mb-6">
                  {t('learnersfor')}
              </p>
          </div>
          )}    
          
          <p className="font-medium text-[40px] text-black mb-3.5 w-2/5">{t('etbasfl')}</p>
          <p className="font-[400] mb-9 w-2/5">
            {t('eopletaatthymsm')}
          </p>
          <div className="mt-4 gap-x-9 flex">
            <button className="custom-button text-[16px] px-4" onClick={() => registerButton('/register/learners')}>{t('getedulearn')}</button>
            <button className="custom-button-white text-[14px] px-3" onClick={() => registerButton('/register')}>{t('suff')}</button>
          </div>
        </div>
        <img
            className={`absolute right-0 w-[700px] ${
                isLearnersVisible ? 'animate__animated animate__fadeInUp animate_faster' : 'opacity-0'
            }`}
            src={Learners}
            alt="For Learners"
        />
      </div>

      {/* Teachers Section */}
      <div ref={teachersRef} className={`flex mb-40 relative h-[500px] items-end justify-end`}>
        <img
            className={`absolute left-0 w-[700px] ${
                isTeachersVisible ? 'animate__animated animate__fadeInUp animate_faster' : 'opacity-0'
            }`}
            src={Teachers}
            alt="For Teachers"
        />
        <div 
            className={`flex flex-col self-end w-[600px] text-right ${
                isTeachersVisible ? 'animate__animated animate__fadeInUp animate_faster' : 'opacity-0'
            }`}
        >{i18n.language === "en" ? (
          <div>
              <p className="font-semibold text-[24px] mb-6">
            For <span className="linear-color">Teachers</span>
          </p>
          </div>
            ) : (
          <div>
              <p className="font-semibold text-[24px] mb-6">
                  {t('teachersfor')}
              </p>
          </div>
          )}    
          
          <p className="font-medium text-[40px] text-black mb-3.5">{t('etbaft')}</p>
          <p className="font-[400] mb-9">
            {t('epatfmspatae')}
          </p>
          <div className="mt-4 gap-x-5 flex self-end">
            <button className="custom-button text-[16px] px-4" onClick={() => registerButton('/register/teachers')}>{t('getedulearn')}</button>
            <button className="px-[20px] text-[16px] hover:underline text-customBlue font-semibold" onClick={() => setShowContactForm(true)}>{t('learnmore')}</button>
          </div>
        </div>
      </div>

      {/* Admins Section */}
      <div ref={adminsRef} className={`flex mb-20 relative h-[500px] items-end`}>
        <div
            className={`flex flex-col self-end ${
                isAdminsVisible ? 'animate__animated animate__fadeInUp animate_faster' : 'opacity-0'
            }`}
        >{i18n.language === "en" ? (
          
              <p className="font-semibold text-[24px] mb-6">
            For <span className="linear-color">Admins</span>
          </p>
          
            ) : (
          
              <p className="font-semibold text-[24px] mb-6">
                  {t('adminsfor')}
              </p>
          
          )}    
          
          <p className="font-medium text-[40px] text-black mb-3.5 w-2/5">{t('etbsasfc')}</p>
          <p className="font-[400] mb-9 w-2/5">
            {t('esembosastppsfioas')}
          </p>
          <div className="mt-4 gap-x-5 flex">
            <button className="custom-button text-[16px] px-4" onClick={() => registerButton('/register/admin')}>{t('getedulearn')}</button>
            <button className="px-[20px] text-[16px] hover:underline text-customBlue font-semibold" onClick={() => setShowContactForm(true)}>{t('learnmore')}</button>
          </div>
        </div>
        <img
            className={`absolute right-0 w-[700px] ${
                isAdminsVisible ? 'animate__animated animate__fadeInUp animate_faster' : 'opacity-0'
            }`}
            src={Admins}
            alt="For Admins"
        />
      </div>
      <div id="FAQs" />
    </div>
  );
};

export default Features;