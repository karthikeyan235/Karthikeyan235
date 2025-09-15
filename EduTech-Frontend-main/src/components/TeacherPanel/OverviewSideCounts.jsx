import React from 'react'
import AnimatedNumber from "animated-number-react"
import img1 from '../../assets/teacherdash/img1.jpg'
import img2 from '../../assets/teacherdash/img2.jpg'
import img3 from '../../assets/teacherdash/img3.jpg'
import img4 from '../../assets/teacherdash/img4.jpg'
import { useTranslation } from "react-i18next";

function OverviewSideCounts({ totalStudents, totalQuizzesGenerated, totalQuizzesTaken, totalTeachers }) {
    const { t } = useTranslation();
    return (
        <div className='w-1/2 mt-3 flex justify-center items-center'>
            <div className="flex justify-center gap-x-4 w-full">
                {/* Student Count */}
                <div className='flex flex-col justify-start items-center w-[140px]'>
                    <div className="flex flex-col items-center rounded-[20px] justify-center h-[6rem] w-full"
                        style={{
                            backgroundImage: `url(${img1})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div className="flex items-center justify-center rounded-full w-14 h-14 bg-SideCountcolor bg-opacity-30 backdrop-blur-md">
                            <div className="text-2xl text-white font-medium">
                                <AnimatedNumber
                                    value={totalStudents}
                                    formatValue={(value) => `${value.toFixed(0)}`}
                                    duration={1000}
                                    stepPrecision={2}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-customBlue text-center break-words font-medium">{t('totalstudents')}</div>
                </div>

                {/* Quizzes Generated */}
                <div className='flex flex-col justify-start items-center w-[140px]'>
                    <div className="flex flex-col items-center rounded-[20px] justify-center h-[6rem] w-full bg-opacity-30 backdrop-blur-lg"
                        style={{
                            backgroundImage: `url(${img2})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                        <div className="flex items-center justify-center rounded-full w-14 h-14 bg-SideCountcolor bg-opacity-30 backdrop-blur-md">
                            <div className="text-2xl text-white font-medium p-3">
                                <AnimatedNumber
                                    value={totalQuizzesGenerated}
                                    formatValue={(value) => `${value.toFixed(0)}`}
                                    duration={1000}
                                    stepPrecision={2}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-customBlue text-center break-words font-medium">{t('totalteachers')}</div>
                </div>

                {/* Quizzes Taken */}
                <div className='flex flex-col justify-start items-center w-[140px]'>
                    <div className="flex flex-col items-center rounded-[20px] justify-center h-[6rem] w-full bg-opacity-30 backdrop-blur-lg"
                        style={{
                            backgroundImage: `url(${img3})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                        <div className="flex items-center justify-center rounded-full  w-14 h-14 bg-SideCountcolor bg-opacity-30 backdrop-blur-md">
                            <div className="text-2xl text-white font-medium p-3">
                                <AnimatedNumber
                                    value={totalQuizzesTaken}
                                    formatValue={(value) => `${value.toFixed(0)}`}
                                    duration={1000}
                                    stepPrecision={2}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-customBlue text-center break-words font-medium">{t('tqg')}</div>
                </div>

                {/* Teachers */}
                <div className='flex flex-col justify-start items-center w-[140px]'>
                    <div className="flex flex-col items-center rounded-[20px] justify-center h-[6rem] w-full bg-opacity-30 backdrop-blur-lg"
                        style={{
                            backgroundImage: `url(${img4})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                        <div className="flex items-center justify-center rounded-full w-14 h-14 bg-SideCountcolor bg-opacity-30 backdrop-blur-md">
                            <div className="text-2xl text-white font-medium p-3">
                                <AnimatedNumber
                                    value={totalTeachers}
                                    formatValue={(value) => `${value.toFixed(0)}`}
                                    duration={1000}
                                    stepPrecision={2}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-customBlue text-center break-words font-medium">{t('tqt')}</div>
                </div>
            </div>
        </div>
    )
}

export default OverviewSideCounts;
