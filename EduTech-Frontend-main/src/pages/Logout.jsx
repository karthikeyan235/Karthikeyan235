import Goodbye from '../assets/Goodbye.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Logout = () => {
    const { i18n,t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full h-screen justify-center items-center">
            <img src={Goodbye} className='w-[90%] md:w-[40%]' alt={t('goodbye')} />
            <p className='font-bold mt-4 text-4xl'>{t('seeyousoon')}</p>
            <button className='btn btn-dark mt-4' onClick={() => navigate('/dashboard')}>{t('backtohome')}</button>
        </div>
    )
}

export default Logout;