import React from 'react';
import Upload from '../assets/Upload.png';
 
function UploadIcon({ text }) {
  return (
    <div className="w-full h-full flex items-center justify-center upload-bg-color">
      <div className="w-5/6 h-5/6 rounded-full flex items-center justify-center flex-col bg-white">
        <div className="flex text-3xl mb-2">
          <img src={Upload} alt="Upload" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm text-[#2E5BFF]">{text}</p>
        </div>
      </div>
    </div>
  );
}
 
export default UploadIcon;