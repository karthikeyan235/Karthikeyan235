import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { getAPI, postAPI } from "../caller/axiosUrls";
import { IoIosArrowBack } from "react-icons/io";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Loader from "../components/Loader";
import Chapter from "../components/Chapter";
import NotFound from "../components/NotFound";
import { MdDelete } from "react-icons/md";
import Private from '../components/Private';
import "react-toggle/style.css";
import ToggleButton from '../components/ToggleButton';
import ShareImage from "../assets/Share.png";
import DeleteImage from "../assets/Delete.png";
import upload from "../assets/CloudUpload.png";
import infoBlue from "../assets/Info.png";
import PdfImage from "../assets/PDF.png";
import { IoClose } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Processing from '../components/Processing';
import { useTranslation } from 'react-i18next';
import { PlanContext } from "../contexts/PlanContext";
import { FaDownload } from "react-icons/fa6";
import { jsPDF } from "jspdf";
import img1 from "../assets/MeridianLogo.png";
import { Document, Packer, Paragraph, TextRun, AlignmentType, HorizontalPositionAlign } from "docx";
import { saveAs } from "file-saver";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const Quiz = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sender, setSender] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [quizDetails, setQuizDetails] = useState(null);
    const [allowed, setAllowed] = useState(true);
    const [editable, setEditable] = useState(false);
    const [isPrivate, setIsPrivate] = useState(true);
    const [error, setError] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showTemplatePage, setShowTemplatePage] = useState(false);
    const [template, setTemplate] = useState([]);
    const [showAll, setShowAll] = useState(false); // State for the chapters list
    const [isQuickQuiz, setIsQuickQuiz] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const { qid } = useParams();

    const handleShowTemplatePage = () => {
        getTemplate();
        setShowTemplatePage(true);
    }
    const handleCloseTemplatePage = () => {
        setTemplate([]);
        setShowTemplatePage(false);
        setIsDropdownOpen(false);
    }

    const handleDownloadQuestionpdf = async () => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const lineHeight = 10;
        let yPosition = 25;
        const pageWidth = 210; // A4 page width in mm

        // Add a heading at the top of the page
        const quizname = quizDetails.quizName;
        doc.setFontSize(22);
        doc.text(quizname, pageWidth / 2, 20, { align: 'center' }); // Quiz name at y-position 20

        // Increment yPosition to add space
        yPosition += 10; // Add space between the quiz name and the question paper heading

        const heading = "Question Paper";
        doc.setFontSize(20);
        doc.text(heading, pageWidth / 2, yPosition, { align: 'center' }); // Question Paper heading

        yPosition += 20; // Add space between the quiz name and the question paper heading


        // Draw a horizontal line below the heading
        doc.setLineWidth(0.5);
        doc.line(10, 25, pageWidth - 10, 25); // x1, y1, x2, y2 coordinates

        doc.setFont('Arial Unicode MS');

        // Convert the image to a lower opacity using canvas
        const getTransparentImage = (src, opacity) => {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.globalAlpha = opacity; // Set the opacity here
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png')); // Return Base64 image
                };
            });
        };

        const logoUrl = await getTransparentImage(img1, 0.3); // Reduce opacity to 0.1
        const addWatermark = () => {
            const logoWidth = 120;
            const logoHeight = 50;
            const xPosition = (doc.internal.pageSize.width - logoWidth) / 2;
            const yPosition = (doc.internal.pageSize.height - logoHeight) / 2;
            doc.addImage(logoUrl, 'PNG', xPosition, yPosition, logoWidth, logoHeight);
        };

        // Add watermark on the first page
        // console.log("water mark added");
        addWatermark();

        template.forEach((item, index) => {
            // console.log('Section Title:', Object.keys(item)[0]);  // Check section title
            doc.setFontSize(18);
            doc.text(`${Object.keys(item)[0]} Question`, 10, yPosition);
            yPosition += lineHeight + 5;

            Object.values(item)[0].forEach((questionObj, qIndex) => {
                // console.log('Question:', questionObj.Question);  // Check question
                doc.setFontSize(14)
                const splitQuestion = doc.splitTextToSize(`Q${qIndex + 1}: ${questionObj.Question}`, 180);
                const questionText = `Q${qIndex + 1}: ${questionObj.Question}`;

                const questionWidth = doc.getTextWidth(questionText); // Get the width of the question text

                // console.log("Split Question:", splitQuestion);
                splitQuestion.forEach((line, index) => {
                    console.log('Line:', line); // Check the split question text
                    if (yPosition + lineHeight > pageHeight - 20) {
                        doc.addPage();
                        yPosition = 20;
                        addWatermark(); // Add watermark on the new page
                    }

                    // Print the question line
                    doc.text(line, 10, yPosition);

                    if (index === splitQuestion.length - 1) {
                        // Check if the question takes up the full page width
                        if (questionWidth < pageWidth - 30) {
                            // Place the difficulty to the right of the question
                            const difficultyXPosition = 10 + questionWidth + 10; // 10 units after the question
                            doc.text(`(${questionObj.difficulty})`, difficultyXPosition, yPosition);
                        } else {
                            // If the question width is too large, move difficulty below
                            yPosition += lineHeight; // Shift down
                            doc.text(` (${questionObj.difficulty})`, 10, yPosition);
                        }
                    }

                    yPosition += lineHeight;
                });

                // Ensure proper line height for the next section
                if (yPosition + lineHeight > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                    addWatermark(); // Add watermark on the new page
                }



                // Display Options (if available)
                if (questionObj.options && questionObj.options.length > 0) {
                    doc.text("Options:", 10, yPosition);
                    yPosition += lineHeight;
                    questionObj.options.forEach((option, optIndex) => {
                        const optionText = `${String.fromCharCode(65 + optIndex)}. ${option}`;
                        const splitOption = doc.splitTextToSize(optionText, 180);
                        splitOption.forEach(line => {
                            if (yPosition + lineHeight > pageHeight - 20) {
                                doc.addPage();
                                yPosition = 20;

                                addWatermark(); // Add watermark on the new page
                            }
                            doc.text(line, 15, yPosition);
                            yPosition += lineHeight;
                        });
                    });
                }

                yPosition += lineHeight * 2;  // Add spacing between questions
            });
        });

        // Adding Page Numbers at the bottom
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
        }

        // doc.save("Questions.pdf");
        doc.save(`${quizname}_Question_Paper.pdf`);

    };



    const handleDownloadAnswerpdf = async () => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const lineHeight = 10;
        let yPosition = 25;
        const pageWidth = 210; // A4 page width in mm

        // Add a heading at the top of the page
        const quizname = quizDetails.quizName;
        doc.setFontSize(22);
        doc.text(quizname, pageWidth / 2, 20, { align: 'center' }); // Quiz name at y-position 20

        // Increment yPosition to add space
        yPosition += 10; // Add space between the quiz name and the question paper heading

        const heading = "Question Paper with Answer Key";
        doc.setFontSize(20);
        doc.text(heading, pageWidth / 2, yPosition, { align: 'center' }); // Question Paper heading

        yPosition += 20; // Add space between the quiz name and the question paper heading

        // Draw a horizontal line below the heading
        doc.setLineWidth(0.5);
        doc.line(10, 25, pageWidth - 10, 25); // x1, y1, x2, y2 coordinates

        doc.setFont('Arial Unicode MS');

        // Convert the image to a lower opacity using canvas
        const getTransparentImage = (src, opacity) => {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.globalAlpha = opacity; // Set the opacity here
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png')); // Return Base64 image
                };
            });
        };

        const logoUrl = await getTransparentImage(img1, 0.3); // Reduce opacity to 0.1
        const addWatermark = () => {
            const logoWidth = 120;
            const logoHeight = 50;
            const xPosition = (doc.internal.pageSize.width - logoWidth) / 2;
            const yPosition = (doc.internal.pageSize.height - logoHeight) / 2;
            doc.addImage(logoUrl, 'PNG', xPosition, yPosition, logoWidth, logoHeight);
        };

        // Add watermark on the first page
        // console.log("water mark added");
        addWatermark();

        template.forEach((item, index) => {
            // console.log('Section Title:', Object.keys(item)[0]);  // Check section 

            const sectionTitle = Object.keys(item)[0]; // Get the section title
            console.log('Section Title:', sectionTitle);  // Check section title
            doc.setFontSize(18);
            doc.text(` ${sectionTitle} Question`, 10, yPosition);
            yPosition += lineHeight + 5;

            Object.values(item)[0].forEach((questionObj, qIndex) => {
                doc.setFontSize(14)

                const splitQuestion = doc.splitTextToSize(`Q${qIndex + 1}: ${questionObj.Question}`, 180);
                const questionText = `Q${qIndex + 1}: ${questionObj.Question}`;

                const questionWidth = doc.getTextWidth(questionText);
                // console.log("Split Question:", splitQuestion);
                splitQuestion.forEach((line, index) => {
                    if (yPosition + lineHeight > pageHeight - 20) {
                        doc.addPage();
                        yPosition = 20;
                        addWatermark(); // Add watermark on the new page
                    }
                    doc.text(line, 10, yPosition);

                    if (index === splitQuestion.length - 1) {
                        // Check if the question takes up the full page width
                        if (questionWidth < pageWidth - 30) {
                            // Place the difficulty to the right of the question
                            const difficultyXPosition = 10 + questionWidth + 10; // 10 units after the question
                            doc.text(`(${questionObj.difficulty})`, difficultyXPosition, yPosition);
                        } else {
                            yPosition += lineHeight; // Shift down
                            doc.text(` (${questionObj.difficulty})`, 10, yPosition);
                        }
                    }

                    yPosition += lineHeight;
                });

                doc.setFontSize(12);

                const splitAnswer = sectionTitle === "MCQ"
                    ? doc.splitTextToSize(`Answer: ${String.fromCharCode(64 + parseInt(questionObj.answer, 10))}`, 180)
                    : doc.splitTextToSize(`Answer: ${questionObj.answer}`, 180);

                splitAnswer.forEach(ans => {
                    if (yPosition + lineHeight > pageHeight - 20) {
                        doc.addPage();
                        yPosition = 20;
                        addWatermark(); // Add watermark on the new page
                    }
                    doc.text(ans, 10, yPosition);
                    yPosition += lineHeight;
                });
                // Question Details
                doc.setFontSize(12);
                if (yPosition + lineHeight > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                    addWatermark();
                }

                // Explanation
                const formattedExplanation = questionObj.explanation.replace(/->/g, '→')
                    .replace(/<-/g, '←')
                    .replace(/<->/g, '↔')
                    .replace(/=>/g, '⇒')
                    .replace(/<=/g, '⇐');

                if (sectionTitle === "Descriptive" && formattedExplanation.trim()) {
                    yPosition += 10;  // Add some space before explanation content
                }

                // Check if the explanation is not an empty string
                if (formattedExplanation.trim()) {
                    const explanationText = doc.splitTextToSize(`Explanation: ${formattedExplanation}`, 180);

                    explanationText.forEach(line => {
                        if (yPosition + lineHeight > pageHeight - 20) {
                            doc.addPage();
                            yPosition = 20;
                            addWatermark(); // Add watermark on the new page
                        }

                        doc.text(line, 10, yPosition);
                        yPosition += lineHeight;
                    });
                }
                // Display Options (if available)
                if (questionObj.options && questionObj.options.length > 0) {
                    doc.text("Options:", 10, yPosition);
                    yPosition += lineHeight;
                    questionObj.options.forEach((option, optIndex) => {
                        const optionText = `${String.fromCharCode(65 + optIndex)}. ${option}`;
                        const splitOption = doc.splitTextToSize(optionText, 180);
                        splitOption.forEach(line => {
                            if (yPosition + lineHeight > pageHeight - 20) {
                                doc.addPage();
                                yPosition = 20;

                                addWatermark(); // Add watermark on the new page
                            }
                            doc.text(line, 15, yPosition);
                            yPosition += lineHeight;
                        });
                    });
                }

                yPosition += lineHeight * 2;  // Add spacing between questions
            });
        });

        // Adding Page Numbers at the bottom
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
        }

        // doc.save("AnswerSheet.pdf");
        doc.save(`${quizname}_AnswerSheet.pdf`);

    };

    const handleDownloadAnswerWord = async () => {
        try {
            const docSections = [];

            docSections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: ` ${quizDetails.quizName}`,
                            bold: true,
                            size: 45, // Font size
                        }),
                    ],
                    alignment: AlignmentType.CENTER, // Center alignment
                }),
                new Paragraph({ text: "" }), // Add spacing
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Question paper with Answer Key",
                            bold: true,
                            size: 38, // Font size
                        }),
                    ],
                    alignment: AlignmentType.CENTER, // Center alignment
                }),
                new Paragraph({ text: "" }), // Add spacing
                new Paragraph({
                    text: "_____________________________________________________________________________",
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: "" })
            );


            template.forEach((section) => {
                for (const key in section) {
                    const questions = section[key];

                    // Add section heading
                    docSections.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${key.toUpperCase()} Question`, // Section name in uppercase
                                    bold: true,
                                    size: 30, // Font size
                                }),
                            ],
                            spacing: { before: 400 }, // Add spacing between options

                            alignment: AlignmentType.LEFT, // Left-aligned
                        }),
                        new Paragraph({ text: "" }) // Add spacing
                    );

                    questions.forEach((item) => {

                        const formattedAnswer =
                            key.toLowerCase() === "mcq" && !isNaN(item.answer)
                                ? String.fromCharCode(64 + Number(item.answer)) // 1 -> A, 2 -> B, etc.
                                : item.answer;

                        docSections.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Question: ${item.Question}`,
                                        bold: true,
                                        size: 23,
                                    }),
                                ],
                            }),
                            ...item.options?.map((option, idx) =>
                                new Paragraph({
                                    text: `Option ${idx + 1}: ${option}`,
                                    bullet: { level: 0 },
                                    spacing: { before: 200, after: 200 }, // Add spacing between options
                                })
                            ) || [],
                            new Paragraph({
                                text: `Answer: ${formattedAnswer}`,
                                bold: true,
                                spacing: { before: 200, after: 200 },
                            }),
                        
                        );
                        if (item.explanation.trim()) {
                            docSections.push(
                                new Paragraph({
                                    text: `Explanation: ${item.explanation}`,
                                    spacing: { after: 200 }, // Add extra space after the paragraph
                                })
                            );
                        }
                    });
                }
            });

            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: docSections,
                    },
                ],
            });

            // Generate and download the file
            const blob = await Packer.toBlob(doc);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${quizDetails.quizName}_AnswerSheet.docx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating Word document:", error);
        }
    };


    const handleDownloadQuestionWord = async () => {
        try {
            const docSections = [];

            docSections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: ` ${quizDetails.quizName}`,
                            bold: true,
                            size: 45, // Font size
                        }),
                    ],
                    alignment: AlignmentType.CENTER, // Center alignment
                }),
                new Paragraph({ text: "" }), // Add spacing
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Question Paper",
                            bold: true,
                            size: 38, // Font size
                        }),
                    ],
                    alignment: AlignmentType.CENTER, // Center alignment
                }),
                new Paragraph({ text: "" }), // Add spacing
                new Paragraph({
                    text: "_____________________________________________________________________________",
                    alignment: AlignmentType.CENTER, // Center alignment for the line
                }),
                new Paragraph({ text: "" }) // Add more spacing
            );


            template.forEach((section) => {
                for (const key in section) {
                    const questions = section[key];
                    docSections.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${key.toUpperCase()} Question`, // Section name in uppercase
                                    bold: true, // Bold text
                                    size: 30, // Font size
                                }),
                            ],
                            spacing: { before: 400 }, // Add spacing between options
                            alignment: AlignmentType.LEFT, // Left-aligned
                        }),
                        new Paragraph({ text: "" }) // Add spacing
                    );

                    if (key !== "Descriptive" && key !== "Numerical") {
                        questions.forEach((item, index) => {
                            docSections.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `Question: ${item.Question}`,
                                            bold: true, // Always bold if not Descriptive or Numerical
                                            size: 23,
                                        }),
                                        new Paragraph({ text: "" }) // Add spacing
                                    ],
                                }),
                                ...item.options?.map((option, idx) =>
                                    new Paragraph({
                                        text: `Option ${idx + 1}: ${option}`,
                                        bullet: { level: 0 },
                                        spacing: { before: 200, after: 200 }, // Add spacing between options
                                    })
                                ) || [],
                            );
                        });
                    } else {
                        questions.forEach((item, index) => {
                            docSections.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `Question ${index + 1}: ${item.Question}`,
                                            bold: false, // Always bold if not Descriptive or Numerical
                                            size: 23,
                                        }),
                                        new Paragraph({ text: "" }) // Add spacing
                                    ],
                                }),
                                ...item.options?.map((option, idx) =>
                                    new Paragraph({
                                        text: `Option ${idx + 1}: ${option}`,
                                        bullet: { level: 0 },
                                        spacing: { before: 200, after: 200 }, // Add spacing between options
                                    })
                                ) || [],
                                // You can include any other fields like Answer or Explanation here if needed
                            );
                        });
                    }

                }
            });

            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: docSections,
                    },
                ],
            });

            // Generate and download the file
            const blob = await Packer.toBlob(doc);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${quizDetails.quizName}_QuestionPaper.docx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating Word document:", error);
        }
    };



    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    const getQuizInfo = async () => {
        setSender(true);
        try {
            const response = await getAPI(`/quiz/get-single-quiz?quizId=${qid}`);
            if (response.allow) {
                setAllowed(true);
                setQuizDetails(response.quiz);
                setIsQuickQuiz(response.quiz.quickQuiz);
                setIsPrivate(response.quiz.isPrivate);
                if (sessionStorage.getItem('user-id') === response.quiz.createdBy?._id) setEditable(true);
                else setEditable(false);
            }
        } catch (error) {
            toast.error(error.message);
            setError(true);
            setAllowed(false);
            setQuizDetails(null);
            setEditable(false);
        } finally {
            setSender(false);
        }
    }

    const getChapters = async () => {
        setLoading(true);
        try {
            const response = await getAPI(`/quiz/get-chapter-details-by-quiz?quizID=${qid}&search=${search}`);
            setChapters(response.chapterDetails || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const getTemplate = async () => {
        setSender(true);
        try {
            const response = await getAPI(`/quiz/getTemplate?quizId=${qid}`);
            setTemplate(response.template || []);
            console.log("this is template response checking", response.template);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSender(false);
        }
    }

    const togglePrivacy = async () => {
        setIsPrivate(!isPrivate);

        if (sender) return;
        else setSender(true);

        try {
            const response = await postAPI(`/quiz/toggle-quiz-privacy?quizId=${qid}`);
            toast.success(response.isPrivate ? "Your quiz is now Private" : "Your quiz is now Public");
            setQuizDetails(null);
            getQuizInfo();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSender(false);
        }
    }

    const deleteQuiz = async (e) => {
        e.preventDefault();

        if (sender) return;
        else setSender(true);

        setProcessing(true);

        try {
            await postAPI(`/quiz/delete-quiz?quizID=${qid}`);
            toast.success(t('yqids'));
            navigate(-1);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSender(false);
            setProcessing(false);
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(location.origin + `/share/quiz/${qid}`);
        toast.success(t('ctc'));
    }

    useEffect(() => {
        getQuizInfo();
    }, [allowed])

    useEffect(() => {
        sessionStorage.removeItem('adpid');
        sessionStorage.removeItem('first');
        sessionStorage.removeItem("adaptiveResult");
    })

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
                    <span className="text-3xl font-bold">{t('myquiz')}</span>
                </div>

                {/* 2nd part - Search Bar */}
                {!error ?
                    <div className="flex justify-center items-center w-full mx-auto gap-x-4 relative">
                        <div className="search relative hover:shadow-xl w-full mx-auto bg-[#F5F5F5] flex items-center h-[50px] px-4 rounded-[15px]">
                            <span className="vr my-2" />
                            <input
                                className="py-[10px] px-3 w-full bg-transparent outline-b-none border-gray-300 focus:outline-none outline-none grow "
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('searchchapters')}
                                value={search}
                                maxLength={50}
                                disabled={sender || !quizDetails}
                            />
                            <FaSearch className="absolute right-3 text-[25px] top-1/2 transform -translate-y-1/2 text-blue-500" />
                        </div>
                    </div> : null}
            </div>

            {/* Lower Half */}
            <div className="flex w-screen gap-y-10 p-8 px-24 rounded-lg gap-x-8">
                {error ? <NotFound text={t('cannotfindquiz')} />
                    : allowed ?
                        !quizDetails ? (
                            <Loader type={1} text={t('fetchingquiz...')} />
                        ) : (
                            <>
                                <div className="flex rounded-[30px] min-w-[280px] h-[250px] overflow-hidden">
                                    {/* Image Section */}
                                    <img
                                        src={quizDetails?.coverImage}
                                        alt="Quiz Cover"
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
                                                    <p title={quizDetails.quizName} className="text-4xl items-center flex w-[400px] font-semibold truncate">
                                                        {quizDetails.quizName}
                                                    </p>

                                                    {/* Toggle Button next to the book name */}
                                                    {editable ? (
                                                        <div
                                                            className={`${sender ? "pointer-events-none" : ""
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
                                                    {/* {attempt quiz} */}
                                                    <div>
                                                        {(sessionStorage.getItem("role") === "teacher") ?
                                                            <button onClick={handleShowTemplatePage} className="custom-button h-fit w-[149px] mx-4">
                                                                {t('previwequiz')}
                                                            </button> :
                                                            <button onClick={() => navigate(`/${sessionStorage.getItem("role")}/quiz-attend/${quizDetails.quizID}`)} className="custom-button h-fit w-[149px] mx-4">
                                                                {t('attemptquiz')}
                                                            </button>}
                                                    </div>
                                                </div>

                                                <div className="flex gap-x-10 mt-2 mr-5 w-[600px] justify-end">
                                                    {/* Share Button */}
                                                    {isPrivate ? null : (
                                                        <button
                                                            disabled={sender}
                                                            className={`${sender ? "" : "hover:scale-110 active:scale-90"
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
                                                            className={`${sender ? "" : "hover:scale-110 active:scale-90"
                                                                } flex flex-col rounded justify-center items-center text-red-400 mb-1`}
                                                            disabled={sender}
                                                            variant="danger"
                                                            onClick={deleteQuiz}
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

                                            <p className="font-semibold mb-2">by {quizDetails.createdBy?.name}</p>
                                            <p className="font-semibold">
                                                <span className="font-semibold">{t("subject")} </span>
                                                {quizDetails.subject?.toUpperCase()}
                                            </p>
                                        </div>

                                        {/* Main Description of the Book */}
                                        <div className="px-4 rounded-lg w-5/6 max-w-full overflow-hidden">
                                            <p
                                                className={`transition-all duration-300 ease-in-out w-full`}
                                            >
                                                <span className="break-words">
                                                    {quizDetails.description}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {(sessionStorage.getItem("role") === "teacher") && <Modal
                                        show={showTemplatePage}
                                        onHide={handleCloseTemplatePage}
                                        backdrop="static"
                                        size="xl"
                                        id="template"
                                        keyboard={false}
                                        className="z-40 overflow-hidden" // Adjust the width to 75% or any other value
                                        centered
                                        scrollable
                                    >
                                        <Modal.Body size="xl" className="py-4 h-[800px]">
                                            <div className="flex-col px-5 h-full gap-y-4 flex mx-auto">
                                                <div className="flex justify-end items-center absolute top-5 right-10 gap-4 ">
                                                    {/* <button onClick={handleDownloadpdf} className=" ">
                                                        <FaDownload className="h-6 w-6 cursor-pointer active:scale-100 active:rotate-90"  />
                                                    </button> */}
                                                    <button onClick={toggleDropdown} className="relative">
                                                        <FaDownload className="h-6 w-6 cursor-pointer active:scale-100 " />
                                                    </button>
                                                    {isDropdownOpen && (
                                                        <div className={`absolute ${isDropdownOpen ? "fadeintop" : ""} ml-[-4px] mt-[10.5rem] rounded-xl border-1 bg-white border-gray-300 py-2 px-2 flex flex-col bg-lang w-[450px] `}>
                                                            <div
                                                                className="flex flex-col  cursor-pointer px-2 rounded-xl py-1 "
                                                            >
                                                                <div className="text-gray-800 flex justify-between gap-3 py-2">
                                                                    <div className="text-left font-semibold">PDF File</div>
                                                                    <div className="flex space-x-3">
                                                                        <button className="underline text-blue-500 hover:text-blue-700 hover:font-medium hover:scale-110 active:scale-95" onClick={handleDownloadQuestionpdf}>Question paper</button>
                                                                        <button className="underline text-blue-500 hover:text-blue-700 hover:font-medium hover:scale-110 active:scale-95" onClick={handleDownloadAnswerpdf}>Answer Key </button>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <hr className="border-gray-300 border-1" />
                                                            <div
                                                                className="flex flex-col cursor-pointer px-2 rounded-xl py-1 "
                                                            >

                                                                <div className="text-gray-800 flex justify-between gap-3 py-2">
                                                                    <div className="text-left font-semibold">Word File</div>
                                                                    <div className="flex space-x-3">
                                                                        <button className="underline text-blue-500 hover:text-blue-700 hover:font-medium hover:scale-110 active:scale-95 " onClick={handleDownloadQuestionWord}>Question paper</button>
                                                                        <button className="underline text-blue-500 hover:text-blue-700 hover:font-medium hover:scale-110 active:scale-95" onClick={handleDownloadAnswerWord}>Answer Key </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button onClick={handleCloseTemplatePage} className="">
                                                        <IoClose className="text-[40px] cursor-pointer hover:rotate-180 hover:scale-125 active:scale-100 active:rotate-90" />
                                                    </button>
                                                </div>

                                                {sender ? (
                                                    <Loader type={1} text={t("pleasewait")} />
                                                ) : (
                                                    <>
                                                        {template.length === 0 ? (
                                                            <NotFound text={t("ntcf")} />
                                                        ) : (
                                                            <>
                                                                {template.map((sectionObj, index) => {
                                                                    const sectionTitle = Object.keys(sectionObj)[0]; // 'MCQ' or 'Descriptive'
                                                                    const questions = sectionObj[sectionTitle]; // Array of questions

                                                                    return (
                                                                        <div key={index} className="pb-8">
                                                                            <h2 className="text-2xl font-bold text-customBlue mb-4">
                                                                                {sectionTitle} {t("questions")}
                                                                            </h2>
                                                                            <div className="space-y-6 ">
                                                                                {questions.map((question, qIndex) => (
                                                                                    <div
                                                                                        key={qIndex}
                                                                                        className="flex flex-col bg-white px-4 py-[30px] rounded-[30px] border-2 border-blue-400 shadow-md hover:shadow-lg"
                                                                                    >
                                                                                        <div className="md:flex-row-reverse gap-x-2 px-3 flex flex-col md:justify-between">
                                                                                            <p
                                                                                                className={`${question.difficulty === "easy"
                                                                                                    ? "bg-green-200 text-green-700"
                                                                                                    : question.difficulty === "medium"
                                                                                                        ? "bg-yellow-200 text-yellow-700"
                                                                                                        : "bg-red-200 text-red-700"
                                                                                                    }
                                                                            } h-fit font-semibold text-sm px-3 py-2 border w-fit capitalize rounded-lg`}
                                                                                            >
                                                                                                {question.difficulty}
                                                                                            </p>
                                                                                            <p className="text-lg mb-2 text-black md:w-11/12 font-semibold">
                                                                                                <Latex>Q{qIndex + 1}: {question.Question}</Latex>
                                                                                            </p>
                                                                                        </div>
                                                                                        {question.options?.length > 0 && (
                                                                                            <ul className="px-3 flex flex-col gap-y-2 pb-3">
                                                                                                {question.options.map(
                                                                                                    (option, oIndex) => (
                                                                                                        <li
                                                                                                            key={oIndex}
                                                                                                            className="text-black font-semibold"
                                                                                                        >
                                                                                                            <span
                                                                                                                name={`question-${qIndex}`}
                                                                                                                id={`option-${qIndex}-${oIndex}`}
                                                                                                                className="mr-2"
                                                                                                            />
                                                                                                            <label
                                                                                                                htmlFor={`option-${qIndex}-${oIndex}`}
                                                                                                            >
                                                                                                                <Latex>{oIndex + 1}. {option}</Latex>
                                                                                                            </label>
                                                                                                        </li>
                                                                                                    )
                                                                                                )}
                                                                                            </ul>
                                                                                        )}
                                                                                        <div className="flex flex-col">
                                                                                            <div className="gap-x-2 px-3 rounded text-customBlue font-semibold flex-col flex">
                                                                                                <p className="font-semibold">
                                                                                                    {t("answer")}
                                                                                                </p>
                                                                                                <p>
                                                                                                    {sectionTitle === "MCQ" ? (
                                                                                                        <>
                                                                                                        <Latex>
                                                                                                            {`${question.answer}. ${question.options[question.answer - 1]}`}
                                                                                                        </Latex>
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        <Latex>{`${question.answer}`}</Latex>
                                                                                                    )}
                                                                                                </p>
                                                                                            </div>
                                                                                            {question.explanation ? <div className="gap-x-2 px-3 rounded text-[#C8B100] flex-col flex md:rounded md:p-3">
                                                                                                <p className="font-semibold text-black">
                                                                                                    {t("explanation")}
                                                                                                </p>
                                                                                                <p><Latex>{question.explanation}</Latex></p>
                                                                                            </div> : null}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </Modal.Body>
                                    </Modal>}

                                    {/* IIIrd part for the chapters section */}
                                    <div className="flex mt-4">
                                        <div className="flex gap-y-3 w-9/12 flex-col justify-center mx-4">
                                            {loading ? (<Loader type={2} />) :
                                                isQuickQuiz ? <NotFound text={"Quick Quiz Magic: Chapters vanished in a flash! 🧙‍♂️✨"} /> :
                                                    (chapters.length === 0) ? (
                                                        <NotFound text={t("nochapterfound")} />
                                                    ) : (
                                                        <>
                                                            {chapters
                                                                .slice(0, showAll ? chapters.length : 1)
                                                                .map((chapter, index) => (
                                                                    <Chapter
                                                                        key={`chapter-${index}`}
                                                                        editable={editable}
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


                                {/* {changed this part } */}


                                
                                        </div>
                                        {/* {(sessionStorage.getItem("role") === "teacher") ?
                                         <button onClick={handleShowTemplatePage} className="custom-button h-fit w-[200px] mt-3">
                                            {t('previwequiz')}
                                        </button> :
                                        <button onClick={() => navigate(`/${sessionStorage.getItem("role")}/quiz-attend/${quizDetails.quizID}`)} className="custom-button h-fit w-[200px] mt-3">
                                            {t('attemptquiz')}
                                        </button>} */}
                                    </div>
                                </div>
                            </>
                        )
                        : <Private text={t('thisquizisprivate')} />}
            </div>
        </div>
    )
}

export default Quiz;