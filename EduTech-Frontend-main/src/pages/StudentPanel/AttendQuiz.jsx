import React, { useState, useEffect, useContext } from 'react';
import QuizQuestions from './QuizQuestions';
import Loader from '../../components/Loader';
import NotFound from '../../components/NotFound';
import toast from 'react-hot-toast';
import { getAPI } from '../../caller/axiosUrls';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlanContext } from '../../contexts/PlanContext';
import { IoIosArrowBack } from "react-icons/io";
import DeviceWarning from '../../components/DeviceWarning';

const AttendQuiz = ({ isExamActive }) => {
    const { i18n,t } = useTranslation();
    const [template, setTemplate] = useState([]);
    const [loading, setLoading] = useState(true);

    const { plan } = useContext(PlanContext);
    const { qid } = useParams();
    const navigate = useNavigate();

    const getTemplate = async () => {
        setLoading(true);
        try {
            const response = await getAPI(`/student/get-student-quiz?quizId=${qid}`);
            setTemplate(response.template || []);
        } catch (error) {
            toast.error(error.message); 
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        sessionStorage.removeItem('adpid');
        sessionStorage.removeItem('first');
        sessionStorage.removeItem("adaptiveResult");
    })

    useEffect(() => {
        if (plan !== 'trial') {
            navigate('/student/quiz');
            toast.error('Status 401: Unauthorized Access!');
            return;
        }
        getTemplate();
    }, [])

    return (
        <div>
            <div className='md:hidden'>
                <DeviceWarning />
            </div>
            <div className={`${plan === 'trial' ? '' : isExamActive ? '' : 'hidden'} hidden md:block mt-5 mx-8 md:mx-24 lg:mx-48`}>
                <button className="fixed mt-2 left-10 top-10 mb-4 bg-white w-fit p-1 hover:scale-110 active:scale-90 text-[40px]" onClick={() => navigate(-1)}>
                    <IoIosArrowBack />
                </button> 
                { loading ? <Loader type={1} text={t('pleasewait')} /> :
                    template.length === 0 ? <NotFound text={t('noquizcontentfound')} /> :
                    <QuizQuestions template={template} qid={qid} />
                } 
            </div>
        </div>
    );
}

export default AttendQuiz;
