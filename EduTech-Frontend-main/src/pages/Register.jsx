import { useEffect, useContext } from 'react';
import Admin from '../assets/Register/Admin.png';
import Learners from '../assets/Register/Learners.jpg';
import Teachers from '../assets/Register/Teachers.png';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next'; 


const Register = () => {
    const { i18n, t } = useTranslation();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const { iid, key, bid, qid } = useParams();

    const fadeOut = (panel) => {
        const register = document.getElementById("register");
        register.classList.add("fadeout");
        setTimeout(() => {
          navigate(panel)
        }, 1000)
    }

    useEffect(() => {
        if (token) navigate(`/${sessionStorage.getItem('role')}`);
    }, [token])

    useEffect(() => {
        const teacherLoginText = document.getElementById("teacherLoginText");
        const studentLoginText = document.getElementById("studentLoginText");
        const adminLoginText = document.getElementById("adminLoginText");
        sessionStorage.removeItem('adpid');
        sessionStorage.removeItem('first');
        sessionStorage.removeItem("adaptiveResult");
        const teacherLoginImage = document.getElementById("teacherLoginImage");
        const studentLoginImage = document.getElementById("studentLoginImage");
        const adminLoginImage = document.getElementById("adminLoginImage");
        const timer = setTimeout(() => {
            teacherLoginText.classList.add("fadeintoplogin");
            studentLoginText.classList.add("fadeintoplogin");
            adminLoginText.classList.add("fadeintoplogin");
            teacherLoginImage.classList.add("fadeinbottomround");
            studentLoginImage.classList.add("fadeinbottomround");
            adminLoginImage.classList.add("fadeinbottomround");
        }, 100);

        return () => {
            teacherLoginText.classList.remove("fadeintoplogin");
            studentLoginText.classList.remove("fadeintoplogin");
            adminLoginText.classList.remove("fadeintoplogin");
            teacherLoginImage.classList.remove("fadeinbottomround");
            studentLoginImage.classList.remove("fadeinbottomround");
            adminLoginImage.classList.remove("fadeinbottomround");
            clearTimeout(timer);
        }
    }, []);

    return  (
        <div id="register" className='flex h-screen overflow-hidden'>  
            <div className='flex-1 flex flex-col grow items-center'>
                <div id="teacherLoginText" className='flex my-4 flex-col items-center translate-y-[-400px]'>
                {i18n.language === "en" ? (
                                    <div className='text-center'>
                                        <p className='font-bold text-[24px] mt-7'>Edulearn for</p>
                                        <p className='font-bold text-[40px] linear-color leading-none'>Teachers</p>
                                    </div>
                                    ) : (
                       
                                    <div>
                                        <p className='font-bold text-[24px] mt-7'>
                                      {t('edulearnforteachers')}
                                      </p>
                                    </div>
                                      )}    
                    
                    <button onClick={() => fadeOut(`/register/teachers${qid ? `/quiz/${qid}` : ''}${bid ? `/book/${bid}` : ''}${iid ? (key ? `/${iid}/${key}` : `/${iid}`) : ''}`)} className="custom-button text-[16px] w-[200px] mt-4 px-14">{t('login')}</button>
                </div>
                <div id="teacherLoginImage" className='mt-5 w-full overflow-hidden image grow bg-cover bg-center bg-no-repeat translate-y-[400px]'>
                    <img className="w-full h-full object-cover object-center" src={Teachers} alt="Teachers Login" />
                </div>
            </div>
            <div className='flex-1 flex flex-col grow items-center'>
                <div id="studentLoginText" className='flex my-4 flex-col items-center translate-y-[-400px]'>
                {i18n.language === "en" ? (
                                    <div className='text-center'>
                                        <p className='font-bold text-[24px] mt-7'>Edulearn for</p>
                                        <p className='font-bold text-[40px] linear-color leading-none'>Learners</p>
                                    </div>
                                    ) : (
                       
                                    <div>
                                        <p className='font-bold text-[24px] mt-7'>
                                      {t('edulearnforlearners')}
                                      </p>
                                    </div>
                                      )}    
                    
                    <button onClick={() => fadeOut(`/register/learners${qid ? `/quiz/${qid}` : ''}${bid ? `/book/${bid}` : ''}${iid ? (key ? `/${iid}/${key}` : `/${iid}`) : ''}`)} className="custom-button text-[16px] w-[200px] mt-4 px-14">{t('login')}</button>
                </div>
                <div id="studentLoginImage" className='mt-5 w-full overflow-hidden image grow bg-cover bg-center bg-no-repeat translate-y-[400px]'>
                    <img className="w-full h-full object-cover object-center" src={Learners} alt="Learners Login" />
                </div>
            </div>
            <div className='flex-1 flex flex-col grow items-center'>
                <div id="adminLoginText" className='flex my-4 flex-col items-center translate-y-[-400px]'>
                {i18n.language === "en" ? (
                            <div className='text-center'>
                                <p className='font-bold text-[24px] mt-7'>Edulearn for</p>
                                <p className='font-bold text-[40px] linear-color leading-none'>Admins</p>
                            </div>
                                ) : (
                       
                            <div>
                                <p className='font-bold text-[24px] mt-7'>
                                    {t('edulearnforadmins')}
                                </p>
                            </div>
                                )}   
                
                    
                    <button onClick={() => fadeOut('/register/admin')} className="custom-button text-[16px] w-[200px] mt-4 px-14">{t('login')}</button>
                </div>
                <div id="adminLoginImage" className='mt-5 w-full overflow-hidden image grow bg-cover bg-center bg-no-repeat translate-y-[400px]'>
                    <img className="w-full h-full object-cover object-center" src={Admin} alt="Admin Login" />
                </div>
            </div>
        </div>
    )
}

export default Register; 