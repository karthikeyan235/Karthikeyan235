import React from 'react';
import AnimatedNumber from "animated-number-react"; // Ensure this import is here
import { useTranslation } from "react-i18next";

const DetailsBoxes = ({ avgDescriptivePercentage, avgMCQPercentage, avgNumericPercentage, avgTotalPercentage, avgGrade, totalQuizzes }) => {
    const { i18n, t } = useTranslation();
    return (
        <div className="flex mt-24 mb-10 justify-evenly w-full gap-6">
            {/* Average Descriptive Percentage */}
            <div className="flex flex-col items-center justify-center w-[15%]">
                <div className='flex shadow-2xl items-center justify-center w-full h-36 rounded-[1rem] bg-customBlue text-white'>
                    <div className="text-[40px] font-medium text-white">
                        <AnimatedNumber
                            value={parseFloat(avgDescriptivePercentage)}
                            formatValue={(value) => `${value.toFixed(2)}%`} 
                            duration={1000} 
                            stepPrecision={2}
                        />
                    </div>
                </div>
                <div className="mt-2 text-customBlue text-center break-words">{t('adp')}</div>
            </div>

            {/* Average MCQ Percentage */}
            <div className="flex flex-col items-center justify-center w-[15%]">
                <div className='flex shadow-2xl items-center justify-center w-full h-36 rounded-[1rem]'>
                    <div className="text-[40px] font-medium custom-gradienttext">
                        <AnimatedNumber
                            value={parseFloat(avgMCQPercentage)}
                            formatValue={(value) => `${value.toFixed(2)}%`} 
                            duration={1000} 
                            stepPrecision={2}
                        />
                    </div>
                </div>
                <div className="mt-2 text-customBlue text-center break-words">{t('amp')}</div>
            </div>

            {/* Average Numerical Percentage */}
            <div className="flex flex-col items-center justify-center w-[15%]">
                <div className='flex shadow-2xl items-center justify-center w-full h-36 rounded-[1rem] bg-customBlue text-white'>
                    <div className="text-[40px] font-medium text-white">
                        <AnimatedNumber
                            value={parseFloat(avgNumericPercentage)}
                            formatValue={(value) => `${value.toFixed(2)}%`} 
                            duration={1000} 
                            stepPrecision={2}
                        />
                    </div>
                </div>
                <div className="mt-2 text-customBlue text-center break-words">{t('anp')}</div>
            </div>

            {/* Average Total Percentage */}
            <div className="flex flex-col items-center justify-center w-[15%]">
                <div className='flex shadow-2xl items-center justify-center w-full h-36 rounded-[1rem]'>
                    <div className="text-[40px] font-medium custom-gradienttext">
                        <AnimatedNumber
                            value={parseFloat(avgTotalPercentage)}
                            formatValue={(value) => `${value.toFixed(2)}%`} 
                            duration={1000} 
                            stepPrecision={2}
                        />
                    </div>
                </div>
                <div className="mt-2 text-customBlue text-center break-words">{t('atp')}</div>
            </div>

            {/* Average Grade */}
            <div className="flex flex-col items-center justify-center w-[15%]">
                <div className='flex shadow-2xl items-center justify-center w-full h-36 rounded-[1rem] bg-customBlue text-white'>
                    <div className="text-[40px] font-medium text-white">
                        <p>{avgGrade}</p>
                    </div>
                </div>
                <div className="mt-2 text-customBlue text-center break-words">{t('averagegrade')}</div>
            </div>

            {/* Total Quizzes Taken */}
            <div className="flex flex-col items-center justify-center w-[15%]">
                <div className='flex shadow-2xl items-center justify-center w-full h-36 rounded-[1rem]'>
                    <div className="text-[40px] font-medium custom-gradienttext">
                        <AnimatedNumber
                            value={parseFloat(totalQuizzes)}
                            formatValue={(value) => `${value.toFixed(0)}`} 
                            duration={1000} 
                            stepPrecision={0} 
                        />
                    </div>
                </div>
                <div className="mt-2 text-customBlue text-center break-words">{t('tqt')}</div>
            </div>
        </div>
    );
}

export default DetailsBoxes;