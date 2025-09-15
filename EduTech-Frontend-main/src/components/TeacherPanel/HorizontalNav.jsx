import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlanContext } from "../../contexts/PlanContext";
import LanguageDropdown from "../LanguageDropdown";
import { RiArrowDropDownLine } from "react-icons/ri";
import Processing from "../Processing";
import MeridianLogoBlue from '../../assets/meridian_logo.png';
import { postAPI } from "../../caller/axiosUrls";
import { FaGraduationCap } from "react-icons/fa";
import { PiUserSwitch } from "react-icons/pi";
import { GraphDataContext } from "../../contexts/graphDataContext";
import toast from "react-hot-toast";
import User from '../User';

const HorizontalNav = () => {
  const { i18n, t } = useTranslation();
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sender, setSender] = useState(false);

  const { graphData } = useContext(GraphDataContext);
  const { plan, isDummy } = useContext(PlanContext);
  const instName = sessionStorage.getItem("instituteName");

  useEffect(() => {
    const pathname = location.pathname;
    switch (pathname) {
      case "/teacher":
      case "/teacher/dashboard":
        setTab("dashboard");
        break;
      case "/teacher/books":
        setTab("books");
        break;
      case "/teacher/quiz":
        setTab("quiz");
        break;
      case "/teacher/notes":
        setTab("notes");
        break;
      default:
        setTab("");
        break;
    }
  }, [location.pathname]);

  const switchUser = async () => {
    if (sender) return;
    else setSender(true);

    try {
      const response = await postAPI('/superuser/switchRoleInTrial', {
        newRole: "student"
      });
      toast.success(response.message);
      sessionStorage.setItem('role', "student");
      setTimeout(() => {
        window.location.href="/student"
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleTabChange = (tabNo) => {
    setTab(tabNo);
    navigate(tabNo);
  };

  return (
    <>
      {sender ? <Processing /> : null}
      <div className="flex relative justify-between items-center px-5 bg-white z-30 h-[110px]">
        <div className="flex grow justify-between mr-28">
          <div  className="flex cursor-pointer flex-col justify-center">
              <span onClick={() => navigate('/home')} className="font-semibold text-[32px] leading-none linear-color">
                  Edulearn.ai
              </span>
              <span onClick={() => setShowDropdown(!showDropdown)} className="font-semibold flex items-center gap-x-2 text-[20px] leading-0 text-customBlue">
                  <p>{t('forteachers')}</p>
                  <RiArrowDropDownLine className="text-[30px] mt-[2px]" />
              </span>
          </div>
          <div className="flex items-center text-[16px] font-medium gap-x-10">
            <button className={`${tab === 'dashboard' ? 'scale-125 text-[#2E5BFF]' : ''} active:scale-90 hover:scale-125 hover:text-[#2E5BFF]`} onClick={() => handleTabChange('dashboard')}>{t('dashboard')}</button>
            <button className={`${tab === 'books' ? 'scale-125 text-[#2E5BFF]' : ''} active:scale-90 hover:scale-125 hover:text-[#2E5BFF]`} onClick={() => handleTabChange('books')}>{t('mybooks')}</button>
            <button className={`${tab === 'quiz' ? 'scale-125 text-[#2E5BFF]' : ''} active:scale-90 hover:scale-125 hover:text-[#2E5BFF]`} onClick={() => handleTabChange('quiz')}>{t('myquiz')}</button>
            <button className={`${tab === 'notes' ? 'scale-125 text-[#2E5BFF]' : ''} active:scale-90 hover:scale-125 hover:text-[#2E5BFF]`} onClick={() => handleTabChange('notes')}>My Notes</button>
          </div>
        </div>
        <div className="flex gap-x-8 items-center">
          <p className="w-[200px] truncate font-medium text-center" title={instName}>
            {instName === 'Meridian Solutions Trial' ? <img src={MeridianLogoBlue} alt="Meridian Logo" /> : instName}
          </p>
          <LanguageDropdown />
          <User mail={graphData?.mail || sessionStorage.getItem('userMail')} plan={plan} setSender={setSender} />
        </div>
         {/* Dropdown */}
         {isDummy && <div className={`${showDropdown ? "opacity-100 scale-100" : "opacity-0 scale-90 hidden"} z-30 absolute flex flex-col ${isDummy ? 'bottom-[-40px]' : 'bottom-[-75px]'} left-[40px] w-[210px] text-[20px] border-[1px] border-white overflow-hidden shadow-md bg-gray-100 items-center rounded-[15px]`}>
          <button onClick={switchUser} className="text-3xl h-fit my-auto bg-white p-2 w-full flex justify-center rounded-xl hover:scale-105 active:scale-90 border" title="Switch to Student">{sender ? <PiUserSwitch /> : <FaGraduationCap />}</button>
        </div>}
      </div>
    </>
  );
};

export default HorizontalNav;