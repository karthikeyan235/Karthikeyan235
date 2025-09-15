import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { GoLinkExternal } from "react-icons/go";
import { MdDelete } from 'react-icons/md';
 
const ContentAccordion = ({ content, sender, onDelete }) => {
    return (
        <Accordion>
            {content.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={item.book.bookId}>
                    <Accordion.Header className='py-1 bg-customBlue rounded-[15px]'>
                        <div className='w-full flex pr-4 items-center justify-between'>
                            <p className='truncate w-[90%] font-semibold text-white'>{item.book.name} {item.book.user ? `- (${item.book.user})` : ''}</p>
                            <button
                                disabled={sender}
                                onClick={() => onDelete(item.book.id)}
                                className='text-2xl mr-4 hover:scale-110 active:scale-90'>
                                <MdDelete className="text-red-500" />
                            </button>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='bg-[#94ABFF] rounded-[20px] mt-1 text-white'>
                        <ul className='flex flex-col gap-y-1'>
                            {item.chapters.map(chapter => (
                                <>
                                    <li key={chapter.id} onClick={() => sender ? null : window.open(chapter.url, '_blank')} className='rounded-3xl flex justify-between items-center py-2 px-3 hover:border-blue-400 cursor-pointer accordion-item2 text-white bg-[#94ABFF] hover:bg-[#2E5BFF] border-white border-1'>
                                        <p className='w-[90%] '>{chapter.name}</p>
                                        <GoLinkExternal />
                                    </li>
                                </>
                            ))}
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};
 
export default ContentAccordion;