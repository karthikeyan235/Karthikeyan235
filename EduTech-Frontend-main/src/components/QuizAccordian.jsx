import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { GoLinkExternal } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const QuizAccordion = ({ quiz, sender, type }) => {
    const { i18n,t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Accordion className='w-full'>
            {quiz.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={item.quizID}>
                    <Accordion.Header>
                        <div className='w-full flex pr-4 items-center justify-between'>
                            <p className='truncate md:max-w-[250px] font-semibold'>{item.quizName}</p>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='p-2'>
                        <div className='flex border-2 border-blue-700 rounded flex-col'>
                            <div className='bg-color-blue rounded-t py-2 text-white px-3'>
                                <div className='flex justify-between'>
                                    <p className='text-sm'>{t('createdby')}</p>
                                    <p className='text-sm text-right'>{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className='truncate text-xl text-capitalize'>{item.createdBy?.name}</p>
                            </div>
                            <p className='px-3 py-2'>{item.description}</p>
                            <button onClick={() => navigate(`/${type}/quiz/${item.quizID}`)} disabled={sender} className='self-center py-2 px-3 flex items-center gap-x-2 rounded mb-2 bg-color-blue text-white w-fit'>{t('visit')} <GoLinkExternal /></button>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};

export default QuizAccordion;
