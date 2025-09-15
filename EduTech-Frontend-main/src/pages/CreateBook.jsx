import React from "react";
import { useEffect, useState, useContext } from "react";
import Loader from "../components/Loader";
import { getAPI, postAPIMedia } from "../caller/axiosUrls";
import { toast } from "react-hot-toast";
import { CgMathPlus } from "react-icons/cg";
import Maths from "../assets/Maths.png";
import Physics from "../assets/Physics.png";
import Biology from "../assets/Biology.png";
import Computer from "../assets/Computer.png";
import Blank from "../assets/Blank.jpg";
import CreatableSelect from "react-select/creatable";
import { useTranslation } from "react-i18next";
import { PlanContext } from "../contexts/PlanContext";
import { useNavigate } from "react-router-dom";
import SuccessAnimation from "../components/SuccessAnimation";
 
import { MdOutlineMenuBook } from "react-icons/md";
import { MdBook } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import ToggleButton from "../components/ToggleButton";
 
import UploadIcon from "../components/UploadIcon";
 
function CreateBook() {
  const { i18n, t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [bookName, setBookName] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(Blank);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [sender, setSender] = useState(false);
  const [subject, setSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { iid } = useContext(PlanContext);
  const navigate = useNavigate();
 
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // <-- Add success state for animation
 
  const formatSubjectsForDropdown = (subjects) => {
    return subjects.map((subject) => ({
      label: subject.subjectName,
      value: subject,
    }));
  };
 
  const getSubjects = async () => {
    setSelectedSubject(null);
    setSubject([]);
    setSender(true);
    try {
      const response = await getAPI("/subject/get-subjects");
      const formattedOptions = [
        {
          options: formatSubjectsForDropdown(response.subjects),
        },
      ];
      setSubject(formattedOptions);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
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
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!bookName || !selectedTemplate || !selectedSubject?.label) {
      toast(t("arfanf"), {
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
 
    try {
      const formData = new FormData();
 
      formData.append("name", bookName);
      formData.append("description", bookDescription);
      formData.append("private", isPrivate);
      formData.append("subjectName", selectedSubject.label);
 
      if (selectedTemplate !== uploadedImage) {
        const img = await fetch(selectedTemplate);
        if (!img.ok) {
          toast.error(t('ctspw'));
          return;
        }
        const blob = await img.blob();
        formData.append("coverImage", blob, bookName + ".png");
      } else {
        formData.append("coverImage", uploadedImage);
      }
      
      await postAPIMedia(`/books/add-book`, formData);
      // Show the success animation
      setShowSuccessAnimation(true); // <-- Show animation on success
      setBookName("");
      setBookDescription("");
      setSelectedTemplate(Blank);
      setIsPrivate(false);
 
      // Set a timeout to hide animation after 3 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
        navigate(`/${sessionStorage.getItem('role')}/books`);
      }, 4000); // <-- Hide animation after 3 seconds
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  };
 
  const handleFileChange = (file) => {
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
 
  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setBookDescription(description);
    const wordArray = description.trim().split(/\s+/);
    if (description === "") setWordCount(0);
    else setWordCount(wordArray.length);
  };
 
  const handleSubjectChange = (newValue) => {
    setSelectedSubject(newValue);
  };
 
  const handleSubjectCreate = async (inputValue) => {
    try {
      const newSubject = {
        label: inputValue,
        value: { subjectName: inputValue },
      };
      setSubject((prev) => [...prev, newSubject]);
      setSelectedSubject(newSubject);
    } catch (error) {
      toast.error(t("ftcns"));
    }
  };
 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (iid) {
        // getBooks();
        getSubjects();
      }
    }, 500);
 
    return () => clearTimeout(delayDebounceFn);
  }, [iid]);
 
  return (
    <div>
      <div
        className="relative min-h-screen bg-cover bg-center p-8 w-100vh"
        style={{
          backgroundImage: `url('/CreateBook.jpg')`,
        }}
      >
        {/* Centered form container */}
        <div className="flex items-center justify-center">
          {/* Form wrapper with shadow, padding, and rounded corners */}
 
          {/* Conditionally Render Success Animation */}
          {showSuccessAnimation ? (
            <div className="flex w-8/12 h-[80vh] bg-white rounded-[30px] shadow-lg p-6 m-8">
              <SuccessAnimation text = {t('bcs')}/>
            </div>
          ) : (
            <div className="flex flex-col w-8/12 h-[560px] bg-white rounded-[30px] shadow-lg p-6 pb-12 m-8">
            {sender ? (
              <Loader type={1} text={t("pleasewait")} />
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
                    setBookName("");
                    setBookDescription("");
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
                  {t('aabtya')}
                </p>
              </div>
              {/* 2nd part Upload Templates section */}
              <div className="flex gap-4 mt-4">
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
                            handleFileChange(e.target.files[0])
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
                      <>
                        {/* Book Name Input */}
                        <div className="flex items-center mt-2 w-full border-1 border-customBlue rounded-3xl p-2 px-4">
                          <MdOutlineMenuBook className="text-customBlue mr-2 text-2xl" />
                          <input
                            className="form-control w-full rounded-3xl border-none shadow-none focus:border-0 outline-none"
                            id="bookName"
                            disabled={sender}
                            value={bookName}
                            maxLength={40}
                            placeholder={t('enterbookname')}
                            onChange={(e) => setBookName(e.target.value)}
                          />
                        </div>
    
                        {/* Subject Selection with CreatableSelect */}
                        <div className="flex items-center rounded-3xl border-1 border-[#2E5BFF] p-2 px-4">
                          <MdBook className="text-[#2E5BFF] mr-2 text-2xl" />
                          <div className="flex-1">
                            <CreatableSelect
                              id="subject"
                              disabled={sender}
                              options={subject}
                              value={selectedSubject}
                              onChange={handleSubjectChange}
                              onCreateOption={handleSubjectCreate}
                              isSearchable
                              placeholder={t("subject2")}
                              classNamePrefix="custom-select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: "none", // Remove internal border since the container already has one
                                  boxShadow: "none",
                                }),
                                container: (base) => ({
                                  ...base,
                                  maxWidth: "330px", // Make sure select takes full width
                                  position: "relative"
                                }),
                                menu: (base) => ({
                                  ...base,
                                  borderRadius: "30px",
                                  overflow: "hidden",
                                  padding: "0 10px",
                                  position: "absolute",
                                  left: "-58px",
                                  width: "410px",
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
    
                        {/* Book Description Input */}
                        <div className="flex items-center w-full border-1 border-customBlue rounded-3xl p-2 px-4">
                          <FaRegEdit className="text-customBlue self-start mt-1 mr-2 text-2xl" />
                          <textarea
                            className="form-control resize-none w-full rounded-3xl shadow-none focus:border-0 border-none outline-none"
                            id="bookDescription"
                            placeholder={t('abd')}
                            disabled={sender}
                            value={bookDescription}
                            maxLength={250}
                            onChange={handleDescriptionChange}
                          />
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
    
                        <div className="flex justify-center mt-[-10px]">
                          <div
                            onClick={handleSubmit}
                            disabled={sender}
                            className={`${sender ? "disabled" : ""} custom-button`}
                          >
                            {t('createmybook')}
                          </div>
                        </div>
                      </>
                  </div>
              </div>
            </>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default CreateBook;