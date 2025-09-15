import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import MSButton from '../assets/MSButton.png';
import { useTranslation } from 'react-i18next';

export const SignInButton = ({ dataCaller }) => {
  const { i18n,t } = useTranslation();
  const { instance } = useMsal();

  const handleLogin = async () => {
    instance.loginPopup(loginRequest)
      .then((loginResponse) =>  {
        instance.setActiveAccount(loginResponse.account);
        if (instance.getAllAccounts().length > 0) {
          dataCaller();
        }
      })
      .catch((e) => {
        console.error(t('loginfailed'), e);
      });
  };

  return (
    <div>
      {i18n.language === "en" ? (
        <div className='w-[525px] flex justify-center animate__animated animate__pulse animate__slow animate__infinite flex items-center gap-x-5 cursor-pointer px-5 py-2 rounded-xl hover:scale-110 active:scale-90' onClick={handleLogin}>
                     <p className="font-semibold animate__animated animate__fadeInUpBig animate__slow text-white text-[30px]">{t('loginwith')}</p>
                     <img className='animate__animated animate__fadeInUpBig animate__slow' src={MSButton} alt="MS_Login" />
                  </div>
                    ) : (
                    <div className='w-[525px] flex justify-center animate__animated animate__pulse animate__slow animate__infinite flex items-center gap-x-5 cursor-pointer px-5 py-2 rounded-xl hover:scale-110 active:scale-90' onClick={handleLogin}>
                      <img className='animate__animated animate__fadeInUpBig animate__slow' src={MSButton} alt="MS_Login" />
                      <p className="font-semibold animate__animated animate__fadeInUpBig animate__slow text-white text-[30px]">{t('loginwith')}</p>
                  </div>
                  )}    
    </div>
  );
};
