import Name from '../../assets/ContactForm/Name.png';
import Mail from '../../assets/ContactForm/Mail.png';
import Organization from '../../assets/ContactForm/Organization.png';
import { useState, useEffect } from 'react';
import Loader from '../Loader';
import toast from 'react-hot-toast';
import { postAPI } from '../../caller/axiosUrls';
import { useTranslation } from 'react-i18next'; 

const ContactForm = ({ setShowContactForm }) => {
    const { t,i18n } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        companyName: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            toast(t('peavl'), {
                icon: "⚠️",
            });
            setLoading(false);
            return;
        }
    
        try {
            const response = await postAPI('/mail/send-email', formData);
            toast.success(response.message);
            setFormData({
                name: '',
                email: '',
                companyName: '',
            });
        } catch (error) {
            toast.error(error.message);
        } finally {
            hideContactForm();
        }
    };    

    const hideContactForm = () => {
        const contactForm = document.getElementById("contactForm");
        contactForm.classList.add("fadeoutbottom");
        // contactForm.classList.remove("fadeinbottom");
        setTimeout(() => {
            setShowContactForm(false);
            contactForm.classList.remove("fadeoutbottom");
            setLoading(false);
        }, 300);
    }

    useEffect(() => {
        const contactForm = document.getElementById("contactForm");
        const timer = setTimeout(() => {
            contactForm.classList.add("fadeinbottom");
        }, 100);

        return () => {
            clearTimeout(timer);
            contactForm.classList.remove("fadeinbottom")
        }
    }, []);

    return (
        <>
            <div className="fixed bg-black w-screen opacity-10 h-screen top-0 left-0 z-30"></div>
            <div id="contactForm" className="translate-y-[1000px] fixed w-screen h-screen top-0 left-0 flex items-center justify-center z-30">
                <div className="bg-opacity-90 backdrop-blur-sm bg-[#D9D9D9] absolute flex flex-col items-center w-2/5 rounded-[30px] h-[500px]">
                    {loading ? <Loader type={1} text={t('sending...')} /> :
                    <>
                        <p className="font-semibold text-[36px] mt-10">{t('getintouch')}</p>
                        <div id="contactFormInput" className="mt-4  w-full px-5 flex flex-col gap-y-5">
                            <div className="py-4 px-[30px] gap-x-5 flex items-center w-full bg-customBlue rounded-[30px]">
                                <img src={Name} alt="name" />
                                <input id="name" name="name" value={formData.name} required onChange={handleChange} type="text" maxLength={40} className="font-[300] text-white mb-[-2px] form-input bg-transparent placeholder:text-white w-full" placeholder={t('eyn')} />
                            </div>
                            <div className="py-4 px-[30px] gap-x-5 flex items-center w-full bg-customBlue rounded-[30px]">
                                <img src={Mail} alt="mail" />
                                <input id="email" name="email" value={formData.email} required onChange={handleChange} type="email" maxLength={100} className="font-[300] text-white mb-[-2px] form-input bg-transparent placeholder:text-white w-full" placeholder={t('eyea')} />
                            </div>
                            <div className="py-4 px-[30px] gap-x-5 flex items-center w-full bg-customBlue rounded-[30px]">
                                <img src={Organization} alt="organization" />
                                <input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} type="text" maxLength={100} className="font-[300] text-white mb-[-2px] form-input bg-transparent placeholder:text-white w-full" placeholder={t('eycn')} />
                            </div>
                            <div className='flex items-center justify-between mt-2'>
                                <button onClick={handleSubmit} className="custom-button self-center text-[16px] w-[200px] text-center">{t('connect')}</button>
                                <button className="custom-button bg-red-500 self-center text-[16px] w-[200px] text-center" onClick={hideContactForm}>{t('cancel')}</button>
                            </div>
                        </div>
                    </>}
                </div>
            </div>
        </>
    )
}

export default ContactForm;