import React, { useState, useEffect } from 'react';
 
const ToggleButton = ({ id, defaultChecked, onChange, color, disabled }) => {
  const [isOn, setIsOn] = useState(defaultChecked || false);
 
  useEffect(() => {
    setIsOn(defaultChecked);
  }, [defaultChecked]);
 
  const toggle = () => {
    if (disabled) return;
    setIsOn(!isOn);
    onChange && onChange(!isOn); // Call onChange if provided
  };
 
  return (
    <div
      id={id}
      onClick={toggle}
      className={`w-14 h-8 flex ${disabled ? 'not-allowed' : ''} items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        isOn ? (color === 2 ? 'bg-[#94ABFF]' : 'bg-[#2E5BFF]') : 'bg-gray-300'
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  );
};
 
export default ToggleButton;