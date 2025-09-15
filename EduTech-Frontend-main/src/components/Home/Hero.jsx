import { useEffect, useState, useRef } from "react";
import Hero1 from '../../assets/Hero/Hero1.png';
import Hero2 from '../../assets/Hero/Hero2.png';
import Hero3 from '../../assets/Hero/Hero3.png';
import Hero4 from '../../assets/Hero/Hero4.png';
import Hero5 from '../../assets/Hero/Hero5.png';
import Logo from "../../assets/Edulearn.png";
import link from '../../assets/link.png';
import { useTranslation } from 'react-i18next'; 
import { TypeAnimation } from 'react-type-animation';

const Hero = ({ loading, registerButton, setShowContactForm }) => {
    const { t, i18n } = useTranslation();
    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false); 
    const heroRef = useRef(null);
    const initialLoading = useRef(loading); // Store initial loading value
    const [render1, setRender1] = useState(false);
    const [render2, setRender2] = useState(false);
    const [render3, setRender3] = useState(false);
    const [render4, setRender4] = useState(false);

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

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => {
            if (heroRef.current) {
                observer.unobserve(heroRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let intervalId;
        let intervalTimeout = setTimeout(() => {
            intervalId = setInterval(() => {
                let lines = document.getElementById("lines");
                let images = document.getElementById("hero-img");
                lines.classList.remove("fadeinout");
                images.classList.remove("fadeinout");
                setIndex((prevIndex) => (prevIndex !== 4 ? prevIndex + 1 : 0));
                images.classList.add("fadeinout");
                lines.classList.add("fadeinout");
            }, 2000);
        }, 4000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(intervalTimeout);
        };
    }, [isVisible]);

    useEffect(() => {
        setTimeout(() => {
            const strikeEl = document.getElementById('strike');
            strikeEl?.classList.add("strikethrough");
        }, 2000);
    }, [])

    const lines = [
        t('yacayaeays'),
        t('sytwuasqcg'),
        t('am&typwddr'),
        t('yoc&apta'),
        t('agtwtec')
    ];

    const images = [Hero1, Hero2, Hero3, Hero4, Hero5];

    return (
        <div
            ref={heroRef}
            className={`flex flex-col mt-[100px] ${
                isVisible ? `animate__animated animate__fadeInDown ${initialLoading.current ? "animate__delay-4s" : "animate__delay-1s"}` : 'opacity-0'
            }`}
        >
            <h1 className="font-semibold mt-4 mb-3 text-center self-center w-7/12 italic text-4xl">
                   {i18n.language === "en" ? (
                        <div className="flex flex-col h-[90px] gap-y-2">
                            <div className="flex items-center gap-x-3">
                                <TypeAnimation
                                    sequence={[sessionStorage.getItem('loader') !== '1' ? 5000 : 2000, "The", () => setRender1(true)]}
                                    speed={50}
                                    wrapper="h1"
                                    repeat={0}
                                    cursor={false}
                                />
                                {render1 ? 
                                    <TypeAnimation
                                        sequence={[" faster", 500, (el) => el.classList.add("strikethrough"), () => setRender2(true)]}
                                        speed={50}
                                        wrapper="h1"
                                        repeat={0}
                                        cursor={false}
                                    /> : null}
                                {render2 ? 
                                    <TypeAnimation
                                        sequence={[(el) => el.classList.add("linear-color"), 1000, " Smarter", () => setRender3(true)]}
                                        speed={50}
                                        wrapper="h1"
                                        repeat={0}
                                        cursor={false}
                                    /> : null}  
                                {render3 ? 
                                    <TypeAnimation
                                        sequence={["way to learn from AI,", () => setRender4(true)]}
                                        speed={40}
                                        wrapper="h1"
                                        repeat={0}
                                        cursor={false}
                                    /> : null}
                            </div>
                            <div className="flex ml-[280px] items-center gap-x-3">
                                {render4 ? 
                                    <TypeAnimation
                                        sequence={["starts Here!"]}
                                        speed={50}
                                        wrapper="h1"
                                        repeat={0}
                                        cursor={false}
                                    /> : null}
                            </div>
                        </div>
                        //  <div>
                        //     “The <span className="line-through">faster</span> <span className="linear-color">Smarter</span> way to learn from AI, <br/>starts <span className="linear-color">Here!</span>“
                        // </div>
                    ) : (
                        
                        <div>
                            {t('maintexthome')}
                        </div>
                    )}
            </h1>
            <div className="flex px-[45px]">
                <div className="flex flex-col w-7/12">
                    <div className="flex items-center">
                        <img src={Logo} alt="Logo" className="w-[150px] h-[150px] mr-10 cursor-pointer" />
                        <p className="font-semibold text-[80px] linear-color">Edulearn.ai</p>
                    </div>
                    <p id="lines" className="text-[30px] mt-5 max-w-[1000px] pr-10">{lines[index]}</p>
                    <div className="mt-4 gap-x-4 flex flex-wrap">
                        <button className="custom-button text-[14px] px-5" onClick={() => registerButton("/register")}>{t('getedulearn')}</button>
                        <button className="custom-button-white text-[14px] px-3 flex items-center gap-x-3" onClick={() => setShowContactForm(true)}>{t('contactus')} <img src={link} alt="Link" /></button>
                    </div>
                </div>
                <div className="flex-1 mt-5 flex justify-end items-center">
                    <img id="hero-img" className="h-[360px]" src={images[index]} alt={`hero-${index}`} />
                </div>
            </div>
        </div>
    );
};

export default Hero;