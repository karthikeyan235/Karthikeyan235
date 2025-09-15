import { useEffect, useState } from 'react';
import Boxes from '../../components/StudentPanel/Boxes';
import TableData from '../../components/StudentPanel/TableData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('adpid');
        sessionStorage.removeItem("adaptiveResult");
        sessionStorage.removeItem('first');
    })

    return (
        <div className='bg-dashboard2 w-screen h-full flex flex-col'>
            <button onClick={() => navigate('/student/quiz-attend')} className='custom-button mb-4 mt-2 self-center px-5'>{t('attemptquiz')}</button>
            {/* Tab navigation */}
            <div className="flex justify-around bg-customBlueLight rounded-t-[20px] min-h-[70px]">
                <button
                    className={`h-full grow focus:outline-none ${activeTab === 'dashboard' ? 'text-customBlue active-bg animate__animated animate__fadeInRight' : 'text-white'
                        } tracking-wide`}
                        onClick={() => setActiveTab('dashboard')}
                >
                    <span className='text-[24px] font-semibold'>{t('dashboard')}</span>
                </button>
                <button
                    className={`h-full grow focus:outline-none ${activeTab === 'details' ? 'text-customBlue active-bg animate__animated animate__fadeInLeft' : 'text-white'
                        } tracking-wide`}
                        style={{ borderRadius: '0px 0px 0px 0px'}}

                    onClick={() => setActiveTab('details')}
                >
                    <span className='text-[24px] font-semibold'>{t('details')}</span>
                </button>
            </div>

            {/* Tab content */}
            <div className="bg-dashboard2 px-4 py-14">
                {activeTab === 'dashboard' && (
                    <Boxes/>
                )}
                {activeTab === 'details' && (
                    <TableData/>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
