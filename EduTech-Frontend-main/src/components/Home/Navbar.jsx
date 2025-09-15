import { useEffect, useState, useRef } from "react";
import LanguageDropdown from "../LanguageDropdown";
import Logo from "../../assets/Edulearn.png";
import { useTranslation } from 'react-i18next'; 
import { useNavigate } from "react-router-dom";

const Navbar = ({ loading, registerButton }) => {
  const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false); 
    const navRef = useRef(null);
    const navigate = useNavigate();
    const initialLoading = useRef(loading); // Store initial loading value

    useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
              if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.unobserve(entry.target);
              }
          },
          { threshold: 0.2 }
      );

      if (navRef.current) {
          observer.observe(navRef.current);
      }

      return () => {
          if (navRef.current) {
              observer.unobserve(navRef.current);
          }
      };
    }, []);

    useEffect(() => {
        if (!isVisible) return; 
        
        const navbar = document.getElementById("navbar");
    
        const handleScroll = () => {
          if (window.scrollY > 5) {
            navbar.classList.remove("transparent");
            navbar.classList.remove("shadow-none");
            navbar.classList.add("bg-white");
            navbar.classList.add("shadow");
          } else {
            navbar.classList.remove("bg-white");
            navbar.classList.remove("shadow");
            navbar.classList.add("transparent");
            navbar.classList.add("shadow-none");
          }
        };
        
        window.addEventListener("load", handleScroll);
        window.addEventListener("scroll", handleScroll);
    
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("load", handleScroll);
        };
    }, [isVisible]);

    return (
        <nav 
          ref={navRef} 
          id="navbar" 
          style={{ transition: "all 0.3s ease" }} 
          className={`z-20 w-screen h-[100px] px-[45px] fixed flex items-center justify-center ${
            isVisible ? `animate__animated animate__fadeInDown ${initialLoading.current ? "animate__delay-3s" : ""}` : 'opacity-0' 
          }`}
        > 
            <img src={Logo} alt="Logo" className="w-[50px] h-[50px] mr-5 cursor-pointer" />
            <p onClick={() => {
              navigate('/home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} className="cursor-pointer font-semibold text-4xl linear-color flex-1">Edulearn.ai</p>
            <div className="flex items-center justify-center">
                <div className="flex gap-x-12 mr-20 items-center justify-center">
                    <button onClick={() => registerButton('/register/teachers')} className="font-medium text-sm hover:border-b hover:border-black hover:translate-y-[-2px]">{t('teachers')}</button>
                    <button onClick={() => registerButton('/register/learners')} className="font-medium text-sm hover:border-b hover:border-black hover:translate-y-[-2px]">{t('learners')}</button>
                    <button onClick={() => registerButton('/register/admin')} className="font-medium text-sm hover:border-b hover:border-black hover:translate-y-[-2px]">{t('admins')}</button>
                    <button onClick={() => {
                        // Using the id of the target element to scroll to it
                        document.getElementById('Features').scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }} className="font-medium text-sm hover:border-b hover:border-black hover:translate-y-[-2px]">{t('topfeatures')}</button>
                    <button onClick={() => {
                        // Using the id of the target element to scroll to it
                        document.getElementById('FAQs').scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }} className="font-medium text-sm hover:border-b hover:border-black hover:translate-y-[-2px]">{t('faqs')}</button>
                </div>
                <div className="flex gap-x-5 items-center justify-center">
                    <LanguageDropdown />
                    <a href="https://play.google.com/store/apps/details?id=com.edlrn.app">
                      <img src="/googleplay.svg" alt="Google Play" />
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;