import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
 
const TypeAccordion = ({ type, index, sender, onDelete, onTypeChange }) => {
    const { i18n, t } = useTranslation();
    const [easy, setEasy] = useState(type.easy || 0);
    const [medium, setMedium] = useState(type.medium || 0);
    const [hard, setHard] = useState(type.hard || 0);
 
    // Update the sum whenever easy, medium, or hard changes
    const sum = easy + medium + hard || 0;
 
    // Handle changes in each category and propagate them to the parent
    useEffect(() => {
        const updatedType = {
            ...type,
            easy: easy,
            medium: medium,
            hard: hard,
            sum: sum
        };
        onTypeChange(updatedType);
    }, [easy, medium, hard]);
 
    const handleEasyChange = (e) => {
        const value = Math.max(0, Math.min(10, parseInt(e.target.value, 10) || 0)); // Set max to 10 for easy
        if (easy === 10 && easy === value) {
            toast(t('eqli1'), {
                icon: '⚠️'
            });
            return;
        }
        setEasy(value);
    }
 
    const handleMediumChange = (e) => {
        const value = Math.max(0, Math.min(5, parseInt(e.target.value, 10) || 0)); // Set max to 5 for medium
        if (medium === 5 && medium === value) {
            toast(t('mqli5'), {
                icon: '⚠️'
            });
            return;
        }
        setMedium(value);
    }
 
    const handleHardChange = (e) => {
        const value = Math.max(0, Math.min(5, parseInt(e.target.value, 10) || 0)); // Set max to 5 for hard
        if (hard === 5 && hard === value) {
            toast(t('hqli5'), {
                icon: '⚠️'
            });
            return;
        }
        setHard(value);
    }
 
    return (
        <Accordion.Item eventKey={index.toString()}>
            <Accordion.Header className='bg-customBlue rounded-[15px]'>
                <div className='w-full flex pr-4 items-center justify-between'>
                    <p className='truncate w-[60%] font-semibold text-white'>{type.typeName}</p>
                    <span className='flex items-center gap-x-4'>
                        <input
                            disabled
                            className='border w-[70px] h-[30px] rounded-[15px] form-control flex text-center'
                            value={sum}
                            type="number"
                        />
                        <button
                            disabled={sender}
                            onClick={() => onDelete(type.typeID)}
                            className='text-2xl mr-4 hover:scale-110 active:scale-90'>
                            <MdDelete className="text-red-500" />
                        </button>
                    </span>
                </div>
            </Accordion.Header>
            <Accordion.Body className='bg-customBlue py-3 rounded-[20px] mt-1 text-white'>
                <ul className='flex flex-col gap-y-2'>
                    <li className='flex justify-between items-center '>
                        <p>{t('noeq')}</p>
                        <input
                            className='w-[60px] text-sm rounded-[15px] form-control flex text-center'
                            onChange={handleEasyChange}
                            value={easy || ''}
                            type="number"
                            min="0"
                            max="10" // Limit easy to 10 in the input field as well
                        />
                    </li>
                    <li className='flex justify-between items-center'>
                        <p>{t('nomq')}</p>
                        <input
                            className=' w-[60px] text-sm rounded-[15px] form-control flex text-center'
                            onChange={handleMediumChange}
                            value={medium || ''}
                            type="number"
                            min="0"
                            max="5" // Limit medium to 5 in the input field
                        />
                    </li>
                    <li className='flex justify-between items-center '>
                        <p>{t('nohq')}</p>
                        <input
                            className=' w-[60px] text-sm rounded-[15px] form-control flex text-center'
                            onChange={handleHardChange}
                            value={hard || ''}
                            type="number"
                            min="0"
                            max="5" // Limit hard to 5 in the input field
                        />
                    </li>
                </ul>
            </Accordion.Body>
        </Accordion.Item>
    );
};

export default TypeAccordion;