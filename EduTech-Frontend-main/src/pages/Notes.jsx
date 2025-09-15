import { FaBookOpen } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import Loader from "../components/Loader";
import { GrNotes } from "react-icons/gr";
import { MdBook } from "react-icons/md";
import PdfImage from "../assets/PDF.png";
import media from '../assets/media.png';
import wordImage from "../assets/word.png";
import txtFile from '../assets/txtFile.png';
import DeleteImage from "../assets/Delete.png";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { getAPI, postAPIMedia, postAPI } from "../caller/axiosUrls";
import { IoCreate } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { TbFileTypeTxt } from "react-icons/tb";
import { LuAudioLines } from "react-icons/lu";
import upload from "../assets/CloudUpload.png";
import ToggleButton from "../components/ToggleButton";
import infoBlue from "../assets/Info.png";
import { PDFDocument } from 'pdf-lib';
import { MdOutlineAccessTime } from "react-icons/md";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import ReactPlayer from 'react-player';
import { useNavigate } from "react-router-dom";

const Notes = () => {
    const [activeTab, setActiveTab] = useState("books");
    const [sender, setSender] = useState(false);
    const [notesName, setNotesName] = useState('');
    const [notes, setNotes] = useState([]);
    const [tipsSheets, setTipSheets] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookOptions, setBookOptions] = useState([]);
    const [chapterOptions, setChapterOptions] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [searchNotes, setSearchNotes] = useState('');
    const [searchTipsheet, setSearchTipsheet] = useState('');
    const [isTipSheet, setIsTipSheet] = useState(false);
    const [uploadPDF, setUploadPDF] = useState(null);
    const [uploadWord, setUploadWord] = useState(null);
    const [pdfPageCount, setPDFPageCount] = useState(0);
    const [uploadTxt, setUploadTxt] = useState(null);
    const [uploadAudio, setUploadAudio] = useState(null);   
    const [uploadVideo, setUploadVideo] = useState(null);
    const [uploadYoutube, setUploadYoutube] = useState('');
    const [pages, setPages] = useState('');
    const [hoveredInfo, setHoveredInfo] = useState(false);
    const [startTimeHours, setStartTimeHours] = useState(null);
    const [startTimeMinutes, setStartTimeMinutes] = useState(null);
    const [startTimeSeconds, setStartTimeSeconds] = useState(null);
    const [endTimeHours, setEndTimeHours] = useState(null);
    const [endTimeMinutes, setEndTimeMinutes] = useState(null);
    const [endTimeSeconds, setEndTimeSeconds] = useState(null);
    const [maxDuration, setMaxDuration] = useState(0);
    const [timeIssue, setTimeIssue] = useState(false);
    const [videoLoadError, setVideoLoadError] = useState(false);
    const [isYT, setISYT] = useState(true);
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [notesLoading, setNotesLoading] = useState(true);
    const [tipsheetLoading, setTipsheetLoading] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();
    

    // Convert HH:MM:SS to total seconds
    const convertToSeconds = (hours, minutes, seconds) => {
        return hours * 3600 + minutes * 60 + seconds;
    };

    // Convert total seconds to HH:MM:SS
    const convertToHHMMSS = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return { hours, minutes, secs };
    };

    // Seek to start time and play the video
    const handleTimeChange = () => {
        const startTime = convertToSeconds(startTimeHours, startTimeMinutes, startTimeSeconds);
        if (playerRef.current) {
            playerRef.current.seekTo(startTime, 'seconds');

            setIsPlaying(true);
        }
    };

    // Handle video progress to loop between start and end times
    const handleProgress = (progress) => {
        const startTime = convertToSeconds(startTimeHours, startTimeMinutes, startTimeSeconds);
        const endTime = convertToSeconds(endTimeHours, endTimeMinutes, endTimeSeconds);
        
        if (progress.playedSeconds >= endTime || progress.playedSeconds < startTime) {
            playerRef.current.seekTo(startTime, 'seconds');
        }
    };  
      
    // Handle video duration and set end time automatically
    const handleDuration = (duration) => {
        if (activeTab === 'ytUrl' || duration !== 0 && maxDuration === 0) {
            setMaxDuration(duration);
            setNotesName(activeTab === 'ytUrl' ? `YT-${generateRandomCode()}` : activeTab === 'audio' ? `AUD-${generateRandomCode()}` : `VID-${generateRandomCode()}`);

            // Set the end time to the video duration in HH:MM:SS
            const { hours, minutes, secs } = convertToHHMMSS(duration);
            setStartTimeHours(startTimeHours || 0);
            setStartTimeMinutes(startTimeMinutes || 0);
            setStartTimeSeconds(startTimeSeconds || 0);
            setEndTimeHours(endTimeHours || hours);
            setEndTimeMinutes(endTimeMinutes || minutes);
            setEndTimeSeconds(endTimeSeconds || secs);
        }
    };

    // Validate inputs to ensure they don't exceed the video duration
    const handleInputChange = (setter, value, maxValue) => {
        if (value < 0) setter(0);
        else if (value > maxValue) setter(maxValue);
        else setter(value);
    };

    const padTimeValue = (value) => {
        return value < 10 ? `0${value}` : `${value}`;
    };

    // Automatically play the video when the start or end time changes
    useEffect(() => {
        handleTimeChange();
        const startSeconds = convertToSeconds(startTimeHours, startTimeMinutes, startTimeSeconds);
        const endSeconds = convertToSeconds(endTimeHours, endTimeMinutes, endTimeSeconds);
        if (maxDuration < startSeconds || 
            maxDuration < endSeconds || 
            endSeconds < startSeconds) setTimeIssue(true);
        else setTimeIssue(false);
    }, [maxDuration, startTimeHours, startTimeMinutes, startTimeSeconds, endTimeHours, endTimeMinutes, endTimeSeconds]);

    const fetchUserNotes = async () => {
        setNotesLoading(true);

        try {
            const response = await getAPI(`/notes/get-user-all-notes?type=${activeTab}&search=${searchNotes}`);
            setNotes(response.notes);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setNotesLoading(false);
        }
    };

    const fetchUserTipSheet = async () => {
        setTipsheetLoading(true);

        try {
            const response = await getAPI(`/notes/get-user-all-notes?type=${activeTab}&search=${searchTipsheet}&isTipSheet=1`);
            setTipSheets(response.notes);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setTipsheetLoading(false);
        }
    };

    //fetching the stored notes for the user
    useEffect(() => {
        fetchUserNotes();
        fetchUserTipSheet();
    }, [activeTab]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUserNotes();
        }, 500);
     
        return () => clearTimeout(delayDebounceFn);
    }, [searchNotes]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUserTipSheet();
        }, 500);
        
        return () => clearTimeout(delayDebounceFn);
    }, [searchTipsheet]);
    

    const formatBooksForDropdown = (books, label) => {
        return books.map((book) => ({
          label: `${book.name} ${book.user ? `- (${book.user.name})` : ""}`,
          value: book,
          group: label,
        }));
    };

    const formatChaptersForDropdown = (chapters) => {
        return chapters.map((chapter) => ({
          label: chapter.chapterName,
          value: chapter,
        }));
    };    

    const readFile = async (file) => {

        return new Promise((resolve, reject) => {
      
          const reader = new FileReader();
      
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
      
          reader.readAsArrayBuffer(file);
        });
    }

    async function getPdfPageCount(file) {
        try {
            const arrayBuffer = await readFile(file);
            const pdf = await PDFDocument.load(arrayBuffer);
            return pdf.getPageCount();
        } catch (error) {
            toast.error(error.message);
        }
    }  

    const getBooks = async () => {
        setSender(true);
        setBookOptions([]);
        setSelectedBook(null);
        try {
          const response = await getAPI(`/books/get-books`);
          const local = response.userBooks || [];
          const global = response.publicBooks || [];
    
          const formattedOptions = [
            { label: "Local", options: formatBooksForDropdown(local, "Local") },
            { label: "Global", options: formatBooksForDropdown(global, "Global") },
          ];
    
          setBookOptions(formattedOptions);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setSender(false);
        }
    };

    const handleBookSelect = async (selectedOption) => {
        setSelectedBook(selectedOption);
        setChapterOptions([]);
        setSelectedChapters([]);
        setSender(true);
        try {
          const response = await getAPI(
            `/chapters/getallchapters?bookId=${selectedOption.value.bookId}`
          );
          const chapterList = response.chapters || [];
    
          const formattedOptions = [
            { label: "Chapters", options: formatChaptersForDropdown(chapterList) },
          ];
          setChapterOptions(formattedOptions);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setSender(false);
        }
    };

    const handleContentAdd = () => {
        if (selectedBook && selectedChapters.length > 0) {
            // Create the new content object
            const newContent = {
                book: {
                    id: selectedBook.value.bookId,
                    name: selectedBook.value.name,
                    user: selectedBook.value.user?.name,
                },
                chapters: selectedChapters.map((chapter) => ({
                    id: chapter.value.chapterId,
                    name: chapter.value.chapterName,
                    url: chapter.value.chapterURL,
                })),
            };
    
            return newContent;
        } else {
            // Show error toast if no book or chapters are selected
            toast.error(t("psbabaaloc"));
        } 
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!notesName) {
          toast(t("arfanf"), {
            icon: "⚠️",
          });
          return;
        }

        if (activeTab === 'books') {
            const data = handleContentAdd();
    
            if (!data) {
                toast(t("paaobaooic"), {
                    icon: "⚠️",
                });
                return;
            }
        
            if (sender) return;
            else setSender(true);
        
            try{
                const chapterUrls = data.chapters ? data.chapters.map((chapter) => chapter.url) : [];
                const bookId = data.book?.id || null;

                const formData = {
                    name: notesName,
                    type: "books",
                    chapterList: JSON.stringify(chapterUrls),
                    bookId: JSON.stringify(bookId),
                    isTipSheet
                }

                await postAPI(
                    `/notes/create-notes-from-books`,
                    formData
                );

                toast.success("Notes created successfully!");
                fetchUserNotes();
                fetchUserTipSheet();
                clearAll();
                getBooks();
            } catch (error) {
                toast.error(error.message);
            } finally {
                setSender(false);
            }
        }else if (activeTab === 'txt') {
            if (!uploadTxt) {
                toast("Please provide a text file!", {
                    icon: "⚠️",
                });
                return;
            }
        
            if (sender) return;
            else setSender(true);
            
            try {
                const formData = new FormData();

                formData.append("name", notesName); 
                formData.append("type", "txt");
                formData.append("txtFile", uploadTxt.file);
                formData.append("isTipSheet", isTipSheet);
        
                // Make the POST request
                await postAPIMedia(
                    `/notes/create-notes-for-textfile`,
                    formData
                );
                    
                toast.success("Notes created successfully!");
                fetchUserNotes();
                fetchUserTipSheet();
                clearAll(); // Reset inputs after success
            } catch (error) {
                toast.error(error.message);
            } finally {
                setSender(false); 
            }
        } 
        else if (activeTab === 'pdfs') {
            if (!uploadPDF) {
                toast("Please provide a pdf!", {
                    icon: "⚠️",
                });
                return;
            }
        
            if (sender) return;
            else setSender(true);
            
            try {
                const formData = new FormData();

                formData.append("name", notesName); 
                formData.append("type", "pdfs");
                formData.append("pdfFile", uploadPDF.file);
                formData.append("isTipSheet", isTipSheet);
                formData.append("pageRange", pages);

                // Make the POST request
                await postAPIMedia(
                    `/notes/create-notes-custom-pdf`,
                    formData
                );

                toast.success("Notes created successfully!");
                fetchUserNotes();
                fetchUserTipSheet();
                clearAll(); // Reset inputs after success
            } catch (error) {
                toast.error(error.message);
            } finally {
                setSender(false); 
            }
        } else if (activeTab === 'word') {
            if (!uploadWord) {
                toast("Please provide a word file!", {
                    icon: "⚠️",
                });
                return;
            }
        
            if (sender) return;
            else setSender(true);

            try {
                const formData = new FormData();

                formData.append("name", notesName); 
                formData.append("type", "word");
                formData.append("docxFile", uploadWord.file);
                formData.append("isTipSheet", isTipSheet);
        
                // Make the POST request
                await postAPIMedia(
                    `/notes/create-notes-custom-word`,
                    formData
                );
    
                toast.success("Notes created successfully!");
                fetchUserNotes();
                fetchUserTipSheet();
                clearAll(); // Reset inputs after success
            } catch (error) {
                toast.error(error.message);
            } finally {
                setSender(false);
            }
        } else if (activeTab === 'ytUrl') {
            if (!uploadYoutube) {
                toast("Please provide an youtube url!", {
                    icon: "⚠️",
                });
                return;
            }
        
            if (sender) return;
            else setSender(true);

            try {

                const formData = {
                    name: notesName,
                    type: "ytUrl",
                    youtubeUrl: uploadYoutube,
                    isTipSheet
                }

                await postAPI(
                    `/notes/create-notes-from-youtubeurl`,
                    formData
                );
        
               
                toast.success("Notes created successfully!");
                fetchUserNotes();
                fetchUserTipSheet();
                clearAll();
            } catch (error) {
                toast.error(error.message);
            } finally {
                setSender(false);
            }
        } else if (activeTab === 'video') {

        } else if (activeTab === 'audio') {
            if (!uploadAudio) {
                toast("Please provide an audio file!", {
                    icon: "⚠️",
                });
                return;
            }
        
            if (sender) return;
            else setSender(true);

            try {
                const formData = new FormData();

                formData.append("name", notesName); 
                formData.append("type", "customAudioFile");
                formData.append("audioFile", uploadAudio.file);
                formData.append("isTipSheet", isTipSheet);
        
                // Make the POST request
                await postAPIMedia(
                    `/notes/create-notes-custom-audio`,
                    formData
                );
    
                toast.success("Notes created successfully!");
                fetchUserNotes();
                fetchUserTipSheet();
                clearAll(); // Reset inputs after success
            } catch (error) {
                toast.error(error.message);
            } finally {
                setSender(false);
            }
        }
    };

    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleFileChange = async (e) => {
        setPDFPageCount(0);
        const files = Array.from(e.target.files);
    
        if (files.length === 0) {
            toast("Please select a file!", {
                icon: "⚠️",
            });
            return;
        }

        // Ensure exactly one file is selected
        if (files.length !== 1) {
            toast("Please select only 1 file!", {
                icon: "⚠️",
            });
            return;
        }
    
        const file = files[0];

        // Ensure that the file size is less than 10 MB
        const maxSizeInBytes = (activeTab === 'video' ? 50 : 10) * 1024 * 1024; // 10 MB in bytes
        if (file.size > maxSizeInBytes) {
            toast("File size limit exceeded! (Max 10MB)", {
                icon: "⚠️",
            });
            return;
        }

        // Ensure that the file name length is within 100 characters
        if (file.name.length > 100) {
            toast(t("fnsnbemt1c"), {
                icon: "⚠️",
            });
            return;
        }

        const fileNameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.'));
        setNotesName(fileNameWithoutExtension + `-${generateRandomCode()}`);

        if (activeTab === 'pdfs') {
            // Ensure that the selected file is a PDF
            if (file.type !== "application/pdf") {
                toast("Only PDF file is allowed!", {
                    icon: "⚠️",
                });
                return;
            }
        
            // Create a new file object
            const newFile = {
                file: file,
                scan: false,
            };

            const pageCount = await getPdfPageCount(file);
            setPDFPageCount(pageCount);
        
            setPages(`[1-${pageCount}]`)
            setUploadPDF(newFile); 
        } else if (activeTab === 'word') {
            // Ensure that the selected file is a Word document (.docx)
            if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                toast("Only word file is allowed!", {
                    icon: "⚠️",
                });
                return;
            }

            // Create a new file object
            const newFile = {
                file: file,
            };
            // Store the Word file
            setUploadWord(newFile);
        } else if (activeTab === 'txt') {
            // Ensure that the selected file is a text file (.txt)
            if (file.type !== "text/plain") {
                toast("Only text file is allowed!", {
                    icon: "⚠️",
                });
                return;
            }

            // Create a new file object
            const newFile = {
                file: file,
            };

            // Store the text file
            setUploadTxt(newFile);
        } else if (activeTab === 'video') {
            // Ensure that the selected file is a video file
            if (!file.type.startsWith("video/")) {
                toast("Only video file is allowed!", {
                    icon: "⚠️",
                });
                return;
            }

            // Create a new file object
            const newFile = {
                file: file,
            };

            // Store the video file
            setUploadVideo(newFile);
        } else if (activeTab === 'audio') {
            // Ensure that the selected file is a video file
            if (!file.type.startsWith("audio/")) {
                toast("Only audio file is allowed!", {
                    icon: "⚠️",
                });
                return;
            }

            // Create a new file object
            const newFile = {
                file: file,
            };

            // Store the video file
            setUploadAudio(newFile);
        }
    };    

    const validateAndMergeRanges = (pages) => {
        const maxPages = (activeTab === 'pdfs') ? pdfPageCount : wordPageCount;
        // Remove all whitespace around commas and trim the input
        const cleanedPages = pages.replace(/\s*,\s*/g, ',').trim();
    
        // Regular expression to match valid formats
        const validFormatRegex = /^(\[\d+-\d+\]|\d+)(,(\[\d+-\d+\]|\d+))*$/;
    
        // Check if the input matches the valid format
        if (!validFormatRegex.test(cleanedPages)) {
            return false;
        }
    
        // Split the cleaned input by commas
        const parts = cleanedPages.split(',').map(part => part.trim());
    
        // Convert ranges and single pages into a list of numbers
        let ranges = parts.map(part => {
            if (part.startsWith('[') && part.endsWith(']')) {
                const [start, end] = part.slice(1, -1).split('-').map(Number);
                if (start > maxPages || end > maxPages || start > end) {
                    return null;
                }
                return [start, end];
            } else {
                const page = Number(part);
                if (page > maxPages) {
                    return null;
                }
                return [page, page];
            }
        });
    
        // Remove invalid ranges (those that are null)
        ranges = ranges.filter(range => range !== null);
    
        if (ranges.length === 0) {
            return false;
        }
    
        // Sort and merge ranges
        ranges.sort((a, b) => a[0] - b[0]);
    
        const mergedRanges = [];
        let currentRange = ranges[0];
    
        for (let i = 1; i < ranges.length; i++) {
            const [currentStart, currentEnd] = currentRange;
            const [nextStart, nextEnd] = ranges[i];
    
            if (nextStart <= currentEnd + 1) {
                currentRange = [currentStart, Math.max(currentEnd, nextEnd)];
            } else {
                mergedRanges.push(currentRange);
                currentRange = ranges[i];
            }
        }
        mergedRanges.push(currentRange);
    
        // Convert merged ranges back to string format
        const mergedPages = mergedRanges
            .map(([start, end]) => (start === end ? `${start}` : `[${start}-${end}]`))
            .join(', ');
    
        return mergedPages;
    };     
    
    const handlePagesChange = (e) => {
        if (e.target.value === '') return;

        const mergedPages = validateAndMergeRanges(e.target.value);
    
        if (!mergedPages) {
            setPages('');
            toast("Invalid page range format!", {
                icon: "⚠️",
            });
        } else {
            setPages(mergedPages);
        }
    };

    const handleChangeTab = async (tabname) => {
        setNotes([]);
        setActiveTab(tabname);
        clearAll();
    }

    const clearAll = () => {
        setNotesName("");
        setSearchNotes('');
        setSearchTipsheet('');
        setPages('');
        setIsTipSheet(false);
        setPDFPageCount(0);
        setHoveredInfo(false);
        setSelectedBook(null);
        setBookOptions([]);
        setChapterOptions([]);
        setSelectedChapters([]);
        setUploadAudio(null);
        setUploadPDF(null);
        setUploadWord(null);
        setUploadYoutube('');
        setUploadTxt(null);
        setUploadVideo(null);
        setStartTimeHours(null);
        setStartTimeMinutes(null);
        setStartTimeSeconds(null);
        setEndTimeHours(null);
        setEndTimeMinutes(null);
        setEndTimeSeconds(null);
        setMaxDuration(0);
        setVideoLoadError(false);
        setTimeIssue(false);
        setISYT(true);
        playerRef.current = null;
    }

    const handleChapterSelect = (selectedOptions) => {
        setSelectedChapters(selectedOptions);
    };

    // YouTube URL validation regex
    const isValidYouTubeUrl = (url) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        return youtubeRegex.test(url);
    };

    // Handle URL input change
    const handleUrlChange = (value) => {
        const url = value;
        if (isValidYouTubeUrl(url)) {
            setUploadYoutube(url);
        } else {
            setISYT(false);
            setUploadYoutube('');
        }
    };

    useEffect(() => {
        if (activeTab === 'books') getBooks();
    }, [activeTab])

    return (
        <div className="overflow-y-auto">
            <p className="text-center font-semibold">Beta Version</p>
            {/* Tab Navigation */}
            <div className="flex gap-x-10 bg-customBlueLight px-5 text-white shadow mx-4 mt-2 rounded-[30px] border border-white">
                <p
                    onClick={() => handleChangeTab("books")}
                    className={`${
                        activeTab === "books" ? "bg-white text-customBlue shadow" : ""
                    } cursor-pointer rounded-[30px] my-2 py-3 grow text-center text-xl font-semibold flex items-center justify-center gap-x-3`}
                >
                    Books <FaBookOpen className="text-2xl" />
                </p>
                <p
                    onClick={() => handleChangeTab("txt")}
                    className={`${
                        activeTab === "txt" ? "bg-white text-customBlue shadow" : ""
                    } cursor-pointer rounded-[30px] my-2 py-3 grow text-center text-xl font-semibold flex items-center justify-center gap-x-3`}
                >
                    TXT <TbFileTypeTxt className="text-2xl" />
                </p>
                <p
                    onClick={() => handleChangeTab("pdfs")}
                    className={`${
                        activeTab === "pdfs" ? "bg-white text-customBlue shadow" : ""
                    } cursor-pointer rounded-[30px] my-2 py-3 grow text-center text-xl font-semibold flex items-center justify-center gap-x-3`}
                >
                    PDF <FaFilePdf className="text-2xl" />
                </p>
                <p
                    onClick={() => handleChangeTab("word")}
                    className={`${
                        activeTab === "word" ? "bg-white text-customBlue shadow" : ""
                    } cursor-pointer rounded-[30px] my-2 py-3 grow text-center text-xl font-semibold flex items-center justify-center gap-x-3`}
                >
                    Word <FaFileWord className="text-2xl" />
                </p>
                <p
                    onClick={() => handleChangeTab("ytUrl")}
                    className={`${
                        activeTab === "ytUrl" ? "bg-white text-customBlue shadow" : ""
                    } cursor-pointer rounded-[30px] my-2 py-3 grow text-center text-xl font-semibold flex items-center justify-center gap-x-3`}
                >
                    Youtube <FaYoutube className="text-2xl" />
                </p>
                <p
                    onClick={() => handleChangeTab("video")}
                    className={`${
                        activeTab === "video" ? "bg-white text-customBlue shadow" : ""
                    } cursor-pointer rounded-[30px] my-2 py-3 grow text-center text-xl font-semibold flex items-center justify-center gap-x-3`}
                >
                    Video <FaVideo className="text-2xl" />
                </p>
                <p
                    onClick={() => handleChangeTab("audio")}
                    className={`${
                        activeTab === "audio" ? "bg-white text-customBlue shadow" : ""
                    } cursor-pointer rounded-[30px] my-2 py-3 grow text-center text-xl font-semibold flex items-center justify-center gap-x-3`}
                >
                    Audio <LuAudioLines className="text-2xl" />
                </p>
            </div>

            {/* Content Area */}
            
            {/* Create Form */}
            <div className={`mt-4 border shadow w-9/12 mx-auto rounded-[30px] px-4 py-3 ${activeTab === 'ytUrl' ? 'h-[450px]' : (activeTab === 'video' || activeTab === 'audio' ? 'h-[480px]' : 'h-[300px]')}`}>
                {sender ? (<Loader />) : (
                    <>
                        {activeTab === "books" && 
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Generate Notes</p>
                                <div className=" w-full flex items-start justify-center gap-x-[40px] px-4 py-3">
                                    <div className="flex flex-col w-1/2 gap-y-4">
                                        <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                                            <GrNotes className="text-customBlue mr-2 text-2xl" />
                                            <input 
                                                className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                id="notesName"
                                                placeholder={"Enter Notes Name"}
                                                value={notesName}
                                                maxLength={40}
                                                disabled={sender}
                                                onChange={(e) => setNotesName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center mt-2 bg-[#F3F5FD] rounded-3xl border-1 border-customBlue p-1 px-4 ">
                                            <MdBook className="text-customBlue mr-2 text-2xl" />
                                            <div className="flex-1">
                                                <Select
                                                    disabled={sender}
                                                    options={bookOptions}
                                                    value={selectedBook}
                                                    onChange={(selectedOption) => handleBookSelect(selectedOption)}
                                                    isSearchable
                                                    placeholder={t('selectabook')}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            border: "none", // Remove internal border since the container already has one
                                                            boxShadow: "none",
                                                            backgroundColor: "#F3F5FD",
                                                            fontSize: "16px"
                                                        }),
                                                        container: (base) => ({
                                                            ...base,
                                                            width: "100%", // Make sure select takes full width
                                                        }),
                                                        menu: (base) => ({
                                                            ...base,
                                                            borderRadius: "30px",
                                                            overflow: "hidden",
                                                            padding: "0 10px",
                                                            position: "absolute",
                                                            left: "-58px",
                                                            width: "450px",
                                                            top: "44px"
                                                        }),
                                                        option: (base) => ({
                                                            ...base,
                                                            color: "blue",
                                                            borderRadius: "30px",
                                                            padding: "10px 20px"
                                                        }),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="gap-y-2 w-1/2 flex flex-col">
                                        {selectedBook ? <div className="flex items-center h-[115px] bg-[#F3F5FD] rounded-3xl border-1 border-customBlue p-1 px-4">
                                            <MdBook className="text-customBlue mr-2 text-2xl" />
                                            <div className="flex-1">
                                                <Select
                                                    disabled={sender}
                                                    options={chapterOptions}
                                                    value={selectedChapters}
                                                    onChange={(selectedOption) =>
                                                        handleChapterSelect(selectedOption)
                                                    }
                                                    isSearchable
                                                    isMulti
                                                    placeholder={t("selectchapters...")}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            border: "none", // Remove internal border since the container already has one
                                                            boxShadow: "none",
                                                            backgroundColor: "#F3F5FD",
                                                            fontSize: "16px"
                                                        }),
                                                        container: (base) => ({
                                                            ...base,
                                                            width: "100%", // Make sure select takes full width
                                                        }),
                                                        menu: (base) => ({
                                                            ...base,
                                                            borderRadius: "30px",
                                                            overflow: "hidden",
                                                            padding: "0 10px",
                                                            position: "absolute",
                                                            left: "-58px",
                                                            width: "450px",
                                                            top: "74px"
                                                        }),
                                                        option: (base) => ({
                                                            ...base,
                                                            color: "blue",
                                                            borderRadius: "30px",
                                                            padding: "10px 20px"
                                                        }),
                                                    }}
                                                />
                                            </div>
                                        </div> : <div className="self-center text-xl font-semibold mt-5 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Select a book first!</div>}
                                    </div>
                                </div>
                                <div className="flex items-center self-start justify-start gap-x-4 mt-2 px-4">
                                    <button disabled={sender || !selectedChapters.length || !notesName} className={`${(sender || !selectedChapters.length || !notesName) ? 'bg-gray-400 not-allowed' : ''} shadow-md flex items-center gap-x-2 custom-btn px-5 border border-white text-2xl py-2 rounded-[30px]`}  onClick={handleSubmit}>
                                        <FaPlus className="text-xl" /> Create
                                    </button>
                                    <div className="flex gap-x-4 items-center justify-center">
                                        <ToggleButton 
                                            id="tipSheet"
                                            defaultChecked={isTipSheet}
                                            onChange={() => setIsTipSheet(!isTipSheet)}
                                        />
                                        <p className="font-semibold w-[150px]">{isTipSheet ? "Tips Sheet" : "Notes"}</p>
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === "pdfs" && 
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Generate Notes</p>
                                <div className="w-full flex items-start justify-center gap-x-[40px] px-4 pt-3">
                                    <div className="flex flex-col w-1/2 gap-y-4">
                                        <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                                            <GrNotes className="text-customBlue mr-2 text-2xl" />
                                            <input 
                                                className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                id="notesName"
                                                placeholder={"Enter Notes Name"}
                                                value={notesName}
                                                maxLength={40}
                                                disabled={sender}
                                                onChange={(e) => setNotesName(e.target.value)}
                                            />
                                        </div>
                                        <div className="h-[65px] w-full">
                                            {uploadPDF ? 
                                            <div
                                                className="p-1 px-2 rounded-3xl border-2 hover:shadow-md h-[75px] items-center flex hover:border-blue-500 hover:border-2"
                                                style={{ borderColor: "#94ABFF" }}
                                            >
                                                <div className="flex flex-col w-full sm:flex-row gap-y-4">
                                                    <div
                                                        className="cursor-pointer flex-1 truncate flex items-center"
                                                        onClick={() => {
                                                            const fileURL = URL.createObjectURL(
                                                                uploadPDF.file
                                                            );
                                                            window.open(fileURL, "_blank");
                                                        }}
                                                    >
                                                        <div className="p-2 rounded-full text-white mx-2">
                                                            <img src={PdfImage} className="min-w-[45px] drop-shadow" size={20} />
                                                        </div>
                                                        <div className="truncate mr-2">
                                                            <p title={uploadPDF.file.name} className="text-sm font-semibold text-gray-800 sm:mr-4 truncate hover:text-blue-500">
                                                                {uploadPDF.file.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {(
                                                                uploadPDF.file.size /
                                                                1024 /
                                                                1024
                                                                ).toFixed(2)}{" "}
                                                                MB
                                                            </p>
                                                        </div>
                                                    </div>
                
                                                    <div
                                                        className={`${
                                                        sender ? "pointer-events-none" : ""
                                                        } items-center self-end sm:self-center flex sm:flex-col gap-x-2 gap-y-1`}
                                                    >
                                                        <div className="flex items-center justify-center gap-x-4 mx-2">
                                                            {/* Delete Button */}
                                                            <button
                                                                className="text-red-500 hover:text-red-700 font-bold"
                                                                onClick={() => {
                                                                    setUploadPDF(null);
                                                                    setNotesName('');
                                                                    setPages('');
                                                                }}
                                                            >
                                                                <img src={DeleteImage} className="w-[25px] mr-1" alt="Delete" />
                                                            </button>
                    
                                                            {/* <ToggleButton
                                                                defaultChecked={uploadPDF.scan}
                                                                onChange={() => setUploadPDF(prevState => ({
                                                                    ...prevState,
                                                                    scan: !prevState.scan
                                                                }))}
                                                            />
                    
                                                            <div className="relative">
                                                                <img
                                                                    src={infoBlue}
                                                                    alt="Info Icon"
                                                                    style={{
                                                                        width: "20px",
                                                                        height: "20px",
                                                                    }} // Size of the image
                                                                    className="cursor-pointer"
                                                                    onMouseEnter={() => setHoveredInfo(true)}
                                                                    onMouseLeave={() => setHoveredInfo(false)}
                                                                />
                                                                {hoveredInfo ? <div
                                                                    className="absolute left-1/2 bottom-full mb-2 p-2 bg-customBlue rounded-lg shadow-lg w-[30vh]  transform -translate-x-1/2"
                                                                    style={{ bottom: "110%" }}
                                                                >
                                                                    <p className="text-xs text-white">
                                                                        <b>{t('itps')}</b>
                                                                        <br />
                                                                        {t('ctctsitpcht')}
                                                                    </p>
                                                                </div> : null} 
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="relative hover:scale-105 active:scale-90 cursor-pointer flex flex-col bg-[#F3F5FD] justify-center items-center border-[1px] border-[#367CFF] px-8 pt-2 pb-0 rounded-3xl transition duration-300 ease-in-out w-full">
                                                <div className="flex gap-2 justify-center items-center p-2 mb-2 ">
                                                    <img
                                                        src={upload}
                                                        height={"30px"}
                                                        width={"33px"}
                                                    />
                                                    <p
                                                        className="text-sm text-center"
                                                        style={{ color: "#6B6C70" }}
                                                    >
                                                    {"Click to Upload PDF"}
                                                    </p>
                                                </div>
                                                <input
                                                    className="opacity-0 cursor-pointer absolute inset-0"
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={handleFileChange}
                                                    disabled={sender}
                                                />
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-1/2 gap-y-2">
                                        <p className="text-[12px] ml-2">Note: Do not provide more pages, than present in the document!</p>
                                        <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                                            <GrNotes className="text-customBlue mr-2 text-2xl" />
                                            <input 
                                                className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                id="pages"
                                                placeholder={"Enter Page/s Range"}
                                                value={pages}
                                                maxLength={40}
                                                disabled={sender}
                                                onChange={(e) => setPages(e.target.value)}
                                                onBlur={handlePagesChange}
                                            />
                                        </div>
                                        <div className="flex flex-col text-[12px] ml-2 font-semibold">
                                            <p>For ranges: [First Page No. - Last Page No.]</p>
                                            <p>For single page: Page No.</p>
                                            <p>Ex: [1-5], 8, [10-11]</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center self-start justify-start gap-x-4 mt-2 px-4">
                                    <button disabled={sender || !uploadPDF || !notesName} className={`${(sender || !uploadPDF || !notesName) ? 'bg-gray-400 not-allowed' : ''} shadow-md flex items-center gap-x-2 custom-btn px-5 border border-white text-2xl py-2 rounded-[30px]`} onClick={handleSubmit}>
                                        <FaPlus className="text-xl" /> Create
                                    </button>
                                    <div className="flex gap-x-4 items-center justify-center">
                                        <ToggleButton 
                                            id="tipSheet"
                                            defaultChecked={isTipSheet}
                                            onChange={() => setIsTipSheet(!isTipSheet)}
                                        />
                                        <p className="font-semibold w-[150px]">{isTipSheet ? "Tips Sheet" : "Notes"}</p>
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === "word" && 
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Generate Notes</p>
                                <div className="w-full flex items-center justify-center gap-x-[40px] px-4 pt-3">
                                    <div className="flex flex-col w-1/2 gap-y-4">
                                        <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                                            <GrNotes className="text-customBlue mr-2 text-2xl" />
                                            <input 
                                                className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                id="notesName"
                                                placeholder={"Enter Notes Name"}
                                                value={notesName}
                                                maxLength={40}
                                                disabled={sender}
                                                onChange={(e) => setNotesName(e.target.value)}
                                            />
                                        </div>
                                        <div className="h-[65px] w-full">
                                            {uploadWord ? 
                                            <div
                                                className="p-1 px-2 rounded-3xl border-2 hover:shadow-md h-[75px] items-center flex hover:border-blue-500 hover:border-2"
                                                style={{ borderColor: "#94ABFF" }}
                                            >
                                                <div className="flex flex-col w-full sm:flex-row gap-y-4">
                                                    <div
                                                        className="cursor-pointer flex-1 truncate flex items-center"
                                                        onClick={() => {
                                                            const fileURL = URL.createObjectURL(
                                                                uploadWord.file
                                                            );
                                                            window.open(fileURL, "_blank");
                                                        }}
                                                    >
                                                        <div className="p-2 rounded-full text-white mx-2">
                                                            <img src={wordImage} width="20px" className="min-w-[45px] drop-shadow" size={20} />
                                                        </div>
                                                        <div className="truncate mr-2">
                                                            <p title={uploadWord.file.name} className="text-sm font-semibold text-gray-800 sm:mr-4 truncate hover:text-blue-500">
                                                                {uploadWord.file.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {(
                                                                uploadWord.file.size /
                                                                1024 /
                                                                1024
                                                                ).toFixed(2)}{" "}
                                                                MB
                                                            </p>
                                                        </div>
                                                    </div>
                
                                                    <div
                                                        className={`${
                                                        sender ? "pointer-events-none" : ""
                                                        } items-center self-end sm:self-center flex sm:flex-col gap-x-2 gap-y-1`}
                                                    >
                                                        <div className="flex items-center justify-center gap-x-4 mx-2">
                                                            {/* Delete Button */}
                                                            <button
                                                                className="text-red-500 hover:text-red-700 font-bold"
                                                                onClick={() => {
                                                                    setUploadWord(null);
                                                                    setNotesName('');
                                                                    setPages('');
                                                                }}
                                                            >
                                                                <img src={DeleteImage} className="w-[25px] mr-1" alt="Delete" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="relative hover:scale-105 active:scale-90 cursor-pointer flex flex-col bg-[#F3F5FD] justify-center items-center border-[1px] border-[#367CFF] px-8 pt-2 pb-0 rounded-3xl transition duration-300 ease-in-out w-full">
                                                <div className="flex gap-2 justify-center items-center p-2 mb-2 ">
                                                    <img
                                                        src={upload}
                                                        height={"30px"}
                                                        width={"33px"}
                                                    />
                                                    <p
                                                        className="text-sm text-center"
                                                        style={{ color: "#6B6C70" }}
                                                    >
                                                    {"Click to Upload Docx"}
                                                    </p>
                                                </div>
                                                <input
                                                    className="opacity-0 cursor-pointer absolute inset-0"
                                                    type="file"
                                                    accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={handleFileChange}
                                                    disabled={sender}
                                                />
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center self-start justify-start gap-x-4 mt-2 px-4">
                                    <button disabled={sender || !uploadWord || !notesName} className={`${(sender || !uploadWord || !notesName) ? 'bg-gray-400 not-allowed' : ''} shadow-md flex items-center gap-x-2 custom-btn px-5 border border-white text-2xl py-2 rounded-[30px]` } onClick={handleSubmit}>
                                        <FaPlus className="text-xl" /> Create
                                    </button>
                                    <div className="flex gap-x-4 items-center justify-center">
                                        <ToggleButton 
                                            id="tipSheet"
                                            defaultChecked={isTipSheet}
                                            onChange={() => setIsTipSheet(!isTipSheet)}
                                        />
                                        <p className="font-semibold w-[150px]">{isTipSheet ? "Tips Sheet" : "Notes"}</p>
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === "ytUrl" && 
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Generate Notes</p>
                                <div className="w-full flex items-start justify-between gap-x-[40px] px-4 pt-3">
                                    <div className="flex flex-col w-1/2 gap-y-4">
                                        <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                                            <GrNotes className="text-customBlue mr-2 text-2xl" />
                                            <input 
                                                className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                id="notesName"
                                                placeholder={"Enter Notes Name"}
                                                value={notesName}
                                                maxLength={40}
                                                disabled={sender}
                                                onChange={(e) => setNotesName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                                            <GrNotes className="text-customBlue mr-2 text-2xl" />
                                            <input 
                                                className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                id="youtubeUrl"
                                                placeholder={"Enter Youtube URL"}
                                                value={uploadYoutube}
                                                maxLength={2000}
                                                disabled={sender}
                                                onChange={(e) => {
                                                    setMaxDuration(0);
                                                    setTimeIssue(false);
                                                    setVideoLoadError(false);
                                                    setISYT(true);
                                                    handleUrlChange(e.target.value);
                                                    setStartTimeHours(null);
                                                    setStartTimeMinutes(null);
                                                    setStartTimeSeconds(null);
                                                    setEndTimeHours(null);
                                                    setEndTimeMinutes(null);
                                                    setEndTimeSeconds(null);
                                                    setNotesName('');
                                                }}
                                            />
                                        </div>
                                        {uploadYoutube && false ? 
                                        <div className="flex flex-col gap-y-4">
                                         {/* Start Time */}
                                         <div className="flex flex-col w-full">
                                           <p className="text-md font-semibold ml-4">Start Time:</p>
                                           <div className="flex items-center gap-x-4">
                                             {/* HH Input */}
                                             <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                                               <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                                               <input
                                                 type="number"
                                                 max="99"
                                                 min="0"
                                                 value={padTimeValue(startTimeHours)}
                                                 placeholder="HH"
                                                 className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                 onChange={(e) => handleInputChange(setStartTimeHours, parseInt(e.target.value), Math.floor(maxDuration / 3600))}
                                               />
                                             </div>
                                 
                                             {/* MM Input */}
                                             <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                                               <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                                               <input
                                                 type="number"
                                                 max="59"
                                                 min="0"
                                                 value={padTimeValue(startTimeMinutes)}
                                                 placeholder="MM"
                                                 className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                 onChange={(e) => handleInputChange(setStartTimeMinutes, parseInt(e.target.value), 59)}
                                               />
                                             </div>
                                 
                                             {/* SS Input */}
                                             <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                                               <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                                               <input
                                                 type="number"
                                                 max="59"
                                                 min="0"
                                                 value={padTimeValue(startTimeSeconds)}
                                                 placeholder="SS"
                                                 className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                 onChange={(e) => handleInputChange(setStartTimeSeconds, parseInt(e.target.value), 59)}
                                               />
                                             </div>
                                           </div>
                                         </div>
                                 
                                         {/* End Time */}
                                         <div className="flex flex-col w-full mb-2">
                                           <p className="text-md font-semibold ml-4">End Time:</p>
                                           <div className="flex items-center gap-x-4">
                                             {/* HH Input */}
                                             <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                                               <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                                               <input
                                                 type="number"
                                                 max="99"
                                                 min="0"
                                                 value={padTimeValue(endTimeHours)}
                                                 placeholder="HH"
                                                 className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                 onChange={(e) => handleInputChange(setEndTimeHours, parseInt(e.target.value), Math.floor(maxDuration / 3600))}
                                               />
                                             </div>
                                 
                                             {/* MM Input */}
                                             <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                                               <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                                               <input
                                                 type="number"
                                                 max="59"
                                                 min="0"
                                                 value={padTimeValue(endTimeMinutes)}
                                                 placeholder="MM"
                                                 className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                 onChange={(e) => handleInputChange(setEndTimeMinutes, parseInt(e.target.value), 59)}
                                               />
                                             </div>
                                 
                                             {/* SS Input */}
                                             <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                                               <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                                               <input
                                                 type="number"
                                                 max="59"
                                                 min="0"
                                                 value={padTimeValue(endTimeSeconds)}
                                                 placeholder="SS"
                                                 className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                 onChange={(e) => handleInputChange(setEndTimeSeconds, parseInt(e.target.value), 59)}
                                               />
                                             </div>
                                           </div>
                                         </div>
                                        </div> : null}
                                    </div>
                                    {uploadYoutube.length ?
                                    timeIssue ? <div className="justify-center text-xl flex-1 h-full font-semibold mt-32 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Time range incorrect!</div> : 
                                    videoLoadError ? <div className="justify-center text-xl flex-1 h-full font-semibold mt-32 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Youtube URL incorrect!</div> :
                                    !isYT ? <div className="justify-center text-xl flex-1 h-full font-semibold mt-32 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Please provide Youtube URL only!</div> :
                                    <div className="flex flex-col items-center mt-4 w-1/2 gap-y-2">
                                        <div className="rounded-[20px] overflow-hidden">
                                            <ReactPlayer
                                                ref={playerRef}
                                                url={uploadYoutube} 
                                                width={400}
                                                height={225}
                                                playing={isPlaying}
                                                controls={true}
                                                onError={() => setVideoLoadError(true)}
                                                onProgress={handleProgress}
                                                onReady={handleTimeChange}
                                                onDuration={handleDuration}
                                            />
                                        </div>
                                    </div> : <div className="justify-center text-xl flex-1 font-semibold mt-5 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Provide an Youtube URL!</div>}
                                </div>
                                <div className="flex items-center self-start justify-start gap-x-4 mt-2 px-4">
                                    <button disabled={sender || timeIssue || videoLoadError || !isYT || !uploadYoutube || !notesName} className={`${(sender || timeIssue || videoLoadError || !isYT || !uploadYoutube || !notesName) ? 'bg-gray-400 not-allowed' : ''} shadow-md flex items-center gap-x-2 custom-btn px-5 border border-white text-2xl py-2 rounded-[30px]`} onClick={handleSubmit}>
                                        <FaPlus className="text-xl" /> Create
                                    </button>
                                    <div className="flex gap-x-4 items-center justify-center">
                                        <ToggleButton 
                                            id="tipSheet"
                                            defaultChecked={isTipSheet}
                                            onChange={() => setIsTipSheet(!isTipSheet)}
                                        />
                                        <p className="font-semibold w-[150px]">{isTipSheet ? "Tips Sheet" : "Notes"}</p>
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === "video" && 
                            // <div className="flex flex-col items-center justify-center">
                            //     <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Generate Notes</p>
                            //     <div className="w-full flex items-start justify-between gap-x-[40px] px-4 pt-3">
                            //         <div className="flex flex-col w-1/2 gap-y-4">
                            //             <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                 <GrNotes className="text-customBlue mr-2 text-2xl" />
                            //                 <input 
                            //                     className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                     id="notesName"
                            //                     placeholder={"Enter Notes Name"}
                            //                     value={notesName}
                            //                     maxLength={40}
                            //                     disabled={sender}
                            //                     onChange={(e) => setNotesName(e.target.value)}
                            //                 />
                            //             </div>
                            //             <div className="h-[65px] w-full">
                            //                 {uploadVideo ? 
                            //                 <div
                            //                     className="p-1 px-2 rounded-3xl border-2 hover:shadow-md h-[75px] items-center flex hover:border-blue-500 hover:border-2"
                            //                     style={{ borderColor: "#94ABFF" }}
                            //                 >
                            //                     <div className="flex flex-col w-full sm:flex-row gap-y-4">
                            //                         <div
                            //                             className="cursor-pointer flex-1 truncate flex items-center"
                            //                             onClick={() => {
                            //                                 const fileURL = URL.createObjectURL(
                            //                                     uploadVideo.file
                            //                                 );
                            //                                 window.open(fileURL, "_blank");
                            //                             }}
                            //                         >
                            //                             <div className="p-2 rounded-full text-white mx-2">
                            //                                 <img src={media} width="20px" className="min-w-[45px] drop-shadow" size={20} />
                            //                             </div>
                            //                             <div className="truncate mr-2">
                            //                                 <p title={uploadVideo.file.name} className="text-sm font-semibold text-gray-800 sm:mr-4 truncate hover:text-blue-500">
                            //                                     {uploadVideo.file.name}
                            //                                 </p>
                            //                                 <p className="text-xs text-gray-500">
                            //                                     {(
                            //                                     uploadVideo.file.size /
                            //                                     1024 /
                            //                                     1024
                            //                                     ).toFixed(2)}{" "}
                            //                                     MB
                            //                                 </p>
                            //                             </div>
                            //                         </div>
                
                            //                         <div
                            //                             className={`${
                            //                             sender ? "pointer-events-none" : ""
                            //                             } items-center self-end sm:self-center flex sm:flex-col gap-x-2 gap-y-1`}
                            //                         >
                            //                             <div className="flex items-center justify-center gap-x-4 mx-2">
                            //                                 {/* Delete Button */}
                            //                                 <button
                            //                                     className="text-red-500 hover:text-red-700 font-bold"
                            //                                     onClick={() => {
                            //                                         setMaxDuration(0);
                            //                                         setTimeIssue(false);
                            //                                         setVideoLoadError(false);
                            //                                         setUploadVideo(null);
                            //                                         setStartTimeHours(null);
                            //                                         setStartTimeMinutes(null);
                            //                                         setStartTimeSeconds(null);
                            //                                         setEndTimeHours(null);
                            //                                         setEndTimeMinutes(null);
                            //                                         setEndTimeSeconds(null);
                            //                                         setNotesName('');
                            //                                     }}
                            //                                 >
                            //                                     <img src={DeleteImage} className="w-[25px] mr-1" alt="Delete" />
                            //                                 </button>
                            //                             </div>
                            //                         </div>
                            //                     </div>
                            //                 </div>
                            //                 :
                            //                 <div className="relative hover:scale-105 active:scale-90 cursor-pointer flex flex-col bg-[#F3F5FD] justify-center items-center border-[1px] border-[#367CFF] px-8 pt-2 pb-0 rounded-3xl transition duration-300 ease-in-out w-full">
                            //                     <div className="flex gap-2 justify-center items-center p-2 mb-2 ">
                            //                         <img
                            //                             src={upload}
                            //                             height={"30px"}
                            //                             width={"33px"}
                            //                         />
                            //                         <p
                            //                             className="text-sm text-center"
                            //                             style={{ color: "#6B6C70" }}
                            //                         >
                            //                         {"Click to Upload Video"}
                            //                         </p>
                            //                     </div>
                            //                     <input
                            //                         className="opacity-0 cursor-pointer absolute inset-0"
                            //                         type="file"
                            //                         accept="video/*"
                            //                         onChange={handleFileChange}
                            //                         disabled={sender}
                            //                     />
                            //                 </div>}
                            //             </div>
                            //             {uploadVideo ? 
                            //             <div className="flex flex-col gap-y-4">
                            //              {/* Start Time */}
                            //              <div className="flex flex-col w-full">
                            //                <p className="text-md font-semibold ml-4">Start Time:</p>
                            //                <div className="flex items-center gap-x-4">
                            //                  {/* HH Input */}
                            //                  <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                    <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                            //                    <input
                            //                      type="number"
                            //                      max="99"
                            //                      min="0"
                            //                      value={padTimeValue(startTimeHours)}
                            //                      placeholder="HH"
                            //                      className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                      onChange={(e) => handleInputChange(setStartTimeHours, parseInt(e.target.value), Math.floor(maxDuration / 3600))}
                            //                    />
                            //                  </div>
                                 
                            //                  {/* MM Input */}
                            //                  <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                    <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                            //                    <input
                            //                      type="number"
                            //                      max="59"
                            //                      min="0"
                            //                      value={padTimeValue(startTimeMinutes)}
                            //                      placeholder="MM"
                            //                      className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                      onChange={(e) => handleInputChange(setStartTimeMinutes, parseInt(e.target.value), 59)}
                            //                    />
                            //                  </div>
                                 
                            //                  {/* SS Input */}
                            //                  <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                    <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                            //                    <input
                            //                      type="number"
                            //                      max="59"
                            //                      min="0"
                            //                      value={padTimeValue(startTimeSeconds)}
                            //                      placeholder="SS"
                            //                      className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                      onChange={(e) => handleInputChange(setStartTimeSeconds, parseInt(e.target.value), 59)}
                            //                    />
                            //                  </div>
                            //                </div>
                            //              </div>
                                 
                            //              {/* End Time */}
                            //              <div className="flex flex-col w-full mb-2">
                            //                <p className="text-md font-semibold ml-4">End Time:</p>
                            //                <div className="flex items-center gap-x-4">
                            //                  {/* HH Input */}
                            //                  <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                    <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                            //                    <input
                            //                      type="number"
                            //                      max="99"
                            //                      min="0"
                            //                      value={padTimeValue(endTimeHours)}
                            //                      placeholder="HH"
                            //                      className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                      onChange={(e) => handleInputChange(setEndTimeHours, parseInt(e.target.value), Math.floor(maxDuration / 3600))}
                            //                    />
                            //                  </div>
                                 
                            //                  {/* MM Input */}
                            //                  <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                    <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                            //                    <input
                            //                      type="number"
                            //                      max="59"
                            //                      min="0"
                            //                      value={padTimeValue(endTimeMinutes)}
                            //                      placeholder="MM"
                            //                      className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                      onChange={(e) => handleInputChange(setEndTimeMinutes, parseInt(e.target.value), 59)}
                            //                    />
                            //                  </div>
                                 
                            //                  {/* SS Input */}
                            //                  <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                    <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                            //                    <input
                            //                      type="number"
                            //                      max="59"
                            //                      min="0"
                            //                      value={padTimeValue(endTimeSeconds)}
                            //                      placeholder="SS"
                            //                      className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                      onChange={(e) => handleInputChange(setEndTimeSeconds, parseInt(e.target.value), 59)}
                            //                    />
                            //                  </div>
                            //                </div>
                            //              </div>
                            //             </div> : null}
                            //         </div>
                            //         {uploadVideo ?
                            //         timeIssue ? <div className="justify-center text-xl flex-1 h-full font-semibold mt-32 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Time range incorrect!</div> : 
                            //         videoLoadError ? <div className="justify-center text-xl flex-1 h-full font-semibold mt-32 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Video rendering error!</div> :
                            //         <div className="flex flex-col items-center mt-4 w-1/2 gap-y-2">
                            //             <div className="rounded-[20px] overflow-hidden">
                            //                 <ReactPlayer
                            //                     ref={playerRef}
                            //                     url={URL.createObjectURL(uploadVideo.file)} 
                            //                     width={400}
                            //                     height={225}
                            //                     playing={isPlaying}
                            //                     controls={true}
                            //                     onError={() => setVideoLoadError(true)}
                            //                     onProgress={handleProgress}
                            //                     onDuration={handleDuration}
                            //                     config={{
                            //                         file: {
                            //                             attributes: {
                            //                                 controlsList: 'nodownload',
                            //                             },
                            //                         },
                            //                     }}
                            //                 />
                            //             </div>
                            //         </div> : <div className="justify-center text-xl flex-1 font-semibold mt-5 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Provide a video!</div>}
                            //     </div>
                            //     <div className="flex items-center self-start justify-start gap-x-4 mt-2 px-4">
                            //         <button disabled={sender || timeIssue || videoLoadError || !uploadVideo || !notesName} className={`${(sender || timeIssue || videoLoadError || !uploadVideo || !notesName) ? 'bg-gray-400 not-allowed' : ''} shadow-md flex items-center gap-x-2 custom-btn px-5 border border-white text-2xl py-2 rounded-[30px]`}>
                            //             <FaPlus className="text-xl" /> Create
                            //         </button>
                            //         <div className="flex gap-x-4 items-center justify-center">
                            //             <ToggleButton 
                            //                 id="tipSheet"
                            //                 defaultChecked={isTipSheet}
                            //                 onChange={() => setIsTipSheet(!isTipSheet)}
                            //             />
                            //             <p className="font-semibold w-[150px]">{isTipSheet ? "Tips Sheet" : "Notes"}</p>
                            //         </div>
                            //     </div>
                            // </div>
                            <div className="flex h-full text-3xl font-semibold justify-center items-center">
                                Coming Soon...
                            </div>
                        }
                        {activeTab === "txt" && 
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Generate Notes</p>
                                <div className="w-full flex items-start justify-center gap-x-[40px] px-4 pt-3">
                                    <div className="flex flex-col w-1/2 gap-y-4">
                                        <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                                            <GrNotes className="text-customBlue mr-2 text-2xl" />
                                            <input 
                                                className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                                id="notesName"
                                                placeholder={"Enter Notes Name"}
                                                value={notesName}
                                                maxLength={40}
                                                disabled={sender}
                                                onChange={(e) => setNotesName(e.target.value)}
                                            />
                                        </div>
                                        <div className="h-[65px] w-full">
                                            {uploadTxt ? 
                                            <div
                                                className="p-1 px-2 rounded-3xl border-2 hover:shadow-md h-[75px] items-center flex hover:border-blue-500 hover:border-2"
                                                style={{ borderColor: "#94ABFF" }}
                                            >
                                                <div className="flex flex-col w-full sm:flex-row gap-y-4">
                                                    <div
                                                        className="cursor-pointer flex-1 truncate flex items-center"
                                                        onClick={() => {
                                                            const fileURL = URL.createObjectURL(
                                                                uploadTxt.file
                                                            );
                                                            window.open(fileURL, "_blank");
                                                        }}
                                                    >
                                                        <div className="p-2 rounded-full text-white mx-2">
                                                            <img src={txtFile} width="20px" className="min-w-[45px] drop-shadow" size={20} />
                                                        </div>
                                                        <div className="truncate mr-2">
                                                            <p title={uploadTxt.file.name} className="text-sm font-semibold text-gray-800 sm:mr-4 truncate hover:text-blue-500">
                                                                {uploadTxt.file.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {(
                                                                uploadTxt.file.size /
                                                                1024 /
                                                                1024
                                                                ).toFixed(2)}{" "}
                                                                MB
                                                            </p>
                                                        </div>
                                                    </div>
                
                                                    <div
                                                        className={`${
                                                        sender ? "pointer-events-none" : ""
                                                        } items-center self-end sm:self-center flex sm:flex-col gap-x-2 gap-y-1`}
                                                    >
                                                        <div className="flex items-center justify-center gap-x-4 mx-2">
                                                            {/* Delete Button */}
                                                            <button
                                                                className="text-red-500 hover:text-red-700 font-bold"
                                                                onClick={() => {
                                                                    setUploadTxt(null);
                                                                    setNotesName('');
                                                                    setPages('');
                                                                }}
                                                            >
                                                                <img src={DeleteImage} className="w-[25px] mr-1" alt="Delete" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="relative hover:scale-105 active:scale-90 cursor-pointer flex flex-col bg-[#F3F5FD] justify-center items-center border-[1px] border-[#367CFF] px-8 pt-2 pb-0 rounded-3xl transition duration-300 ease-in-out w-full">
                                                <div className="flex gap-2 justify-center items-center p-2 mb-2 ">
                                                    <img
                                                        src={upload}
                                                        height={"30px"}
                                                        width={"33px"}
                                                    />
                                                    <p
                                                        className="text-sm text-center"
                                                        style={{ color: "#6B6C70" }}
                                                    >
                                                    {"Click to Upload Txt"}
                                                    </p>
                                                </div>
                                                <input
                                                    className="opacity-0 cursor-pointer absolute inset-0"
                                                    type="file"
                                                    accept="text/plain"
                                                    onChange={handleFileChange}
                                                    disabled={sender}
                                                />
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center self-start justify-start gap-x-4 mt-2 px-4">
                                    <button disabled={sender || !uploadTxt || !notesName} className={`${(sender || !uploadTxt || !notesName) ? 'bg-gray-400 not-allowed' : ''} shadow-md flex items-center gap-x-2 custom-btn px-5 border border-white text-2xl py-2 rounded-[30px]`} onClick={handleSubmit}>
                                        <FaPlus className="text-xl" /> Create
                                    </button>
                                    <div className="flex gap-x-4 items-center justify-center">
                                        <ToggleButton 
                                            id="tipSheet"
                                            defaultChecked={isTipSheet}
                                            onChange={() => setIsTipSheet(!isTipSheet)}
                                        />
                                        <p className="font-semibold w-[150px]">{isTipSheet ? "Tips Sheet" : "Notes"}</p>
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === "audio" && 
                            // <div className="flex flex-col items-center justify-center">
                            //     <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Generate Notes</p>
                            //     <div className="w-full flex items-start justify-between gap-x-[40px] px-4 pt-3">
                            //         <div className="flex flex-col w-1/2 gap-y-4">
                            //             <div className="flex bg-[#F3F5FD] items-center w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                 <GrNotes className="text-customBlue mr-2 text-2xl" />
                            //                 <input 
                            //                     className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                     id="notesName"
                            //                     placeholder={"Enter Notes Name"}
                            //                     value={notesName}
                            //                     maxLength={40}
                            //                     disabled={sender}
                            //                     onChange={(e) => setNotesName(e.target.value)}
                            //                 />
                            //             </div>
                            //             <div className="h-[65px] w-full">
                            //                 {uploadAudio ? 
                            //                 <div
                            //                     className="p-1 px-2 rounded-3xl border-2 hover:shadow-md h-[75px] items-center flex hover:border-blue-500 hover:border-2"
                            //                     style={{ borderColor: "#94ABFF" }}
                            //                 >
                            //                     <div className="flex flex-col w-full sm:flex-row gap-y-4">
                            //                         <div
                            //                             className="cursor-pointer flex-1 truncate flex items-center"
                            //                             onClick={() => {
                            //                                 const fileURL = URL.createObjectURL(
                            //                                     uploadAudio.file
                            //                                 );
                            //                                 window.open(fileURL, "_blank");
                            //                             }}
                            //                         >
                            //                             <div className="p-2 rounded-full text-white mx-2">
                            //                                 <img src={media} width="20px" className="min-w-[45px] drop-shadow" size={20} />
                            //                             </div>
                            //                             <div className="truncate mr-2">
                            //                                 <p title={uploadAudio.file.name} className="text-sm font-semibold text-gray-800 sm:mr-4 truncate hover:text-blue-500">
                            //                                     {uploadAudio.file.name}
                            //                                 </p>
                            //                                 <p className="text-xs text-gray-500">
                            //                                     {(
                            //                                     uploadAudio.file.size /
                            //                                     1024 /
                            //                                     1024
                            //                                     ).toFixed(2)}{" "}
                            //                                     MB
                            //                                 </p>
                            //                             </div>
                            //                         </div>
                
                            //                         <div
                            //                             className={`${
                            //                             sender ? "pointer-events-none" : ""
                            //                             } items-center self-end sm:self-center flex sm:flex-col gap-x-2 gap-y-1`}
                            //                         >
                            //                             <div className="flex items-center justify-center gap-x-4 mx-2">
                            //                                 {/* Delete Button */}
                            //                                 <button
                            //                                     className="text-red-500 hover:text-red-700 font-bold"
                            //                                     onClick={() => {
                            //                                         setMaxDuration(0);
                            //                                         setTimeIssue(false);
                            //                                         // setVideoLoadError(false);
                            //                                         setUploadAudio(null);
                            //                                         setStartTimeHours(null);
                            //                                         setStartTimeMinutes(null);
                            //                                         setStartTimeSeconds(null);
                            //                                         setEndTimeHours(null);
                            //                                         setEndTimeMinutes(null);
                            //                                         setEndTimeSeconds(null);
                            //                                         setNotesName('');
                            //                                     }}
                            //                                 >
                            //                                     <img src={DeleteImage} className="w-[25px] mr-1" alt="Delete" />
                            //                                 </button>
                            //                             </div>
                            //                         </div>
                            //                     </div>
                            //                 </div>
                            //                 :
                            //                 <div className="relative hover:scale-105 active:scale-90 cursor-pointer flex flex-col bg-[#F3F5FD] justify-center items-center border-[1px] border-[#367CFF] px-8 pt-2 pb-0 rounded-3xl transition duration-300 ease-in-out w-full">
                            //                     <div className="flex gap-2 justify-center items-center p-2 mb-2 ">
                            //                         <img
                            //                             src={upload}
                            //                             height={"30px"}
                            //                             width={"33px"}
                            //                         />
                            //                         <p
                            //                             className="text-sm text-center"
                            //                             style={{ color: "#6B6C70" }}
                            //                         >
                            //                         {"Click to Upload Audio"}
                            //                         </p>
                            //                     </div>
                            //                     <input
                            //                         className="opacity-0 cursor-pointer absolute inset-0"
                            //                         type="file"
                            //                         accept="audio/*"
                            //                         onChange={handleFileChange}
                            //                         disabled={sender}
                            //                     />
                            //                 </div>}
                            //             </div>
                            //             {uploadAudio ? 
                            //             <div className="flex flex-col gap-y-4">
                            //             {/* Start Time */}
                            //             <div className="flex flex-col w-full">
                            //             <p className="text-md font-semibold ml-4">Start Time:</p>
                            //             <div className="flex items-center gap-x-4">
                            //                 {/* HH Input */}
                            //                 <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                 <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                            //                 <input
                            //                     type="number"
                            //                     max="99"
                            //                     min="0"
                            //                     value={padTimeValue(startTimeHours)}
                            //                     placeholder="HH"
                            //                     className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                     onChange={(e) => handleInputChange(setStartTimeHours, parseInt(e.target.value), Math.floor(maxDuration / 3600))}
                            //                 />
                            //                 </div>
                                
                            //                 {/* MM Input */}
                            //                 <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                 <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                            //                 <input
                            //                     type="number"
                            //                     max="59"
                            //                     min="0"
                            //                     value={padTimeValue(startTimeMinutes)}
                            //                     placeholder="MM"
                            //                     className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                     onChange={(e) => handleInputChange(setStartTimeMinutes, parseInt(e.target.value), 59)}
                            //                 />
                            //                 </div>
                                
                            //                 {/* SS Input */}
                            //                 <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                 <MdOutlineAccessTime className="text-customBlue mr-2 text-2xl" />
                            //                 <input
                            //                     type="number"
                            //                     max="59"
                            //                     min="0"
                            //                     value={padTimeValue(startTimeSeconds)}
                            //                     placeholder="SS"
                            //                     className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                     onChange={(e) => handleInputChange(setStartTimeSeconds, parseInt(e.target.value), 59)}
                            //                 />
                            //                 </div>
                            //             </div>
                            //             </div>
                                
                            //             {/* End Time */}
                            //             <div className="flex flex-col w-full mb-2">
                            //             <p className="text-md font-semibold ml-4">End Time:</p>
                            //             <div className="flex items-center gap-x-4">
                            //                 {/* HH Input */}
                            //                 <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                 <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                            //                 <input
                            //                     type="number"
                            //                     max="99"
                            //                     min="0"
                            //                     value={padTimeValue(endTimeHours)}
                            //                     placeholder="HH"
                            //                     className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                     onChange={(e) => handleInputChange(setEndTimeHours, parseInt(e.target.value), Math.floor(maxDuration / 3600))}
                            //                 />
                            //                 </div>
                                
                            //                 {/* MM Input */}
                            //                 <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                 <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                            //                 <input
                            //                     type="number"
                            //                     max="59"
                            //                     min="0"
                            //                     value={padTimeValue(endTimeMinutes)}
                            //                     placeholder="MM"
                            //                     className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                     onChange={(e) => handleInputChange(setEndTimeMinutes, parseInt(e.target.value), 59)}
                            //                 />
                            //                 </div>
                                
                            //                 {/* SS Input */}
                            //                 <div className="flex bg-[#F3F5FD] items-center border-1 border-customBlue rounded-3xl p-1 px-4">
                            //                 <MdOutlineAccessTimeFilled className="text-customBlue mr-2 text-2xl" />
                            //                 <input
                            //                     type="number"
                            //                     max="59"
                            //                     min="0"
                            //                     value={padTimeValue(endTimeSeconds)}
                            //                     placeholder="SS"
                            //                     className="form-control bg-[#F3F5FD] w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            //                     onChange={(e) => handleInputChange(setEndTimeSeconds, parseInt(e.target.value), 59)}
                            //                 />
                            //                 </div>
                            //             </div>
                            //             </div>
                            //             </div> : null}
                            //         </div>
                            //         {uploadAudio ?
                            //         timeIssue ? <div className="justify-center text-xl flex-1 h-full font-semibold flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Time range incorrect!</div> : 
                            //         videoLoadError ? <div className="justify-center text-xl flex-1 h-full font-semibold flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Video rendering error!</div> :
                            //         <div className="flex flex-col items-center w-1/2 gap-y-2">
                            //             <div className="rounded-[20px] overflow-hidden">
                            //                 <ReactPlayer
                            //                     ref={playerRef}
                            //                     url={URL.createObjectURL(uploadAudio.file)} 
                            //                     width={400}
                            //                     height={225}
                            //                     playing={isPlaying}
                            //                     controls={true}
                            //                     // onError={() => setVideoLoadError(true)}
                            //                     onProgress={handleProgress}
                            //                     onDuration={handleDuration}
                            //                     config={{
                            //                         file: {
                            //                             attributes: {
                            //                                 controlsList: 'nodownload',
                            //                             },
                            //                         },
                            //                     }}
                            //                 />
                            //             </div>
                            //         </div> : <div className="justify-center text-xl flex-1 font-semibold mt-5 flex items-center gap-x-4"><FaInfoCircle className="text-3xl" /> Provide an audio!</div>}
                            //     </div>
                            //     <div className="flex items-center self-start justify-start gap-x-4 mt-2 px-4">
                            //         <button onClick={handleSubmit} disabled={sender || timeIssue || videoLoadError || !uploadAudio || !notesName} className={`${(sender || timeIssue || videoLoadError || !uploadAudio || !notesName) ? 'bg-gray-400 not-allowed' : ''} shadow-md flex items-center gap-x-2 custom-btn px-5 border border-white text-2xl py-2 rounded-[30px]`}>
                            //             <FaPlus className="text-xl" /> Create
                            //         </button>
                            //         <div className="flex gap-x-4 items-center justify-center">
                            //             <ToggleButton 
                            //                 id="tipSheet"
                            //                 defaultChecked={isTipSheet}
                            //                 onChange={() => setIsTipSheet(!isTipSheet)}
                            //             />
                            //             <p className="font-semibold w-[150px]">{isTipSheet ? "Tips Sheet" : "Notes"}</p>
                            //         </div>
                            //     </div>
                            // </div>
                            <div className="flex h-full text-3xl font-semibold justify-center items-center">
                                Coming Soon...
                            </div>
                        }
                    </>
                )}
            </div>

            {/* Notes List */}
            <div className="mt-4 border flex shadow w-9/12 mx-auto rounded-[30px] px-4 py-3 min-h-[300px] mb-5">
                <div className="flex flex-1 flex-col justify-start items-center overflow-hidden">
                    <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Notes</p>
                    <div className="flex mb-4 mt-2 justify-center items-center w-10/12 mx-auto gap-x-4 relative">
                        <div className="search relative hover:shadow-xl w-full mx-auto bg-[#F5F5F5] flex items-center h-[50px] px-4 rounded-[15px]">
                            <span className="vr my-2" />
                            <input 
                                className="py-[10px] px-3 w-full bg-transparent outline-b-none border-gray-300 focus:outline-none outline-none grow px-2" 
                                onChange={(e) => setSearchNotes(e.target.value)} 
                                placeholder="Search Notes"
                                maxLength={50}
                                value={searchNotes} 
                                disabled={sender}
                            />
                            <FaSearch className="absolute right-3 text-[25px] top-1/2 transform -translate-y-1/2 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2 mb-4 flex flex-col w-full items-center">
                        {notesLoading ? <Loader text="Loading..." /> :
                            notes?.length === 0 ? <p className="font-semibold">No Notes Found!</p> :
                            notes?.map((note, i) => (
                                <div key={i} className="flex px-2 duration-100 items-center hover:bg-blue-400 hover:text-white py-2 hover:scale-105 active:scale-100 cursor-pointer text-3xl border-b-2 w-9/12 border-blue-400 justify-between">
                                    <div className="flex w-11/12">
                                        <p className="truncate">{note.name}</p>
                                    </div>
                                    <FaRegEye onClick={() => navigate(`/${sessionStorage.getItem('role')}/notes/${note.notesId}`)}/>                                
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex flex-1 flex-col justify-start items-center overflow-hidden">
                    <p className="text-center font-semibold text-3xl py-2 flex items-center gap-x-2"><IoCreate /> Tips Sheet</p>
                    <div className="flex mb-4 mt-2 justify-center items-center w-10/12 mx-auto gap-x-4 relative">
                        <div className="search relative hover:shadow-xl w-full mx-auto bg-[#F5F5F5] flex items-center h-[50px] px-4 rounded-[15px]">
                            <span className="vr my-2" />
                            <input 
                                className="py-[10px] px-3 w-full bg-transparent outline-b-none border-gray-300 focus:outline-none outline-none grow px-2" 
                                onChange={(e) => setSearchTipsheet(e.target.value)} 
                                placeholder="Search Tips Sheet"
                                maxLength={50}
                                value={searchTipsheet} 
                                disabled={sender}
                            />
                            <FaSearch className="absolute right-3 text-[25px] top-1/2 transform -translate-y-1/2 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2 mb-4 flex flex-col w-full items-center">
                        {tipsheetLoading ? <Loader text="Loading..." /> :
                            tipsSheets?.length === 0 ? <p className="font-semibold">No Tips Sheet Found!</p> :
                            tipsSheets?.map((note, i) => (
                                <div key={i} className="flex px-2 duration-100 items-center hover:bg-blue-400 hover:text-white py-2 hover:scale-105 active:scale-100 cursor-pointer text-3xl border-b-2 w-9/12 border-blue-400 justify-between">
                                    <div className="flex w-11/12">
                                        <p className="truncate">{note.name}</p>
                                    </div>
                                    <FaRegEye onClick={() => navigate(`/${sessionStorage.getItem('role')}/notes/${note.notesId}`)}/>                                
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notes;