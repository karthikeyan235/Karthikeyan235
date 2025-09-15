import { useEffect, useRef, useState } from 'react';
import Client1 from '../../assets/Clients/Canada.png';
import Client2 from '../../assets/Clients/Lincoln.png';
import Client3 from '../../assets/Clients/Florida.png';
import Client4 from '../../assets/Clients/Tasmania.png';
import MeridianLogoWhite from '../../assets/meridian_logo_white.png';
import { useTranslation } from 'react-i18next'; 

const Clients = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  const { t } = useTranslation();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`py-2 mt-5 flex flex-col items-center bg-customBlue rounded-t-[30px] ${
        isVisible ? 'animate__animated animate__fadeInUp' : ''
      }`}
    >
      <p
        className={`text-center mt-2 font-bold text-[50px] mb-4 text-white ${
          isVisible ? 'animate__animated animate__fadeInUp' : ''
        }`}
      >
        Edulearn.ai<br/><p className='font-normal text-[20px] mt-[-10px] leading-none'>{t('aproductof')}</p>
      </p>
      <div
        className={`flex mb-4 w-full items-center justify-evenly ${
          isVisible ? 'animate__animated animate__fadeInUp' : ''
        }`}
      >
        <img 
          className='w-[200px] hover:scale-105'
          src={MeridianLogoWhite}
          alt="Meridian Logo"
        />
        {/* <img
          className="h-fit hover:scale-105"
          src={Client1}
          alt="client-1"
        />
        <img
          className="h-fit hover:scale-105"
          src={Client2}
          alt="client-2"
        />
        <img
          className="h-fit hover:scale-105"
          src={Client3}
          alt="client-3"
        />
        <img
          className="h-fit hover:scale-105"
          src={Client4}
          alt="client-4"
        /> */}
      </div>
    </div>
  );
};

export default Clients;
