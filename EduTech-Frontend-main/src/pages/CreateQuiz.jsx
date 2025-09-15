import React from "react";
import { useEffect, useState, useContext } from "react";
import Loader from "../components/Loader";
import { getAPI, postAPIMedia } from "../caller/axiosUrls";
import TypeAccordion from "../components/TypeAccordion";
import PdfImage from "../assets/PDF.png";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CgMathPlus } from "react-icons/cg";
import UploadIcon from "../components/UploadIcon";
import Select from "react-select";
import Physics from "../assets/Physics.png";
import Biology from "../assets/Biology.png";
import Computer from "../assets/Computer.png";
import Maths from "../assets/Maths.png";
import Processing from '../components/Processing';
import Blank from "../assets/Blank.jpg";
import { useTranslation } from "react-i18next";
import { MdOutlineMenuBook } from "react-icons/md";
import { MdBook } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import ContentAccordion from "../components/ContentAccordion";
import ToggleButton from "../components/ToggleButton";
import SuccessAnimation from "../components/SuccessAnimation";
import { IoClose } from "react-icons/io5";
import upload from "../assets/CloudUpload.png";
import DeleteImage from "../assets/Delete.png";
import { useNavigate } from "react-router-dom";
import { PlanContext } from '../contexts/PlanContext';
import infoBlue from "../assets/Info.png";

const CreateQuiz = () => {
  const { i18n, t } = useTranslation();
  const [showAddPage, setShowAddPage] = useState(false);
  const [showQuickPage, setShowQuickPage] = useState(false);
  const [sender, setSender] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(Blank);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [quizName, setQuizName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [quizDescription, setQuizDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [bookOptions, setBookOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [content, setContent] = useState([]);
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState([]);
  const [uploadChapters, setUploadChapters] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // <-- Add success state for animation
  // New state to track which icon is hovered
  const [hoveredIndex, setHoveredIndex] = useState(null); // <-- Added
  const language = i18n.language;
  const navigate = useNavigate();

  const { isDummy } = useContext(PlanContext);

  const listLang = {
    en: "english",
    ar: "arabic",
    pl: "polish",
    hi: "hindi",
  };
  
  const handleClearChapter = () => setUploadChapters([]);

  const handleShowAddPage = () => {
    setShowAddPage(true);
    getBooks();
  };

  const handleCloseAddPage = () => {
    setSelectedBook(null);
    setChapterOptions([]);
    setBookOptions([]);
    setSelectedChapters([]);
    setShowAddPage(false);
  };

  const handleShowQuickPage = () => {
    setShowQuickPage(true);
  };

  const handleCloseQuickPage = () => {
    setUploadChapters([]);
    setShowQuickPage(false);
  };

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

  const getTypes = async () => {
    setSender(true);
    try {
      const response = await getAPI(`/quiz/quiz-types`);
      setTypes(response.quizTypes || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  };

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
    setSender(true);
    if (selectedBook && selectedChapters.length > 0) {
      // Check if the book is already in the content array
      const existingBookIndex = content.findIndex(
        (existingContent) =>
          existingContent.book.id === selectedBook.value.bookId
      );

      if (existingBookIndex !== -1) {
        // Book already exists, add new chapters while preventing duplicates
        const updatedChapters = [
          ...content[existingBookIndex].chapters,
          ...selectedChapters.map((chapter) => ({
            id: chapter.value.chapterId,
            name: chapter.value.chapterName,
            url: chapter.value.chapterURL,
          })),
        ];

        // Remove duplicate chapters based on their id
        const uniqueChapters = updatedChapters.filter(
          (chapter, index, self) =>
            index === self.findIndex((c) => c.id === chapter.id)
        );

        // Update the content array with the new chapters for the existing book
        const updatedContent = [...content];
        updatedContent[existingBookIndex].chapters = uniqueChapters;

        setContent(updatedContent);
        toast.success(
          `${t("cast")} ${updatedContent[existingBookIndex].book.name}!`
        );
      } else {
        // Book doesn't exist, add it as new content
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
        setContent((prevContent) => [...prevContent, newContent]);
        toast.success(t("cas"));
      }

      handleCloseAddPage();
      setSender(false);
    } else {
      toast.error(t("psbabaaloc"));
      setSender(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizName || !selectedTemplate) {
      toast(t("arfanf"), {
        icon: "⚠️",
      });
      return;
    }

    if (content.length === 0) {
      toast(t("paaobaooic"), {
        icon: "⚠️",
      });
      return;
    }

    if (newType.length === 0) {
      toast(t("paaoqt"), {
        icon: "⚠️",
      });
      return;
    }

    for (const typeItr of newType) {
      if (typeItr.sum === 0) {
        toast(`${t("ppaloloqiqt")} ${typeItr.typeName}!`, {
          icon: "⚠️",
        });
        return;
      }
    }

    if (!quizName) {
      toast(t("qnir"), {
        icon: "⚠️",
      });
      return;
    }

    if (wordCount > 10) {
      toast(t("dsnbmt1w"), {
        icon: "⚠️",
      });
      return;
    }

    if (sender) return;
    else setSender(true);

    setProcessing(true);

    try {
      const formData = new FormData();

      // Append basic fields
      formData.append("quizName", quizName);
      formData.append("description", quizDescription);
      formData.append("private", isPrivate);
      // formData.append("subjectName", selectedSubject.label);

      // Add template image handling
      if (selectedTemplate !== uploadedImage) {
        const img = await fetch(selectedTemplate);
        const blob = await img.blob();
        formData.append("quizCoverImage", blob, `${quizName}.png`);
      } else {
        formData.append("quizCoverImage", uploadedImage);
      }

      // Add arrays and objects as JSON strings
      const chapterUrls = [
        ...new Set(
          content.flatMap((book) => book.chapters.map((chapter) => chapter.url))
        ),
      ];
      const bookIds = [...new Set(content.flatMap((book) => book.book.id))];

      formData.append("chapterList", JSON.stringify(chapterUrls));
      formData.append("bookList", JSON.stringify(bookIds));

      formData.append(
        "quizTypes",
        JSON.stringify(
          newType.map((type) => ({
            typeId: type.typeID,
            easyQuestionsCount: type.easy,
            mediumQuestionsCount: type.medium,
            hardQuestionsCount: type.hard,
          }))
        )
      );

      formData.append("language", listLang[language]);

      await postAPIMedia(`/quiz/generate-quiz`, formData);
      // Show the success animation
      setShowSuccessAnimation(true); // <-- Show animation on success
      setQuizName("");
      setQuizDescription("");
      setIsPrivate(false);
      setSelectedTemplate(Blank); // Reset template selection
      setNewType([]);
      setContent([]);

      // Set a timeout to hide animation after 3 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
        navigate(`/${sessionStorage.getItem('role')}/quiz`);
      }, 4000); // <-- Hide animation after 3 seconds
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
      setProcessing(false);
    }
  };

  const handleQuickQuiz = async (e) => {
    e.preventDefault();

    if (uploadChapters.length === 0) {
      toast(t("yntpa1f"), {
        icon: "⚠️",
      });
      return;
    }

    // Check if total file size is less than 50 MB
    const totalSize = uploadChapters.reduce((acc, file) => acc + file.size, 0);
    const maxSizeInBytes = 50 * 1024 * 1024; // 50 MB in bytes

    if (totalSize > maxSizeInBytes) {
      toast(t("tfsmblt5m"), {
        icon: "⚠️",
      });
      return;
    }

    if (sender) return;
    else setSender(true);

    setProcessing(true);

    try {
      const formData = new FormData();

      // Append each file and its ocr condition as a single object
      uploadChapters.forEach((fileObj) => {
        // Append the file
        formData.append("chapterFiles", fileObj.file);
        // Append the corresponding ocr condition
        formData.append(`ocrConditions`, fileObj.scan);
      });

      formData.append("language", listLang[language]);

      await postAPIMedia(`/quiz/quick-quiz`, formData);
      setShowSuccessAnimation(true);
      toast.success(t("qqc"));
      handleCloseQuickPage();

      setTimeout(() => {
        setShowSuccessAnimation(false);
        navigate(`/${sessionStorage.getItem('role')}/quiz`);
      }, 4000); // <-- Hide animation after 3 seconds
    } catch (error) {
      console.log(error.message);
      if (error.statusCode === 403) {
        toast.error(error.message);
      } else {
        toast(t('qwbas'));
        navigate(`/${sessionStorage.getItem('role')}/quiz`);
      }
    } finally {
      setSender(false);
      setProcessing(false);
    }
  };

  const handleDeleteContent = (bookId) => {
    setSender(true);
    setContent((prevContent) =>
      prevContent.filter((item) => item.book.id !== bookId)
    );
    toast.success(t("cds"));
    setSender(false);
  };

  const handleTypeChange = (updatedType) => {
    setNewType((prevTypes) =>
      prevTypes.map((type) =>
        type.typeID === updatedType.typeID ? updatedType : type
      )
    );
  };

  const handleDeleteType = (typeID) => {
    setSender(true);
    setNewType((prevTypes) =>
      prevTypes.filter((type) => type.typeID !== typeID)
    );
    toast.success(t("tds"));
    setSender(false);
  };

  const handleChapterSelect = (selectedOptions) => {
    setSelectedChapters(selectedOptions);
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setQuizDescription(description);
    const wordArray = description.trim().split(/\s+/);
    if (description === "") setWordCount(0);
    else setWordCount(wordArray.length);
  };

  const handleAddType = (type) => {
    setSender(true);

    if (newType.some((existingType) => existingType.typeID === type.typeID)) {
      toast(t("ttiaa"), {
        icon: "⚠️",
      });
      setSender(false);
      return;
    }

    const newTypeContent = {
      typeID: type.typeID,
      typeName: type.typeName,
      easy: 0,
      medium: 0,
      hard: 0,
      sum: 0,
    };

    setNewType((prevContent) => [...prevContent, newTypeContent]);

    toast.success(t("tas"));
    setSelectedType(null)
    setSender(false);
  };

  const handleImageChange = (file) => {
    const maxSizeMB = 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!file.type.startsWith("image/")) {
      toast(t("sfinai"), {
        icon: "⚠️",
      });
      return;
    }

    if (file.size > maxSizeBytes) {
      toast(`${t("sfilt")} ${maxSizeMB} MB.`, {
        icon: "⚠️",
      });
      return;
    }

    setUploadedImage(file);
    setSelectedTemplate(file);
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

  const bookTemplates = [
    {
      id: 1,
      image: Maths,
      alt: "Maths Book Template",
    },
    {
      id: 2,
      image: Biology,
      alt: "Biology Book Template",
    },
    {
      id: 3,
      image: Computer,
      alt: "Computer Book Template",
    },
    {
      id: 4,
      image: Physics,
      alt: "Physics Book Template",
    },
  ];

  useEffect(() => {
    getTypes();
  }, []);

  return (
    <div>
        {processing ? <Processing/> : null}
        <div
            className="relative min-h-screen bg-cover bg-bottom p-8 w-100vh"
            style={{
            backgroundImage: `url('/LoginPage/TeacherLogin.jpg')`,
            }}
        >
            {/* Centered form container */}
            <div className="flex items-center justify-center">
                {/* Form wrapper with shadow, padding, and rounded corners */}
        
                {/* Conditionally Render Success Animation */}
                {showSuccessAnimation ? (
                    <div className="flex w-8/12 h-[80vh] bg-white rounded-[30px] shadow-lg p-6 m-8">
                    <SuccessAnimation text={"Quiz created successfully!"}/>
                    </div>
                ) : (
                <div className="flex flex-col w-8/12 min-h-[560px] bg-white rounded-[30px] shadow-lg p-6 pb-12 m-8">
                {sender ? (
                    <div className="my-auto"><Loader type={1} text={t("pleasewait")} /></div>
                ) : 
                <>
                    {/* Back Button */}
                    <div className="flex ml-4">
                        <button
                        disabled={sender}
                        className={`${
                            sender ? "disabled" : ""
                        }w-fit hover:scale-110 active:scale-90 text-4xl`}
                        onClick={() => {
                            setQuizName("");
                            setQuizDescription("");
                            setSelectedTemplate(Blank);
                            navigate(-1);
                        }}
                        >
                        <IoIosArrowBack />
                        </button>
                    </div>
                    {/* Main Central White Screen */}
                    {/* Ist part Headings */}
                    <div className="flex flex-col gap-y-2 items-center text-black justify-center">
                        <p className="font-bold">{t('hlgs')}</p>
                        <p className="text-3xl font-bold">
                            {t('caq')}
                        </p>
                    </div>
                    {/* 2nd part Upload Templates section */}
                    <div className="flex mt-4">
                        {/* Part-1 Upload */}
                        <div className="flex flex-col gap-2">
                        {/* The Upload Template part */}
                        <div className="flex overflow-x-auto py-3 w-full justify-center">
                            {/* Upload Template Card */}
                            <div
                            onClick={() => setSelectedTemplate(uploadedImage)}
                            className={`${
                                selectedTemplate === uploadedImage
                                ? "border-4 border-green-400"
                                : "border-4 border-white"
                            } cursor-pointer ml-1 relative card-book flex-shrink-0 w-[240px] h-[200px] flex items-end justify-center rounded-[30px] overflow-hidden bg-[#DEE8F5]`}
                            >
                            {uploadedImage ? (
                                <>
                                <img
                                    className="w-full h-full rounded-2xl object-cover brightness-50 md:brightness-100 book object-center"
                                    src={
                                    uploadedImage
                                        ? URL.createObjectURL(uploadedImage)
                                        : Blank
                                    }
                                    alt="Uploaded Book Template"
                                />
                                <span className="absolute top-1/3 bg-white p-1 rounded shadow text-4xl">
                                    <CgMathPlus />
                                </span>
                                </>
                            ) : (
                                <div className="w-[180px] h-[180px] self-center rounded-2xl overflow-hidden">
                                <UploadIcon text={t('uploadcover')} />
                                </div>
                            )}
                            <label htmlFor="templateImage">
                                <input
                                type="file"
                                accept="image/*"
                                className="h-0 hidden"
                                id="templateImage"
                                onChange={(e) =>
                                    handleImageChange(e.target.files[0])
                                }
                                />
                                <div className="w-full absolute left-0 top-0 cursor-pointer h-full"></div>
                            </label>
                            </div>
                        </div>
        
                        {/* Part-2 : Render Book Templates */}
                        <div className="flex gap-x-2 p-2 overflow-hidden w-5/6 mx-auto">
                            <div className="flex gap-x-2 overflow-x-auto overflow-y-hidden rounded-xl no-scrollbar">
                            {bookTemplates.map((template) => (
                                <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.image)}
                                className={`${
                                    selectedTemplate === template.image
                                    ? "border-4 border-green-400"
                                    : ""
                                } cursor-pointer relative flex-shrink-0 w-[75px] h-[75px] flex items-end justify-center rounded-xl bg-gray-200`}
                                >
                                <img
                                    className="w-full h-full rounded-lg object-cover brightness-50 md:brightness-100 object-center"
                                    src={template.image}
                                    alt={template.alt}
                                />
                                </div>
                            ))}
                            </div>
                        </div>
                        </div>
        
                        {/* Input form main part */}
        
                        {/* Loading spinner or form content */}
                        <div className="flex flex-col w-7/12 p-4 gap-y-2">
                            {/* Quiz Name Input */}
                            <div className="flex items-center mt-2 w-full border-1 border-customBlue rounded-3xl p-1 px-4">
                            <MdOutlineMenuBook className="text-customBlue mr-2 text-2xl" />

                            <input
                                className="form-control w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                                id="quizName"
                                placeholder={t('eqn')}
                                value={quizName}
                                maxLength={40}
                                disabled={sender}
                                onChange={(e) => setQuizName(e.target.value)}
                            />
                            </div>

                            {/* Book Description Input */}

                            <div className="flex items-center w-full border-1 border-customBlue rounded-3xl p-2 px-4">
                                <FaRegEdit className="text-customBlue self-start mt-1 mr-2 text-2xl" />
                                <textarea
                                    className="form-control resize-none w-full rounded-3xl shadow-none focus:border-0 border-none outline-none"
                                    placeholder={t('eqd')}
                                    id="quizDescription"
                                    value={quizDescription}
                                    disabled={sender}
                                    maxLength={250}
                                    onChange={handleDescriptionChange}
                                />
                            </div>

                            {/* Add Content Button and Private Button */}
                            <div className="flex justify-between items-center">
                                <div className="grow flex justify-end items-center">
                                    <button
                                        disabled={sender}
                                        onClick={handleShowAddPage}
                                        className="custom-button px-5 mr-16"
                                    >
                                        {t('addcontent')}
                                    </button>
                                </div>
                                {/* Private Toggle */}
                                <div
                                    className={`${
                                        sender ? "pointer-events-none" : ""
                                    } flex gap-x-4 justify-end`}
                                >
                                    <div className="flex flex-col ">
                                        <ToggleButton
                                            id="private"
                                            defaultChecked={isPrivate}
                                            onChange={() => setIsPrivate(!isPrivate)}
                                        />
                                        <label htmlFor="private" className="text-sm text-center">{isPrivate ? t("private") : "Public"}</label>
                                    </div>
                                </div>
                            </div>

                            {/* show selected content */}
                            <div className="flex flex-col ">
                            {content.length > 0 && (
                                <ContentAccordion
                                sender={sender}
                                content={content}
                                onDelete={handleDeleteContent}
                                />
                            )}
                            </div>

                            {/* Quizz Types MCQ, NUMERICAL */}
                            <div className="flex items-center rounded-3xl border-1 border-customBlue p-1 px-4">
                            <MdBook className="text-customBlue mr-2 text-2xl" />
                            <div className="flex-1">
                                <Select
                                options={types.map((type) => ({
                                    label: type.typeName,
                                    value: type,
                                }))}
                                value={selectedType}
                                onChange={(selectedOption) => {
                                    setSelectedType(selectedOption); // Update selectedType state
                                    handleAddType(selectedOption.value);
                                }}
                                isSearchable
                                placeholder={t("selecttype")}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        border: "none", // Remove internal border since the container already has one
                                        boxShadow: "none",
                                        fontSize: "12px"
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
                                        width: "432px",
                                        top: "40px"
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

                            {/* Quizz Difficulty */}

                            {newType.length > 0 && (
                            <>
                                {/* <div className="flex items-center rounded-3xl border-1 border-customBlue px-4"> */}
                                {/* <MdBook className="text-customBlue mr-2 text-2xl" /> */}
                                <div className="flex-1 flex flex-col overflow-hidden">
                                <Accordion className="">
                                    {newType.length > 0 &&
                                    newType.map((type, index) => (
                                        <TypeAccordion
                                        key={type.typeID}
                                        index={index}
                                        type={type}
                                        sender={sender}
                                        onDelete={handleDeleteType}
                                        onTypeChange={handleTypeChange}
                                        />
                                    ))}
                                </Accordion>
                                </div>
                                {/* </div> */}
                            </>
                            )}

                            <div className="flex justify-center">
                            {/* Submit Buttons for custom and quizz creation */}
                            <div className="flex items-center mt-4 justify-center gap-4">
                                <div className="flex justify-center">
                                <button
                                    onClick={handleSubmit}
                                    disabled={sender}
                                    className="custom-button px-5"
                                >
                                    {t('cfq')}
                                </button>
                                </div>

                                <div className="flex justify-center">
                                <button
                                    onClick={handleShowQuickPage}
                                    disabled={sender}
                                    className="custom-button-white"
                                >
                                    {t('pfq')}
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </>}
                </div>
                )}
            </div>
        </div>
        {/* Add Content Modal */}
        {showAddPage ? (
            <div className="fixed bg-black w-screen opacity-50 h-screen top-0 left-0 z-30"></div>
        ) : null}
        <Modal
            id="createQuiz"
            show={showAddPage}
            onHide={handleCloseAddPage}
            backdrop="static"
            keyboard={false}
            className="z-40"
            size="lg"
            centered
            scrollable
        >
            <Modal.Body className="py-0 bg-white h-[400px]">
                <button onClick={handleCloseAddPage} className="absolute top-5 right-10">
                    <IoClose className="text-[40px] cursor-pointer hover:rotate-180 hover:scale-125 active:scale-100 active:rotate-90" />
                </button>
                <div className="flex-col h-[350px] w-11/12 py-5 px-4 flex mx-auto">
                    {sender ? (
                        <Loader type={1} text={t("pleasewait")} />
                    ) : (
                        <>
                            <div className="flex flex-col mb-4 gap-y-2">
                                <p className="font-semibold text-2xl">
                                    {t('selectbook')}
                                </p>
                                <div className="flex items-center bg-[#F3F5FD] rounded-3xl border-1 border-customBlue p-1 px-4 ">
                                    <MdBook className="text-customBlue mr-2 text-2xl" />
                                    <div className="flex-1">
                                        <Select
                                            disabled={sender}
                                            options={bookOptions}
                                            value={selectedBook}
                                            onChange={(selectedOption) =>
                                                handleBookSelect(selectedOption)
                                            }
                                            isSearchable
                                            placeholder={t('selectabook')}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    border: "none", // Remove internal border since the container already has one
                                                    boxShadow: "none",
                                                    backgroundColor: "#F3F5FD",
                                                    fontSize: "12px"
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
                                                    width: "656px",
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

                            {selectedBook ? (
                                <div className="gap-y-2 flex flex-col">
                                    <div className="flex">
                                        <p className="font-semibold text-2xl">
                                            {t('selectchapters')}
                                        </p>
                                    </div>
                                    <div className="flex items-center bg-[#F3F5FD] rounded-3xl border-1 border-customBlue p-1 px-4">
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
                                                        fontSize: "12px"
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
                                                        width: "656px",
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
                            ) : null}

                            {/* Add Button */}
                            {selectedChapters && selectedChapters.length > 0 && (
                                <div className="flex justify-center mt-16">
                                    <button
                                        onClick={handleContentAdd}
                                        disabled={sender}
                                        className={`${
                                            sender ? "disabled" : ""
                                        } custom-button px-20`}
                                    >
                                        {t("add")}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Modal.Body>
        </Modal>
        {/* Add Chapter Model */}
        {showQuickPage ? (
          <div className="fixed bg-black w-screen opacity-50 h-screen top-0 left-0 z-30"></div>
        ) : null}
        <Modal
          show={showQuickPage}
          onHide={handleCloseQuickPage}
          backdrop="static"
          size="lg"
          keyboard={false}
          className="z-30 overflow-hidden" // Adjust the width to 75% or any other value
          centered
          scrollable
        >
          <Modal.Header className="flex flex-col justify-center items-center text-center border-0">
            <Modal.Title className="font-bold text-3xl mt-8 p-2">
              {t('cqq')}
            </Modal.Title>
            <p className="text-sm text-customBlue text-center">
              {isDummy
                ? t('ycuut2pf')
                : t("youcanuploaduptopdffiles")}
            </p>
            <button disabled={sender} onClick={handleCloseQuickPage} className="absolute right-10">
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
                  <div className="flex gap-1 mx-auto items-center w-9/12 mt-2 justify-center">
                    <IoMdInformationCircleOutline className="text-2xl text-[#AD1519]" />
                    <p
                      className="text-sm font-semibold italic"
                      style={{ color: "#AD1519" }}
                    >
                      {t("maxtotalsizeshouldbe50mb")}
                    </p>
                  </div>
                  <div className="flex gap-1 mx-auto items-center w-9/12 justify-center">
                    <IoMdInformationCircleOutline className="text-2xl text-[#AD1519]" />
                    <p
                      className="text-sm font-semibold italic"
                      style={{ color: "#AD1519" }}
                    >
                      {t("only10mcqsand5descriptivewillbegenerated")}
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
                onClick={handleQuickQuiz}
                disabled={sender || uploadChapters.length === 0}
                className={`${
                  sender || uploadChapters.length === 0
                    ? "disabled"
                    : ""
                } custom-button text-lg px-5 py-2 rounded-[15px]`}
              >
                {t('generatequiz')}
              </Button> : null}
            </div>
          </Modal.Footer>
        </Modal>
    </div>
  );
}

export default CreateQuiz;