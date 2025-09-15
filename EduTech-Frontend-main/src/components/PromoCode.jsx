import React, { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { FaCaretSquareRight } from "react-icons/fa";
import { IoMdPricetags } from "react-icons/io";
import Processing from './Processing';
import toast from 'react-hot-toast';
import { postAPI } from '../caller/axiosUrls';
import { useTranslation } from 'react-i18next';


const Promocode  = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [promo, setPromo] = useState('');
  const [sender, setSender] = useState(false);
  const { i18n,t } = useTranslation();


  const toggle = () => {
    setPromo('');
    setIsOpen(!isOpen);
  }

  const handleSubmit = async () => {

    if (!promo) {
      toast(t('ppapc!'), {
        icon: '⚠️'
      });
      return;
    }
    
    if (sender) return;
    else setSender(true);

    try {
      const response = await postAPI('/users/apply-promocode', { promoCode: promo });
      toast.success(response.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
      setPromo('');
      setIsOpen(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      {sender ? <Processing /> : null}
      <div onClick={toggle} className="flex transparent-effect gap-x-2 items-center cursor-pointer left-2 md:left-10 fixed z-30 text-xl py-2 hover:scale-105 px-6 text-white shadow rounded-t-3xl text-center bottom-0 bg-color-blue">
        <IoMdPricetags /> {t('promocode')}
      </div>
      <div
        className={`cursor-pointer gap-x-2 flex px-6 items-center fixed z-30 py-3 text-white shadow rounded-t-3xl left-2 md:left-10 ${isOpen ? 'bottom-0' : 'bottom-[-100px]'} bg-color-blue`}
      >
        <input
          type="text"
          value={promo}
          className="form-control"
          placeholder={t('promocode')}
          onChange={(e) => setPromo(e.target.value)}
          onKeyDown={handleKeyDown} // Add onKeyDown event listener
        />
        <FaCaretSquareRight
          onClick={handleSubmit}
          className={`${promo.length >= 4 ? '' : 'opacity-0'} text-3xl right-[70px] absolute text-gray-600`}
        />
        <span onClick={toggle} className="text-2xl ml-2">
          <IoMdCloseCircle />
        </span>
      </div>
    </>
  );
};

export default Promocode;
