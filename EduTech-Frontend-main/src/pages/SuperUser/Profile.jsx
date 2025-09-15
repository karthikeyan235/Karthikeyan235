import { useNavigate } from "react-router-dom";
import Mail from '../../assets/MailBlue.png'; // Update with the actual path to the email icon image
import InstituteFooter from '../../components/InstituteFooter';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { i18n,t } = useTranslation();
    const username = sessionStorage.getItem('username');
    const userEmail = sessionStorage.getItem('superUserEmail');
    const navigate = useNavigate();

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-full flex flex-col items-center overflow-hidden">
                <p className="text-3xl font-semibold mt-10">{t('editprofile')}</p>
 
                {/* Username Field with Email Icon Inside Input */}
                <label htmlFor="username" className="ml-1 mt-4 mb-2">{t('username')}</label>
                <div className="relative flex items-center rounded-[30px] bg-[#F5F5F5] border border-white px-2 w-full md:w-[400px] mt-1">
                    <img
                        src={Mail}
                        alt="Mail Icon"
                        className="absolute h-[16px] left-6 transform w-[20px]"
                    />
                    <input
                        id="username"
                        type="text"
                        className="w-full pl-14 pr-5 mt-[2px] py-2 truncate text-customBlue font-semibold"
                        value={username}
                        disabled
                    />
                </div>

                {/* Updated part */}
                {/* UserEmail Field with Email Icon Inside Input */}
                <label htmlFor="userEmail" className="ml-1 mt-4 mb-2">{t('usermail')}</label>
                <div className="relative flex items-center rounded-[30px] bg-[#F5F5F5] border border-white px-2 w-full md:w-[400px] mt-1">
                    <img
                        src={Mail}
                        alt="Mail Icon"
                        className="absolute h-[16px] left-6 transform w-[20px]"
                    />
                    <input
                        id="userEmail"
                        type="text"
                        className="w-full pl-14 pr-5 mt-[2px] py-2 truncate text-customBlue font-semibold"
                        value={userEmail}
                        disabled
                    />
                </div>
 
                {/* Change Password Link on the Right Side */}
                <div className="w-full md:w-[400px] flex justify-end mt-2">
                    <p
                        className="text-customBlue underline cursor-pointer"
                        onClick={() => navigate('/register/admin', { state: { forgetPass: true, username: username } })}
                    >
                        {t('changepassword')}
                    </p>
                </div>
 
                {/* Bottom Blue Strip */}
                <div className="fixed bottom-0">
                    <InstituteFooter />
                </div>
            </div>
        </div>
    );
}
 
export default Profile;