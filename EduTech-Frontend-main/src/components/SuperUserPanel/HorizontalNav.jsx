import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlanContext } from "../../contexts/PlanContext";
import LanguageDropdown from "../LanguageDropdown";
import { RiArrowDropDownLine } from "react-icons/ri";
import Processing from "../Processing";
import MeridianLogoBlue from '../../assets/meridian_logo.png';
import Logout from '../../assets/Logout.png'
import Profile from '../../assets/Profile.png';
import toast from 'react-hot-toast';
import { SuperUserContext } from "../../contexts/SuperUserContext"
import { postAPI } from '../../caller/axiosUrls';


const HorizontalNav = () => {
  const { i18n, t } = useTranslation();
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sender, setSender] = useState(false);

  const { plan } = useContext(PlanContext);
  const { setSupertoken, setSuperUser } = useContext(SuperUserContext);

  const instName = sessionStorage.getItem("instituteName");

  useEffect(() => {
    const pathname = location.pathname;
    switch (pathname) {
      case "/superuser":
      case "/superuser/dashboard":
        setTab("dashboard");
        break;
      default:
        setTab("");
        break;
    }
  }, [location.pathname]);

  const handleTabChange = (tabNo) => {
    setTab(tabNo);
    navigate(tabNo);
  };

  const handleLogout = async () => {
    if (sender) return;
    else setSender(true);
    
    try {
        const response = await postAPI('/superuser/logout');
        sessionStorage.removeItem('supertoken');
        sessionStorage.removeItem('sup-id');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('iid');
        sessionStorage.removeItem('instituteName');
        setSupertoken(null);
        setSuperUser(null);
        toast.success(response.message);
        navigate('/home');
    } catch (error) {
        toast.error(error.message);
    } finally {
        setSender(false);
    }
  }

  return (
    <>
      {sender ? <Processing /> : null}
      <div className="flex relative justify-between items-center px-5 bg-white z-30 h-[110px]">
        <div className="flex grow justify-between mr-52">
          <div className="flex cursor-pointer flex-col justify-center">
              <span onClick={() => navigate('/home')} className="font-semibold text-[32px] leading-none linear-color">
                  Edulearn.ai
              </span>
              <span onClick={() => setShowDropdown(!showDropdown)} className="font-semibold flex items-center gap-x-2 text-[20px] leading-0 text-customBlue">
                  <p>{t('foradmins')}</p>
                  <RiArrowDropDownLine className="text-[30px] mt-[2px]" />
              </span>
          </div>
          <div className="flex items-center text-[16px] font-medium gap-x-10">
            <button className={`${tab === 'dashboard' ? 'scale-125 text-[#2E5BFF]' : ''} active:scale-90 hover:scale-125 hover:text-[#2E5BFF]`} onClick={() => handleTabChange('dashboard')}>{t('dashboard')}</button>
          </div>
        </div>
        <div className="flex gap-x-8 items-center">
          <p className="w-[200px] truncate font-medium text-center" title={instName}>
            {instName === 'Meridian Solutions Trial' ? <img src={MeridianLogoBlue} alt="Meridian Logo" /> : instName}
          </p>
          <LanguageDropdown />
        </div>
        {/* Dropdown */}
        <div className={`${showDropdown ? "opacity-100 scale-100" : "opacity-0 scale-90 hidden"} z-30 absolute flex flex-col bottom-[-30px] left-[40px] w-[210px] text-[20px] border-[1px] border-white overflow-hidden shadow-md bg-gray-100 items-center rounded-[15px]`}>
            <div onClick={handleLogout} className='flex px-4 py-2 hover:bg-gray-300 cursor-pointer w-full items-center justify-evenly text-[#AD1519]'>
                <img className="w-[22px] h-[20px]" src={Logout} alt="Logout" />
                <p>{t('logout')}</p>
            </div>
        </div>
        <img onClick={() => navigate('/superuser/profile')} className="cursor-pointer ml-5 hover:scale-110 active:scale-90" title="Profile" src={Profile} alt="Profile Image" />
      </div>
    </>
  );
};

export default HorizontalNav;