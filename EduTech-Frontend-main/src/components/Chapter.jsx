import { MdDelete } from "react-icons/md";
import { BsFiletypePdf } from "react-icons/bs";
import { useEffect, useState } from "react";
import { getAPI } from "../caller/axiosUrls";
import toast from "react-hot-toast";
import DeleteImage from '../assets/Delete.png';
import PdfImage from "../assets/PDF.png";

const Chapter = ({ chapter, editable, sender, deleteChapter }) => {
    // const [startPoll, setStartPoll] = useState(false);
    // const [polling, setPolling] = useState(false); // Track ongoing requests

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up
        deleteChapter(e, chapter.chapterId);
    };

    // const poll = async () => {
    //     setPolling(true); // Mark polling as in progress
    //     try {
    //         const response = await getAPI(`/chapters/upload-status?taskId=${chapter.chapterId}`);
    //         if (response.isCompleted) {
    //             chapter.chapterCompleted = true;
    //             setStartPoll(false);
    //         }
    //     } catch (error) {
    //         toast.error(error.message);
    //     } finally {
    //         setPolling(false); // Reset polling status after completion
    //     }
    // };

    // useEffect(() => {
    //     let interval;

    //     if (!chapter.chapterCompleted && startPoll && !polling) {
    //         interval = setInterval(() => {
    //             if (!polling) { // Only poll if no request is in progress
    //                 poll();
    //             }
    //         }, 2000);
    //     }

    //     return () => {
    //         if (interval) {
    //             clearInterval(interval);
    //         }
    //     };
    // }, [startPoll, chapter.chapterCompleted, polling]);

    // useEffect(() => {
    //     if (!chapter.chapterCompleted) {
    //         setStartPoll(true);
    //     }
    // }, [chapter.chapterCompleted]);

    return (
        <div 
            // onClick={() => sender || !chapter.chapterCompleted ? null : window.open(chapter.chapterURL, '_blank')} 
            onClick={() => sender ? null : window.open(chapter.chapterURL, '_blank')} 
            // className={`${sender ? 'bg-gray-200' : 'bg-white hover:shadow-xl hover:border-blue-500 hover:border-2 cursor-pointer'} ${chapter.chapterCompleted ? '' : "loading not-allowed"} w-full md:w-7/12 py-3 px-3 md:px-4 rounded-lg shadow-md border-2`}
            className={`${sender ? 'bg-gray-200' : 'bg-white hover:shadow-xl cursor-pointer'}  w-full py-3 px-3 md:px-4 rounded-[20px] shadow-md border-2 border-[#94ABFF]`}
        >
            <div className="flex items-center justify-between gap-x-3">
                <div className="flex items-center w-9/12 gap-x-6">
                    <img src={PdfImage} className="drop-shadow ml-2" size={20} />
                    <div className="flex flex-col w-11/12">
                        <p className="text-sm w-9/12 md:w-full font-medium text-gray-800 truncate">{chapter.chapterName}</p>
                        {/* <p className="text-sm hidden md:block font-medium text-gray-800 truncate">{chapter.chapterURL}</p> */}
                    </div>
                </div>
                {editable && deleteChapter ? (
                    <img
                        onClick={handleDeleteClick} 
                        disabled={sender} 
                        src={DeleteImage}
                        alt="Delete Icon"
                        className="w-[25px] mr-5"
                    />
                ) : null}
            </div>
        </div>
    );
};

export default Chapter;