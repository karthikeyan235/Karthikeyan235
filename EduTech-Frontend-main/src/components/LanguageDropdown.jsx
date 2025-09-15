import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
 
// Define languages with flag images
const languages = [
  { code: "en", name: "English", flag: "https://static.vecteezy.com/system/resources/previews/000/532/212/original/vector-united-states-of-america-flag-usa-flag-america-flag-background.jpg" },
  { code: "ar", name: "عربي", flag: "https://www.bing.com/th?id=OIP.PzEU4GPLkjsYim6nVZYs8gHaEc&w=149&h=100&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" },
  { code: "hi", name: "हिन्दी", flag: "https://th.bing.com/th?id=OIP.vIZGd3WidBiWHZx2nisM4wHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" },
  { code: "pl", name: "polski", flag: "https://www.bing.com/th?id=OIP.PjTOglTNEF7LMe3gjYMt4AHaEo&w=146&h=100&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" },
];
 
const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  let langObj = languages.find(language => language.code === i18n.language) || languages[0];
  const [selectedLanguage, setSelectedLanguage] = useState(langObj);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
 
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language.code); // Change the website language
    localStorage.setItem('language', language.code); // Persist the selected language
    setIsDropdownOpen(false); // Close the dropdown after selection
  };
 
  return (
    <div className="relative inline-block w-[140px] text-left">
      {/* Toggle Button */}
      <div
        onClick={toggleDropdown}
        className="cursor-pointer px-3 w-full py-2 bg-lang rounded-[30px] flex jusitfy-between items-center text-white"
      >
        <div className="flex flex-1 gap-x-2.5 w-[88px] items-center">
          <span className="text-sm text-black flex-1">{selectedLanguage.name}</span>
          <img
            src={selectedLanguage.flag}
            alt={`${selectedLanguage.name} flag`}
            className="w-[30px] h-[22px] mr-4"
          />
        </div>
        <FaChevronDown className="mt-1 text-black" />
      </div>
 
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className={`absolute ${isDropdownOpen ? "fadeintop" : ""} ml-[-4px] mt-2 rounded-xl py-3 px-2 flex flex-col bg-lang w-[150px]`}>
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className="flex items-center justify-between cursor-pointer px-3 rounded-xl py-1 hover:bg-white"
            >
              <span className="text-gray-800">{language.name}</span>
              <img
                src={language.flag}
                alt={`${language.name} flag`}
                className="w-[26px] h-[20px]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default LanguageDropdown;
 