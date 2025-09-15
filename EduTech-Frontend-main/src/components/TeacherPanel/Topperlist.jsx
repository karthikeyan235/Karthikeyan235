import React from 'react';
import AnimatedNumber from "animated-number-react"
import { useTranslation } from "react-i18next";

const Topperlist = ({ top3Students, last3Students }) => {
    const { i18n, t } = useTranslation();
    return (
        <div className='flex flex-col w-1/2 px-4 items-center'>
            <div className="border-2 border-blue-500 mt-4 mb-4 w-full"></div>
            <div className="flex gap-7 w-full px-2">
                <div className='flex flex-col mx-3 w-full'>
                    <p className='text-[#0F34B2] text-[20px] font-semibold self-center mb-3'>TOP 3 HIGHEST SCORERS</p>
                    <ul className='flex flex-col mt-4 gap-y-5'>
                        {top3Students && top3Students.length > 0 ? (
                            top3Students.map((student, index) => (
                                <li key={student.userId} className='font-semibold p-1 flex justify-between'>
                                    <p className='text-xl'>{student.name || 'Name not available'}</p>
                                    <span className='custom-gradienttext text-2xl'>
                                        <AnimatedNumber
                                            value={student.avgPerformance}
                                            formatValue={(value) => `${value.toFixed(2)}%`}
                                            duration={1000}
                                            stepPrecision={2}
                                        />
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className='font-semibold'>{t('nda')}</li>
                        )}
                    </ul>
                </div>
                {/* <div className='flex flex-col mx-3'>
                    <p className='text-customBlue font-semibold mb-3'>TOP 3 LOWEST SCORERS</p>
                    <ul>
                        {last3Students && last3Students.length > 0 ? (
                            last3Students
                                .slice() // Create a shallow copy to avoid mutating the original array
                                .reverse() // Reverse the order
                                .map((student, index) => (
                                    <li key={student.userId} className='font-semibold p-2'>
                                        {student.name || 'Name not available'}  <span className='custom-gradienttext text-2xl'>
                                            <AnimatedNumber
                                                value={student.avgPerformance}
                                                formatValue={(value) => `${value.toFixed(2)}%`}
                                                duration={1000}
                                                stepPrecision={2}
                                            />
                                        </span>
                                    </li>
                                ))
                        ) : (
                            <li className='font-semibold'>No data available</li>
                        )}
                    </ul>
                </div> */}
            </div>
            {/* <div className='flex gap-3 mt-5'>
                <button className='text-customBlue px-6 py-1 font-semibold bg-white border-2 border-blue-500 rounded-lg cursor-pointer text-sm'>Create Book</button>
                <button className='bg-customBlue text-white px-6 py-1 font-semibold  rounded-lg cursor-pointer text-sm'>Create Quiz</button>
            </div> */}
        </div>
    );
};

export default Topperlist;
