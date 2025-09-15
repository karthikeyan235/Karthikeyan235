import { useEffect, useRef } from 'react';
import Blur from '../../assets/Blur.png';
import { useNavigate } from 'react-router-dom';
import MeridianLogo from '../../assets/MeridianLogo.png';
import FooterBanner from '../../assets/Virtual_meeting.png';
import Canada from '../../assets/Flags/Canada.png';
import India from '../../assets/Flags/India.png';
import Ireland from '../../assets/Flags/Ireland.png';
import SaudiArabia from '../../assets/Flags/SaudiArabia.png';
import UAE from '../../assets/Flags/UAE.png';
import UK from '../../assets/Flags/UK.png';
import USA from '../../assets/Flags/USA.png';
import Singapore from '../../assets/Flags/Singapore.png';
import Instagram from '../../assets/Socials/Instagram.png';
import LinkedIn from '../../assets/Socials/LinkedIn.png';
import Twitter from '../../assets/Socials/Twitter.png';
import Youtube from '../../assets/Socials/Youtube.png';
import Marquee from "react-fast-marquee";
import { useTranslation } from 'react-i18next'; 

const Footer = ({ registerButton }) => {
    const { t, i18n } = useTranslation();
    const animateRefs = useRef([]);

    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate__animated', entry.target.dataset.animation);
                        observer.unobserve(entry.target); // Only animate once
                    }
                });
            },
            { threshold: 0.1 }
        );

        animateRefs.current.forEach((ref) => ref && observer.observe(ref));

        return () => {
            animateRefs.current.forEach((ref) => ref && observer.unobserve(ref));
        };
    }, []);

    const flags = [
        { src: Canada, alt: 'Canadian Flag' },
        { src: UAE, alt: 'UAE Flag' },
        { src: USA, alt: 'USA Flag' },
        { src: UK, alt: 'UK Flag' },
        { src: SaudiArabia, alt: 'Saudi Arabian Flag' },
        { src: India, alt: 'Indian Flag' },
        { src: Ireland, alt: 'Irish Flag' },
        { src: Singapore, alt: 'Singapore Flag' },
        { src: Canada, alt: 'Canadian Flag' },
        { src: UAE, alt: 'UAE Flag' },
        { src: USA, alt: 'USA Flag' },
        { src: UK, alt: 'UK Flag' },
        { src: SaudiArabia, alt: 'Saudi Arabian Flag' },
        { src: India, alt: 'Indian Flag' },
        { src: Ireland, alt: 'Irish Flag' },
        { src: Singapore, alt: 'Singapore Flag' },
    ];

    const socials = [
        { src: Youtube, alt: 'Youtube Icon', links: "https://www.youtube.com/channel/UCUu7tZJBEom0EHpXXWg45Vg" },
        { src: Instagram, alt: 'Instagram Icon', links: "https://www.instagram.com/onmeridian/" },
        { src: Twitter, alt: 'Twitter Icon', links: "https://x.com/i/flow/login?redirect_after_login=%2FOn_Meridian" },
        { src: LinkedIn, alt: 'LinkedIn Icon', links: "https://www.linkedin.com/company/on-meridian/" },
    ];

    return (
        <div className="relative flex flex-col mt-5 gap-y-7 items-center">
            <img className="absolute w-7/12 top-0 saturate-200 brightness-90" src={Blur} alt="Blur" />
            <p ref={(el) => (animateRefs.current[0] = el)} data-animation="animate__fadeInDown" className="linear-color z-10 text-[70px] font-semibold">
                Edulearn.ai
            </p>
            <p ref={(el) => (animateRefs.current[1] = el)} data-animation="animate__fadeInDown" className="font-semibold z-10 mb-3 text-[40px]">
                {t('by')}
            </p>
            <img ref={(el) => (animateRefs.current[2] = el)} data-animation="animate__fadeInDown" className="z-10 w-[600px]" src={MeridianLogo} alt="Meridian Logo" />
            
            <div ref={(el) => (animateRefs.current[3] = el)} data-animation="animate__fadeInUp" className="mt-16 gap-x-9 flex">
                <button className="custom-button text-[24px] px-14" onClick={() => registerButton('/register')}>{t('getedulearn')}</button>
                <button className="custom-button-white text-[24px]" onClick={() => registerButton('/register/admin')}>{t('suff')}</button>
            </div>
            <img ref={(el) => (animateRefs.current[4] = el)} data-animation="animate__zoomIn" className="w-9/12 mt-20" src={FooterBanner} alt="Footer Banner" />
            
            <p ref={(el) => (animateRefs.current[5] = el)} data-animation="animate__fadeInDown" className="italic text-customBlue text-[32px] mb-20">
                {t('dbluba')}
            </p>
            
            <div ref={(el) => (animateRefs.current[6] = el)} data-animation="animate__fadeInRight" className="flex mb-10">
                <Marquee className='h-[200px]'>
                    {flags.map((flag, index) => (
                        <img key={index} className="hover:scale-110 mr-10 hover:shadow-2xl" src={flag.src} alt={flag.alt} />
                    ))}
                </Marquee>
            </div>

            <span className="w-9/12 border-[1px] mb-4 border-customBlue" />
            
            <div className="flex justify-center mb-10" ref={(el) => (animateRefs.current[10] = el)} data-animation="animate__fadeInDown">   
                <p
                    onClick={() => window.open("https://onmeridian.com/", "_blank")}
                    className="cursor-pointer hover:scale-110 active:scale-90 font-semibold px-5"
                >
                    {t('vmspl')}
                </p>
                <p 
                    onClick={() => navigate('/home/TermsAndConditions')}
                    className='cursor-pointer hover:scale-110 active:scale-90 font-semibold px-5'
                >
                    {t('t&u')}
                </p>
                <p
                    onClick={() => navigate('/home/PrivacyPolicy')}
                    className="cursor-pointer hover:scale-110 active:scale-90 font-semibold px-5"
                >
                    {t('privacy_policy')}
                </p>
                <p
                    onClick={() => navigate('/home/RefundPolicy')}
                    className="cursor-pointer hover:scale-110 active:scale-90 font-semibold px-5"
                >
                    Refund Policy
                </p>
                <p
                    onClick={() => navigate('/home/AccountDeletion')}
                    className="cursor-pointer hover:scale-110 active:scale-90 font-semibold px-5"
                >
                    Account Deletion
                </p>
                {/* <p 
                    onClick={() => navigate('/home/CookiesNetwork')}
                    className='cursor-pointer hover:scale-110 active:scale-90 font-semibold px-5'
                >
                    {t('cookiesnetwork')}
                </p> */}
            </div>

            <p className='font-bold text-[40px] mb-6 text-customBlue animate__animated' ref={(el) => (animateRefs.current[11] = el)} data-animation="animate__fadeInDown">Edulearn.ai</p>

            <div className="flex text-white py-16 px-5 w-full bg-customBlue rounded-t-[30px]">
                <div className="w-[250px] flex flex-col gap-y-16">
                    {[{label:t('teachers'), link:'teachers'}, {label:t('learners'), link:'learners'}, {label:t('admins'), link:'admin'}].map((role, i) => (
                    <div
                        key={role}
                        className="flex flex-col cursor-pointer hover:underline"
                        onClick={() => registerButton(`/register/${role.link}`)}
                        ref={(el) => (animateRefs.current[12] = el)} // Directly assigning refs
                        data-animation="animate__fadeInDown"
                    >
                        <p className="font-bold text-[40px] leading-none mb-2">Edulearn.ai</p>
                        {i18n.language === "en" ? (
                         <p className="font-semibold text-[24px] leading-none">For {role.label}</p>
                    ) : (
                        
                        <p className="font-semibold text-[24px] leading-none">
                            {role.label} {t('for')}
                        </p>
                    )}
                        
                    </div>
                    ))}
                </div>
                <div className="grow flex flex-col">
                    <div
                    className="flex gap-x-[40px] justify-center"
                    ref={(el) => (animateRefs.current[13] = el)} // Assigning ref directly
                    data-animation="animate__fadeInDown"
                    >
                    <p onClick={() => {
                        // Using the id of the target element to scroll to it
                        document.getElementById('types').scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });}}
                        className="font-medium text-[24px] cursor-pointer hover:underline">{t('aboutus')}</p>
                    <p className="font-medium text-[24px] cursor-pointer hover:underline" onClick={() => registerButton('/register')}>{t('getedulearn')}</p>
                    <p onClick={() => {
                        // Using the id of the target element to scroll to it
                        document.getElementById('FAQs').scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }} className="cursor-pointer hover:underline font-medium text-[24px]">{t('faqs')}</p>
                    </div>

                    <div
                    className="flex mt-28 mb-36 px-5"
                    ref={(el) => (animateRefs.current[14] = el)} // Assigning ref directly
                    data-animation="animate__fadeInDown"
                    >
                    {[
                        { country: t('india'), flag: India, address: t('ad1') },
                        { country: t('uae'), flag: UAE, address: t('ad2') },
                        { country: t('singapore'), flag: Singapore, address: t('ad3') },
                    ].map((location, idx) => (
                        <div key={idx} className={`grow flex flex-col max-w-[300px] px-4 ${idx <= 1 ? "border-r-[2px]" : ""} border-white`}>
                        <div className="flex gap-x-5 items-center justify-center">
                            <img className="w-[35px] h-[25px]" src={location.flag} alt={`${location.country} Flag`} />
                            <p className="font-medium text-[20px]">{location.country}</p>
                        </div>
                        <p className="mt-3 text-center text-sm">{location.address}</p>
                        </div>
                    ))}
                    </div>

                    <p
                    className="text-center"
                    ref={(el) => (animateRefs.current[15] = el)} // Assigning ref directly
                    data-animation="animate__fadeInDown"
                    >
                    {t('mspl2arr')}
                    </p>
                </div>

                <div className="w-[250px] flex justify-end">
                    <div
                    className="flex mb-28 justify-between w-full h-[45px]"
                    ref={(el) => (animateRefs.current[16] = el)} // Assigning ref directly
                    data-animation="animate__fadeInDown"
                    >
                    {socials.map((social, index) => (
                        social.alt === "Youtube Icon" ? <img onClick={() => window.open(social.links, "_blank")} key={index} className="hover:scale-110 active:scale-90" src={social.src} alt={social.alt} /> :
                        <img onClick={() => window.open(social.links, "_blank")} key={index} className="hover:scale-110 active:scale-90" src={social.src} alt={social.alt} />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
