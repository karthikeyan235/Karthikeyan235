import React, { useContext } from 'react';
import { useMsal } from '@azure/msal-react';
import { GraphDataContext } from '../contexts/graphDataContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postAPI } from '../caller/axiosUrls';
import Logout from '../assets/Logout.png';
import { useTranslation } from 'react-i18next';

const SignOutButton = ({ setSender }) => {
  const { i18n,t } = useTranslation();
  const { instance } = useMsal();
  const { setToken } = useContext(AuthContext);
  const { setGraphData } = useContext(GraphDataContext);

  const navigate = useNavigate();

  const logout = async () => {
    setSender(true);

    try {
      const response = await postAPI('/users/logout');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('user-id');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('graphData');
      toast.success(t('los'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setToken(null);
      setGraphData(null);
      setSender(false);
      navigate('/home');
    }
  }

  const handleLogout = () => {
    instance
    .logoutPopup({
      postLogoutRedirectUri: "/",
    })
    .then(async () => {
     await logout();
    })
    .catch(error => toast.error(error.message));
  };

  return  (
    <>
      <div onClick={() => sessionStorage.getItem("jwtLogin") === "1" ? logout() : handleLogout()} className='flex px-4 py-2 hover:bg-gray-300 cursor-pointer w-full items-center justify-center text-[#AD1519]'>
        <img className="w-[22px] h-[20px] mr-5" src={Logout} alt="Logout" />
        <p>{t('logout')}</p>
      </div>
    </>
    );
}

export default SignOutButton;