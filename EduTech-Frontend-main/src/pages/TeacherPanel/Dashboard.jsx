import { useState } from 'react';
import Overview from '../../components/TeacherPanel/Overview';
import DetailTable from '../../components/TeacherPanel/DetailTable';
import QuizDashData from '../../components/TeacherPanel/QuizDashData';
import { useTranslation } from 'react-i18next';

function Dashboard() {
    const { i18n,t } = useTranslation();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [prevTab, setPrevTab] = useState('dashboard');

    return (
        <div className='w-screen'>
            {/* Tab navigation */}
            <div className="flex justify-around bg-customBlueLight rounded-t-[20px] h-[70px]">
                <button
                    className={`h-full grow focus:outline-none ${activeTab === 'dashboard' ? 'text-customBlue active-bg animate__animated animate__fadeInRight' : 'text-white'
                        } tracking-wide`}
                        style={{ borderRadius: '0px 0px 0px 0px' }}
                        onClick={() => {
                            setActiveTab('dashboard');
                            setPrevTab('dashboard');
                        }}
                >
                    <span className='text-[24px] font-semibold'>{t('overview')}</span>
                </button>
                <button
                    className={`h-full grow focus:outline-none ${activeTab === 'quiz' ? `text-customBlue active-bg animate__animated ${prevTab === 'dashboard' ? 'animate__fadeInLeft' : 'animate__fadeInRight'}` : 'text-white'
                        } tracking-wide`}
                        style={{ borderRadius: '0px 0px 0px 0px'}}

                    onClick={() => setActiveTab('quiz')}
                >
                    <span className='text-[24px] font-semibold'>{t('quiz')}</span>
                </button>
                <button
                    className={`h-full grow focus:outline-none ${activeTab === 'details' ? 'text-customBlue active-bg animate__animated animate__fadeInLeft' : 'text-white'
                        } tracking-wide`}
                        style={{ borderRadius: '0px 0px 0px 0px'}}

                    onClick={() => {
                        setActiveTab('details');
                        setPrevTab('details');
                    }}
                >
                    <span className='text-[24px] font-semibold'>{t('details')}</span>
                </button>
            </div>

            {/* Tab content */}
            <div className="px-4 py-10">
                {activeTab === 'dashboard' && (
                    <Overview/>
                )}
                {activeTab === 'quiz' && (
                    <QuizDashData/>
                )}
                {activeTab === 'details' && (
                    <DetailTable/>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
