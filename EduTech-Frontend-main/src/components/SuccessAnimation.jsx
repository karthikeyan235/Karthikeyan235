import React from 'react';
import Clap from '../assets/Clap.gif';
import Confetti from '../assets/Confetti.gif';
 
const SuccessAnimation = ({text}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden">
 
      <div className='w-full h-full flex mt-12 justify-center font-bold text-2xl'>{text}</div>
 
      {/* GIF 1 with fade-out animation */}
      <img
        src={Confetti}
        alt="GIF 1"
        className="absolute w-1/2 object-cover opacity-80 animation-fade-out"
      />
     
      {/* GIF 2 with fade-out animation */}
      <img
        src={Clap}
        alt="GIF 2"
        className="absolute w-1/2 object-cover opacity-80 animation-fade-out"
      />
    </div>
  );
};
 
export default SuccessAnimation;