import React, { useState, useEffect, useContext } from 'react';
import './popup.css'; // Import your CSS
import popupimg from '../../assets/popupimg.png';
import toast from 'react-hot-toast';
import { GraphDataContext } from '../../contexts/graphDataContext';
import { useTranslation } from 'react-i18next';

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false); // Initially, popup is hidden
  const [isChecked, setIsChecked] = useState(false); // Checkbox state
  const [done, setDone] = useState(localStorage.getItem('copyright') || '');
  const { i18n,t } = useTranslation();
  const { graphData } = useContext(GraphDataContext);

  // Use useEffect to add a delay before showing the popup
  useEffect(() => {
    const timer = setTimeout(() => {
        if (!done) setIsOpen(true); // Show the popup after a delay
    }, 3000); // 3000 milliseconds = 3 seconds delay

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isChecked) {
        toast(t('pcttac'), {
            icon: '⚠️'
        });
        return;
    } 

    localStorage.setItem('copyright', 1);
    setDone(true);
  };

  if (!isOpen || done) return null; 

  return (
    <div className="popup-overlay px-2">
      <div className="popup">
        <div className="flex popup-content px-3">
          <img src={popupimg} alt="Popup Image" className="hidden md:block popup-image" />
          <div className="popup-text w-full">
            <span className='text-xl font-bold'>{t('csaca')}</span>
            <p className='mt-2 pr-4 mr-4 h-[140px]'>
               {t('bscttsyctyhtlr...')}
            </p>
            <div className="popup-footer">
                <label className="checkbox-label label">
                    <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    />
                    {t('iatttac')} <span className="required-star">*</span>
                </label>
                <button onClick={handleSubmit} className="flex justify-center submit-btn w-full">
                    {t('iagree')}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
