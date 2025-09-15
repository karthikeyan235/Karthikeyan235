import React from 'react';
import backimg from '../../assets/backillus.jpg'
import target from '../../assets/targetdash.gif'
import likes from '../../assets/likes.gif'
import OnlyCharts from './OnlyCharts';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, RadialLinearScale } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const StudentCharts = ({ quizId, quizName, dummydata }) => {
    const { i18n, t } = useTranslation();
    const filteredData = dummydata.filter(item => item.quizId === quizId);
    const navigate = useNavigate();

    return (
        <div className="flex justify-between p-4">
            {/* Left Section */}
            <div className="flex-1 bg-white cust-shadow rounded-[30px] p-6 m-2">
                <div className="h-full w-full rounded-lg mt-2 flex items-center justify-center">
                    <OnlyCharts dummydata={filteredData} />
                </div>
            </div>

            {/* Middle Section */}
            <div className='flex flex-col w-[12rem]'>
                <div className=" bg-white cust-shadow rounded-[30px] p-6 m-2 text-center">
                    <h2 className="text-3xl font-bold text-green-600">{dummydata.length}</h2>
                    <p className="text-gray-500 mt-2">{t('totalquizattended')}</p>
                </div>
                <div>
                    <div className='flex flex-col items-center align-middle'>
                        <p className='text-lg mt-2 max-w-[150px] break-words font-semibold'>{quizName}</p>
                        <p className="text-sm mt-2 break-words text-center">({quizId})</p>
                        <img src={likes} className="h-40 w-40 mt-5" alt="likes" />
                    </div>

                </div>
            </div>


            {/* Right Section */}
            <div
                className="flex-1 rounded-[30px] cust-shadow  p-6 m-2 flex flex-col items-center justify-center"
                style={{
                    backgroundImage: `url(${backimg})`, // Use a template literal to set the URL
                    backgroundSize: 'cover', // Ensures the image covers the div
                    backgroundPosition: 'center', // Centers the image
                    backgroundRepeat: 'no-repeat', // Prevents the image from repeating
                }}
            >
                <div className="bg-dash bg-opacity-30 backdrop-blur-lg border rounded-[30px] border-white flex flex-col items-center justify-center">
                    {/* Placeholder for illustration */}
                    <img src={target} className='h-45 w-40 mt-10' />

                    <p className="text-center text-white font-semibold mb-4 text-2xl px-5">
                        {t('caqq&pittc')}
                    </p>
                </div>

                <button onClick={() => navigate(`/${sessionStorage.getItem('role')}/create-quiz`)} className="w-full bg-customBlue mt-3 text-white py-2 px-4 rounded-[15px] hover:bg-blue-700">
                    {t('createquiz')}
                </button>
            </div>

        </div>
    );
};

export default StudentCharts;
