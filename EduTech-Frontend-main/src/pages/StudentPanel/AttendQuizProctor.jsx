import React, { useState, useEffect } from 'react';
import QuizQuestions from './QuizQuestions';
import Loader from '../../components/Loader';
import NotFound from '../../components/NotFound';
import toast from 'react-hot-toast';
import { getAPI } from '../../caller/axiosUrls';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AttendQuiz = ({ isExamActive, onSubmit }) => {
    const { i18n,t } = useTranslation();
    const [template, setTemplate] = useState([]);
    const [loading, setLoading] = useState(true);

    const { qid } = useParams();

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
        getTemplate();
    }, [])

    useEffect(() => {
        sessionStorage.removeItem('adpid');
        sessionStorage.removeItem("adaptiveResult");
        sessionStorage.removeItem('first');
    })

    return (
        <div className={`${isExamActive ? '' : 'hidden'} mx-8 md:mx-24 lg:mx-48`}>
            { loading ? <Loader type={1} text={t('pleasewait')} /> :
                template.length === 0 ? <NotFound text={t('noquizcontentfound')} /> :
                <QuizQuestions onSubmit={onSubmit} template={template} qid={qid} />
            } 
        </div>
    );
}

export default AttendQuiz;
