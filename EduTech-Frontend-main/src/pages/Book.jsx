import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { getAPI, postAPIMedia, postAPI } from "../caller/axiosUrls";
import { IoIosArrowBack } from "react-icons/io";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Loader from "../components/Loader";
import Chapter from "../components/Chapter";
import NotFound from "../components/NotFound";
import Processing from "../components/Processing";
import Chatbot from "../components/Chatbot";
import { useTranslation } from "react-i18next";
import { PlanContext } from "../contexts/PlanContext";
import ToggleButton from "../components/ToggleButton";
import AddChapterImage from "../assets/AddChapters.png";
import ShareImage from "../assets/Share.png";
import DeleteImage from "../assets/Delete.png";
import upload from "../assets/CloudUpload.png";
import infoBlue from "../assets/Info.png";
import PdfImage from "../assets/PDF.png";
import { IoClose } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Private from "../components/Private";
 
const Book = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddPage, setShowAddPage] = useState(false);
  const [sender, setSender] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [uploadChapters, setUploadChapters] = useState([]);
  const [bookDetails, setBookDetails] = useState(null);
  const [allowed, setAllowed] = useState(true);
  const [editable, setEditable] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [chatbotLoaded, setChatbotLoaded] = useState(false);
  const [hasEmbeddings, setHasEmbeddings] = useState(false);
  const [showAll, setShowAll] = useState(false); // State for the chapters list
  const [error, setError] = useState(false);
 
  // New state to track which icon is hovered
  const [hoveredIndex, setHoveredIndex] = useState(null); // <-- Added
 
  const navigate = useNavigate();
  const { bid } = useParams();
  const { isDummy } = useContext(PlanContext);
 
  const handleShowAddPage = () => setShowAddPage(true);
  const handleClearChapter = () => setUploadChapters([]);
  const handleCloseAddPage = () => {
    setShowAddPage(false);
    setUploadChapters([]);
  };
 
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
 
    // Ensure that atleast one file is selected selected
    if (files.length === 0) {
      toast(t("yntpa1f"), {
        icon: "⚠️",
      });
      return;
    }
 
    const totalFiles = [...uploadChapters, ...files];
 
    // Ensure that no more than 10 files are selected
    if (totalFiles.length > (isDummy ? 2 : 10)) {
      toast(
        isDummy
          ? t('ycumt2faat')
          : t("ycumt1faat"),
        {
          icon: "⚠️",
        }
      );
      return;
    }
 
    // Check if all selected files are PDFs
    const isAllPDF = files.every((file) => file.type === "application/pdf");
    if (!isAllPDF) {
      toast(t("onlypdfsfilesareallowed"), {
        icon: "⚠️",
      });
      return;
    }
 
    // Check if total file size (including previous files) is less than 50 MB
    const totalSize = [...uploadChapters, ...files].reduce(
      (acc, file) => acc + file.size,
      0
    );

    var nameCheck = true;
    
    files.forEach(file => {
      if (file.name.length > 100) {
          nameCheck = false;
          return;
      }
    })

    if (nameCheck === false) {
      toast(t('fnsnbemt1c'), {
          icon: '⚠️'
      });
      return;
    }
 
    const maxSizeInBytes = 50 * 1024 * 1024; // 50 MB in bytes
 
    if (totalSize > maxSizeInBytes) {
      toast(t("tfsmblt5m"), {
        icon: "⚠️",
      });
      return;
    }
 
    const newFilesArr = files.map((file) => ({
      file: file,
      scan: false,
    }));
 
    // *** Append new files to the existing uploadChapters array ***
    setUploadChapters((prevChapters) => [...prevChapters, ...newFilesArr]);
  };
 
  const getBookInfo = async () => {
    setSender(true);
    try {
      const response = await getAPI(`/books/get-book?bookId=${bid}`);
      if (response.allow) {
        setAllowed(true);
        setBookDetails(response.book);
        setIsPrivate(response.book.private);
        setHasEmbeddings(response.book.embeddingLink ? true : false);
        if (sessionStorage.getItem("user-id") === response.book.user?._id)
          setEditable(true);
        else setEditable(false);
      }
    } catch (error) {
      toast.error(error.message);
      setError(true);
      setAllowed(false);
      setBookDetails(null);
      setEditable(false);
      setHasEmbeddings(false);
    } finally {
      setSender(false);
    }
  };
 
  const chatbotInit = async () => {
    setChatbotLoaded(false);
    try {
      const response = await postAPI(
        `/chatbot/initialiseChatBot?bookId=${bid}`
      );
      setChatbotLoaded(true);
      toast.success(t("cbis"));
    } catch (error) {
      setChatbotLoaded(false);
      toast.error(error.message);
    }
  };
 
  const getChapters = async () => {
    setLoading(true);
    try {
      const response = await getAPI(
        `/chapters/getallchapters?bookId=${bid}&search=${search}`
      );
      if (response.chapters.length === 0) {
        setHasEmbeddings(false);
      } else {
        if (hasEmbeddings) chatbotInit();
      }
      setChapters(response.chapters || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
 
  const addChapters = async (e) => {
    e.preventDefault();
 
    if (uploadChapters.length === 0) {
      toast(t("yntpa1f"), {
        icon: "⚠️",
      });
      return;
    }
 
    // Check if total file size is less than 50 MB
    const totalSize = uploadChapters.reduce(
      (acc, fileObj) => acc + fileObj.file.size,
      0
    );
    const maxSizeInBytes = 50 * 1024 * 1024; // 50 MB in bytes
 
    if (totalSize > maxSizeInBytes) {
      toast(t("tfsmblt5m"), {
        icon: "⚠️",
      });
      return;
    }
 
    if (sender) return;
    else setSender(true);
 
    try {
      const formData = new FormData();
 
      // Append each file and its ocr condition as a single object
      uploadChapters.forEach((fileObj) => {
        // Append the file
        formData.append("chapterFiles", fileObj.file);
        // Append the corresponding ocr condition
        formData.append(`ocrConditions`, fileObj.scan);
      });
 
      const response = await postAPIMedia(
        `/chapters/upload-chapters?bookId=${bid}`,
        formData
      );
      toast.success(response.message);
      handleCloseAddPage();
      setSearch("");
      setChatbotLoaded(false);
      setTimeout(() => {
        getChapters();
      }, 1000);
      await chatbotInit();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  };
 
  const deleteChapter = async (e, chapterId) => {
    e.preventDefault();
 
    if (sender) return;
    else setSender(true);
 
    setProcessing(true);
 
    try {
      await postAPI(
        `/chapters/delete-chapter?chapterId=${chapterId}`
      );
      toast.success(t("chapterdeletedsuccessfully"));
      setChatbotLoaded(false);
      setChapters([]);
      getChapters();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
      setProcessing(false);
    }
  };
 
  const togglePrivacy = async () => {
    setIsPrivate(!isPrivate);
 
    if (sender) return;
    else setSender(true);
 
    try {
      const response = await postAPI(
        `/books/toggle-book-privacy?bookId=${bid}`
      );
      toast.success(response.private ? t("ybinp") : t("ybinpub"));
      setBookDetails(null);
      getBookInfo();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
      // setProcessing(false);
    }
  };
 
  const deleteBook = async (e) => {
    e.preventDefault();
 
    if (sender) return;
    else setSender(true);
 
    setProcessing(true);
 
    try {
      const response = await postAPI(`/books/delete-book?bookId=${bid}`);
      toast.success(t("ybids"));
      navigate(-1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
      setProcessing(false);
    }
  };
 
  const handleShare = () => {
    navigator.clipboard.writeText(location.origin + `/share/book/${bid}`);
    toast.success(t("ctc"));
  };
 
  useEffect(() => {
    getBookInfo();
  }, [allowed]);
 
  useEffect(() => {
    if (hasEmbeddings) chatbotInit();
  }, [hasEmbeddings]);
 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (allowed) {
        getChapters();
      }
    }, 500);
 
    return () => clearTimeout(delayDebounceFn);
  }, [allowed, search]);
 
  return (
    <div className="flex flex-col gap-12 gap-y-2 justify-center items-center w-screen p-4 bg-white">
      {processing ? <Processing /> : null}
      {/* Upper Half */}
      <div className="flex w-11/12 items-center mb-4 gap-4">
        {/* 1st part of My Books section */}
        <div onClick={() => navigate(-1)} className="cursor-pointer hover:scale-110 active:scale-90 flex w-[300px] items-center gap-4">
          <button
            className="w-fit text-4xl"
          >
            <IoIosArrowBack />
          </button>
          <span className="text-3xl font-bold">{t('mybooks')}</span>
        </div>
 
        {/* 2nd part - Search Bar */}
        {!error ? 
        <div className="flex justify-center items-center w-full mx-auto gap-x-4 relative">
          <div className="search relative hover:shadow-xl w-full mx-auto bg-[#F5F5F5] flex items-center h-[50px] px-4 rounded-[15px]">
            <span className="vr my-2" />
            <input 
                className="py-[10px] px-3 w-full bg-transparent outline-b-none border-gray-300 focus:outline-none outline-none grow px-2" 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder={t('searchchapters')}
                maxLength={50}
                value={search} 
                disabled={sender || !bookDetails}
            />
            <FaSearch className="absolute right-3 text-[25px] top-1/2 transform -translate-y-1/2 text-blue-500" />
          </div>
        </div> : null}
      </div>
 
      {/* Lower Half */}
      <div className="flex w-screen gap-y-10 p-8 px-24 rounded-lg gap-x-8">
      {error ? <NotFound text={t('cannotfindbook')} /> 
        : allowed ? 
        !bookDetails ? (
          <Loader type={1} text="Fetching book..." />
        ) : (
          <>
            <div className="flex rounded-[30px] min-w-[280px] h-[250px] overflow-hidden">
              {/* Image Section */}
              <img
                src={bookDetails?.coverImage}
                alt="Book cover"
                className="h-full w-full object-cover"
              />
            </div>
 
            {/* Descriptions */}
            <div className="flex flex-col md:w-9/12">
              <div className="flex flex-col gap-y-4">
                {/* Book Title, Author, and Subject */}
                <div className="flex w-full flex-col ml-4 pl-2">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex justify-between w-full">
                      <p title={bookDetails.name} className="text-4xl my-auto max-w-[400px] font-semibold truncate">
                        {bookDetails.name}
                      </p>

                      {/* Toggle Button next to the book name */}
                      {editable ? (
                        <div
                          className={`${
                            sender ? "pointer-events-none" : ""
                          } mt-1 flex flex-col justify-start ml-4`}
                        >
                          <ToggleButton
                            id="private"
                            defaultChecked={isPrivate}
                            setIsPrivate={setIsPrivate}
                            onChange={togglePrivacy}
                          />

                          <label htmlFor="private" className="mx-auto">
                            {isPrivate ? t("private") : "Public"}
                          </label>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex gap-x-10 mt-2 mr-5 w-[600px] justify-end">
                      {/* Add Button */}
                      <div className="flex justify-end">
                        {editable ? (
                          <button
                            disabled={sender}
                            onClick={handleShowAddPage}
                            className={`${
                              sender ? "" : "hover:scale-110 active:scale-90"
                            } flex flex-col rounded justify-center items-center text-blue-700 mb-1`}
                          >
                            <img src={AddChapterImage} alt="Add File" />
                            <spam className="text-sm">{t('addchapters')}</spam>
                          </button>
                        ) : null}
                      </div>

                      {/* Share Button */}
                      {isPrivate ? null : (
                        <button
                          disabled={sender}
                          className={`${
                            sender ? "" : "hover:scale-110 active:scale-90"
                          } flex flex-col rounded justify-center items-center text-blue-700 mb-1`}
                          onClick={handleShare}
                        >
                          <img src={ShareImage} alt="Share Icon" className="aspect-square" />
                          <span className="text-sm">
                            {t('svl')}
                          </span>
                        </button>
                      )}

                      {/* Delete Button */}
                      {editable && (
                        <button
                        className={`${
                          sender ? "" : "hover:scale-110 active:scale-90"
                        } flex flex-col rounded justify-center items-center text-red-400 mb-1`}
                          disabled={sender}
                          variant="danger"
                          onClick={deleteBook}
                        >
                          <img
                            src={DeleteImage}
                            alt="Delete Icon"
                            className=""
                          />
                          <spam className="text-sm">{t("delete")}</spam>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-semibold mb-2">{t('by')} {bookDetails.user?.name}</p>
                  <p className="font-semibold">
                    <span className="font-semibold">{t("subject")} </span>
                    {bookDetails.subject?.subjectName.toUpperCase()}
                  </p>
                </div>

                {/* Main Description of the Book */}
                <div className="px-4 rounded-lg w-5/6 max-w-full overflow-hidden">
                  <p
                    className={`transition-all duration-300 ease-in-out w-full`}
                  >
                    <span className="break-words">
                      {bookDetails.description}
                    </span>
                  </p>
                </div>
              </div>
 
              {/* Add Chapter Model */}
              {showAddPage ? (
                <div className="fixed bg-black w-screen opacity-50 h-screen top-0 left-0 z-30"></div>
              ) : null}
              <Modal
                show={showAddPage}
                onHide={handleCloseAddPage}
                backdrop="static"
                size="lg"
                keyboard={false}
                className="z-40 overflow-hidden" // Adjust the width to 75% or any other value
                centered
                scrollable
              >
                <Modal.Header className="flex flex-col justify-center items-center text-center border-0">
                  <Modal.Title className="font-bold text-3xl mt-8 p-2">
                    {t("uploadchapters")}
                  </Modal.Title>
                  <p className="text-sm text-customBlue text-center">
                    {isDummy
                      ? t('ycuut2pf')
                      : t("youcanuploaduptopdffiles")}
                  </p>
                  <button disabled={sender} onClick={handleCloseAddPage} className="absolute right-10">
                      <IoClose className="text-[40px] cursor-pointer hover:rotate-180 hover:scale-125 active:scale-100 active:rotate-90" />
                  </button>
                </Modal.Header>
                <Modal.Body size="lg" className="mb-2">
                  <div className="flex flex-col h-[400px] w-11/12 mx-auto">
                    {sender ? (
                      <Loader type={1} text={t("pleasewait")} />
                    ) : (
                      <>
                        <div className="flex justify-center items-center w-[80%] mx-auto">
                          {/* Upload PDF Section */}
                          <div className="relative hover:scale-105 active:scale-90 cursor-pointer flex flex-col bg-[#F3F5FD] justify-center items-center border-[1px] border-[#367CFF] px-8 pt-2 pb-0 rounded-3xl transition duration-300 ease-in-out w-9/12">
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
                                {t("clicktouploadpdfs")}
                              </p>
                            </div>
                            {/* <p className="text-sm text-gray-500 mb-4 text-center">{isDummy ? "You can upload up to 2 PDF files." : t('youcanuploaduptopdffiles')}</p> */}
                            <input
                              className="opacity-0 cursor-pointer absolute inset-0"
                              type="file"
                              accept="application/pdf"
                              multiple
                              onChange={handleFileChange}
                              disabled={sender}
                            />
                          </div>
                        </div>
 
                        {/* Max limit alert */}
                        <div className="flex gap-1 items-center w-9/12 mt-2 justify-center ml-2">
                          <IoMdInformationCircleOutline className="text-2xl text-[#AD1519]" />
                          <p
                            className="text-sm font-semibold italic"
                            style={{ color: "#AD1519" }}
                          >
                            {t("maxtotalsizeshouldbe50mb")}
                          </p>
                        </div>
                        {uploadChapters.length > 0 && (
                          <div className="w-11/12 mx-auto my-8">
                            <ul className="flex flex-col gap-y-2">
                              {uploadChapters.map((fileObj, index) => (
                                <li
                                  key={index}
                                  className="p-1 px-2 rounded-3xl border-2 hover:shadow-xl h-[75px] items-center flex hover:border-blue-500 hover:border-2"
                                  style={{ borderColor: "#94ABFF" }}
                                >
                                  <div className="flex flex-col w-full sm:flex-row gap-y-4">
                                    <div
                                      className="cursor-pointer flex-1 truncate flex gap-x-3 items-center"
                                      onClick={() => {
                                        const fileURL = URL.createObjectURL(
                                          fileObj.file
                                        );
                                        window.open(fileURL, "_blank");
                                      }}
                                    >
                                      <div className="p-2 rounded-full text-white mx-2">
                                        <img src={PdfImage} className="min-w-[45px] drop-shadow" size={20} />
                                      </div>
                                      <div className="truncate mx-2">
                                        <p className="text-sm font-semibold text-gray-800 sm:mr-4 truncate hover:text-blue-500">
                                          {fileObj.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {(
                                            fileObj.file.size /
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
                                            // Remove the file from the list
                                            setUploadChapters((prevChapters) =>
                                              prevChapters.filter(
                                                (_, idx) => idx !== index
                                              )
                                            );
                                          }}
                                        >
                                          <img src={DeleteImage} className="w-[25px] mr-1" alt="Delete" />
                                        </button>
 
                                        <ToggleButton
                                          defaultChecked={fileObj.scan}
                                          onChange={() => {
                                            setUploadChapters((prevChapters) =>
                                              prevChapters.map((chapter, idx) =>
                                                idx === index
                                                  ? {
                                                      ...chapter,
                                                      scan: !chapter.scan,
                                                    }
                                                  : chapter
                                              )
                                            );
                                          }}
                                        />
 
                                        <div className="relative">
                                          {/* Image */}
                                          <img
                                            src={infoBlue}
                                            alt="Info Icon"
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                            }} // Size of the image
                                            className="cursor-pointer"
                                            onMouseEnter={() => setHoveredIndex(index)} // <-- Added: Set hovered index
                                            onMouseLeave={() => setHoveredIndex(null)} // <-- Added: Reset hovered index
                                          />
 
                                          {/* Content that appears on hover */}
                                          {hoveredIndex === index && (
                                            // Position the tooltip above the icon
                                            <div
                                              className="absolute left-1/2 bottom-full mb-2 p-2 bg-customBlue rounded-lg shadow-lg w-[30vh]  transform -translate-x-1/2"
                                              style={{ bottom: "110%" }}
                                            >
                                              <p className="text-xs text-white">
                                                <b>{t('itps')}</b><br/>
                                                {t('ctctsitpcht')}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pb-3 px-16 pt-0">
                  {/* Delete and Upload Button */}
                  <div className="flex gap-x-8 w-11/12 items-center justify-end">
                    {uploadChapters.length > 0 && !sender ? 
                    <button
                      className={`hover:scale-110 active:scale-90 ${
                        sender ? "disabled not-allowed" : ""
                      } flex flex-col items-center font-semibold justify-end mb-1 text-red`}
                      disabled={sender}
                      variant="danger"
                      onClick={handleClearChapter}
                    >
                      <img
                        src={DeleteImage}
                        alt="Delete Icon"
                        className="w-[22px]"
                      />
                      <span
                        className="text-sm"
                        style={{ color: "#AD1519" }}
                      >
                        {t('clearall')}
                      </span>
                    </button> : null}
                    {!sender ? <Button
                      onClick={addChapters}
                      disabled={sender || uploadChapters.length === 0}
                      className={`${
                        sender || uploadChapters.length === 0
                          ? "disabled"
                          : ""
                      } custom-button text-lg px-5 py-2 rounded-[15px]`}
                    >
                      {t("upload")}
                    </Button> : null}
                  </div>
                </Modal.Footer>
              </Modal>
 
              {/* IIIrd part for the chapters section */}
              <div className="flex gap-y-3 w-9/12 flex-col justify-center mx-4 mt-4">
                {loading ? (
                  <Loader type={2} />
                ) : chapters.length === 0 ? (
                  <NotFound text={t("nochapterfound")} />
                ) : (
                  <>
                    {chapters
                      .slice(0, showAll ? chapters.length : 1)
                      .map((chapter, index) => (
                        <Chapter
                          key={`chapter-${index}`}
                          editable={editable}
                          deleteChapter={deleteChapter}
                          sender={sender}
                          chapter={chapter}
                        />
                      ))}
                    {chapters.length > 1 && (
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-500 underline text-sm flex justify-end w-full"
                      >
                        {showAll ? "See less" : "See more"}
                      </button>
                    )}
                  </>
                )}
                {/* {plan === "trial" ? (
                  <>
                    <p className="mt-4 text-gray-400">{t("ycuut1ciab")}</p>
                    <p className="text-gray-400">
                      {t("formorechapters")}{" "}
                      <span
                        className="cursor-pointer underline"
                        onClick={() =>
                          (location.href = location.origin + "/home#contact")
                        }
                      >
                        {t("trypremium")}
                      </span>
                    </p>
                  </>
                ) : null} */}
              </div>
            </div>
          </>
        ) 
        : <Private text={t('tbip')} />}
      </div>
      {chatbotLoaded && !error ? <Chatbot bid={bid} /> : null}
    </div>
  );
};
export default Book;