import React from 'react';
import AnimatedNumber from "animated-number-react"; // Ensure this import is here
import { useTranslation } from "react-i18next";

function TopStats({ finalperformance, finalmcqavg, finalnumericavg, finaldescript }) {
    const { i18n, t } = useTranslation();
  return (
    <div className='w-1/2 flex justify-center items-center'>
        <div className="flex flex-row items-end">
            <div className="flex flex-col items-center justify-end w-36">
                <div className="text-[40px] font-medium custom-gradienttext">
                    <AnimatedNumber
                        value={parseFloat(finalperformance)}
                        formatValue={(value) => `${value.toFixed(2)}%`} // Add '%' after the number
                        duration={1000} // Animation duration
                        stepPrecision={2} // Precision of the animated number
                    />
                </div>
                <div className="mt-2 text-black font-medium text-center break-words">{t('overallperformance')}</div>
            </div>
            <div className="flex flex-col items-center justify-end w-36">
                <div className="text-2xl text-customBlue font-medium">
                    <AnimatedNumber
                        value={parseFloat(finalmcqavg)}
                        formatValue={(value) => `${value.toFixed(2)}%`} // Add '%' after the number
                        duration={1000} // Animation duration
                        stepPrecision={2} // Precision of the animated number
                    />
                </div>
                <div className="mt-2 text-black text-center break-words font-medium">{t('mcqperformance')}</div>
            </div>
            <div className="flex flex-col items-center justify-end w-36">
                <div className="text-2xl text-customBlue font-medium">
                    <AnimatedNumber
                        value={parseFloat(finalnumericavg)}
                        formatValue={(value) => `${value.toFixed(2)}%`} // Add '%' after the number
                        duration={1000} // Animation duration
                        stepPrecision={2} // Precision of the animated number
                    />
                </div>
                <div className="mt-2 text-black text-center break-words font-medium">{t('numericperformance')}</div>
            </div>
            <div className="flex flex-col items-center justify-end w-36">
                <div className="text-2xl text-customBlue font-medium">
                    <AnimatedNumber
                        value={parseFloat(finaldescript)}
                        formatValue={(value) => `${value.toFixed(2)}%`} // Add '%' after the number
                        duration={1000} // Animation duration
                        stepPrecision={2} // Precision of the animated number
                    />
                </div>
                <div className="mt-2 text-black text-center break-words font-medium">{t('descriptiveperformance')}</div>
            </div>
        </div>
    </div>
  );
}

export default TopStats;
