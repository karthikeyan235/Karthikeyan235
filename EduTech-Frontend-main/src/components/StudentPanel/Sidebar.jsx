import React, { useState, useEffect, useContext } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";
import Company_Logo from '../../assets/meridian_logo.png';
import { useTranslation } from 'react-i18next';
import { PlanContext } from '../../contexts/PlanContext';

const Sidebar = ({ mobile, toggle, setToggle }) => {
  const { i18n,t } = useTranslation();
  const [tab, setTab] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { plan } = useContext(PlanContext);

  useEffect(() => {
    const pathname = location.pathname;

    switch(pathname) {
      case '/student':
          setTab('dashboard');
          break;
      case '/student/dashboard':
          setTab('dashboard');
          break;
      case '/student/books':
          setTab('books');
          break;
      case '/student/create-quiz':
          setTab('create-quiz');
          break;
      case '/student/quiz':
          setTab('quiz');
          break;
      default:
          setTab('');
          break;
    }
  }, [location.pathname]);

  const handleTabChange = (tabNo) => {
    setTab(tabNo);
    setToggle(false);
    navigate(tabNo);
  }

  const sidebarStyle = {
    width: '240px',
    height: '100vh',
    zIndex: "99",
    position: mobile ? "absolute" : "",
    transform: mobile ? (toggle ? "translateX(0px)" : "translateX(-250px)") : "none",
    padding: '20px 0 10px 0',
    transition: 'transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1)',
  };

  return (
    <>
      <div className="d-flex bg-color flex-column shadow text-black" style={sidebarStyle}> 
        <div className='d-flex flex-column' style={{ height: "100%" }}>
          <img src={Company_Logo} className='w-9/12 mb-3 self-center' alt="Company Logo" />
          <h1 className='align-self-center text-2xl font-bold'>EduTech</h1>
          <div className='d-flex flex-column justify-content-between' style={{ height: "100%" }}>
            <span className='d-flex flex-column mt-4'>
              <button className={`${ (tab === 'dashboard') ? 'active' : '' } ${plan === 'trial' ? 'premium' : '' } nav-butt border-b border-gray-300 py-[10px] flex justify-content-center align-items-center gap-x-3`} onClick={() => handleTabChange('dashboard')}>{t('dashboard')}</button>
              <button className={`${ (tab === 'books') ? 'active' : '' } nav-butt border-b border-gray-300 py-[10px] flex justify-content-center align-items-center gap-x-3`} onClick={() => handleTabChange('books')}>{t('books')}</button>
              <button className={`${ (tab === 'create-quiz') ? 'active' : '' } nav-butt border-b border-gray-300 py-[10px] flex justify-content-center align-items-center gap-x-3`} onClick={() => handleTabChange('create-quiz')}>{t('createquiz')}</button>
              <button className={`${ (tab === 'quiz') ? 'active' : '' } nav-butt border-gray-300 py-[10px] flex justify-content-center align-items-center gap-x-3`} onClick={() => handleTabChange('quiz')}>{t('quiz')}</button>
            </span>
            <button className="nav-butt bottom-0 position-relative bg-danger text-white p-2 px-3 flex justify-content-center align-items-center gap-x-3" onClick={() => navigate('/home')}><IoLogOut /></button>
          </div>
          <span onClick={() => {setToggle(false)}} className='shadow' style={{ borderRadius: '50%', fontSize: '30px', color: "black", backgroundColor: "white", display: toggle ? "block" : "none", position: "absolute", top: "20px", right: "-40px"}}><IoCloseCircleOutline /></span>
        </div>
      </div>  
    </>
  );
};

export default Sidebar;