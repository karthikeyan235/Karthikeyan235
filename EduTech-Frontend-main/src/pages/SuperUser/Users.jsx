import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-bootstrap/Modal';
import Loader from '../../components/Loader';
import { postAPI, getAPI } from '../../caller/axiosUrls';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import invitehappy from '../../assets/Admin/InviteHappy.gif'
import AnimatedNumber from "animated-number-react";
import copybtn from '../../assets/Copy.png';
 
// by me
import learner from '../../assets/Admin/Learners.jpg';
import teacher from '../../assets/Admin/Teachers.jpg';
import { FaSearch } from "react-icons/fa";
import { RiArrowDropDownFill } from "react-icons/ri";
import bin from '../../assets/Delete.png'
import Invite from '../../assets/Invite.png';
 
 
const Users = ({ registeredInst }) => {
    const { t } = useTranslation();
    const [showAddTeacherPanel, setShowAddTeacherPanel] = useState(false);
    const [sender, setSender] = useState(false);
    const [emails, setEmails] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [searchStudent, setSearchStudent] = useState('');
    const [searchTeacher, setSearchTeacher] = useState('');
    const [loadStudent, setLoadStudent] = useState(true);
    const [loadTeacher, setLoadTeacher] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddStudentPanel, setShowAddStudentPanel] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [loadInfo, setLoadInfo] = useState(true);
    // const [showAnimation, setShowAnimation] = useState(false);
 
    const iid = sessionStorage.getItem('iid');
 
    const getTeacher = async () => {
        setLoadTeacher(true);
        setTeacherList([]);
 
        try {
            const response = await getAPI(`/superuser/getteachersOfInstitute?search=${searchTeacher}`);
            setTeacherList(response.teachers);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadTeacher(false);
        }
    }
 
    const getStudent = async () => {
        setLoadStudent(true);
        setStudentList([]);
 
        try {
            const response = await getAPI(`/superuser/getstudentsOfInstitute?search=${searchStudent}`);
            setStudentList(response.students);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadStudent(false);
        }
    }
 
    const removeUser = async (id, isTeacher) => {
        if (sender) return;
        else setSender(true);
 
        try {
            const response = await postAPI(`/superuser/deleteUserfromInstitute?userId=${id}&instituteId=${iid}`)
            toast.success(response.message);
            if (isTeacher) await getTeacher();
            else await getStudent();
             window.location.reload();
            // await getInfo();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSender(false);
            setShowModal(false);
            setSelectedUser(null);
        }
    }
 
    const handleCloseAddTeacherPanel = () => {
        setShowAddTeacherPanel(false);
        setEmails([]);
    }
 
    const handleCloseAddStudentPanel = () => {
        setShowAddStudentPanel(false);
        // setEmails([]);
    }
 
    const handleAddUser = () => {
        // navigator.clipboard.writeText(`${location.origin}/join/${iid}`);
        // toast.success("Invite Link Copied!\nPlease share the invite link!");
        // setShowAnimation(true);
        // setTimeout(() => {
        //     setShowAnimation(false);
        //   }, 2000);  // 2000ms = 2 seconds
 
        navigator.clipboard.writeText(`${location.origin}/join/${iid}`);
        toast.success(t('ilcpstil'));
        setShowAnimation(true);
 
        setTimeout(() => {
            setShowAnimation(false);
            setShowAddStudentPanel(false);
        }, 2000);  // 2000ms = 2 seconds
    }
 
    const sendTeacherInvite = async () => {
        if (emails.length === 0) {
            toast.error(t('ppea'));
            return;
        }
    
        if (!emails.every(isEmail)) {
            toast.error(t('ppvea'));
            return;
        }
 
        if (sender) return;
        else setSender(true);
 
        try {
            const response = await postAPI(`/superuser/invite-teacher?inst_id=${iid}`, { emails });
            // toast.success(response.message);
            setEmails([]);
            setShowAnimation(true);
            setTimeout(() => {
                setShowAnimation(false);
                setShowAddTeacherPanel(false);
            }, 3000);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSender(false);
        }
    }
 
    const handleModelOpen = (user, isTeacher) => {
        setSelectedUser({ user, isTeacher });
        setShowModal(true);
    }
 
    const handleCancelSubmit = () => {
        setSelectedUser(null);
        setShowModal(false);
    }
 
    const getInfo = async () => {
       // If iid is not present, exit the function silently
        if (!iid) {
            return;
        }
        setLoadInfo(true);
 
        try {
            const response = await getAPI(`/superuser/instituteInfo?instituteId=${iid}`);
            setTotalTeachers(response.totalTeachers);
            setTotalStudents(response.totalStudents);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadInfo(false);
        }
    }
 
    useEffect(() => {
        getInfo();
    }, [])
 
    useEffect(() => {
        if (!registeredInst) return;

        const t1 = setTimeout(() => {
            getStudent();
        }, 300);
 
        return () => {
            clearTimeout(t1);
        }
    }, [searchStudent]);
 
    useEffect(() => {
        if (!registeredInst) return;

        const t2 = setTimeout(() => {
            getTeacher();
        }, 300);
 
        return () => {
            clearTimeout(t2);
        }
    }, [searchTeacher])
 
 
    // by me
    const [currentImage, setCurrentImage] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
 
    const handleHover = (index) => {
        setCurrentImage(index);
        setIsDropdownOpen(null);
    };
 
    const toggleDropdown = (side) => {
        setIsDropdownOpen((prev) => (prev === side ? null : side));
        searchStudent("");
        searchTeacher("");
    };
 
    return (
    <>
        {loadInfo ? <Loader /> :
        <>
            {/* <div className="flex flex-col-reverse gap-y-8 lg:flex-row items-center lg:items-start w-screen lg:px-10 justify-center mx-auto mt-4 gap-x-10"> */}
            {showModal ? <div className="fixed bg-black w-screen opacity-50 h-screen top-0 left-0 z-50"></div> : null}
            <Modal
                show={showModal}
                onHide={handleCancelSubmit}
                backdrop="static"
                keyboard={false}
                className='z-1000'
                centered
            >
                <Modal.Header className="flex justify-center border-0">
                    <Modal.Title className="text-center text-2xl font-bold border-0">{t('confirmdeletion')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center text-black">
                    {sender ? <Loader text={t('deleting...')} /> :
                        <>
                            <p className="font-semibold">{t('aysywtdtu')}</p>
                            <div className="mt-4 flex justify-between items-center text-left">
                                <div>
                                    <p className="font-bold">{selectedUser?.user?.name}</p>
                                    <p className="text-sm text-gray-600"><i>{selectedUser?.user?.id}</i></p>
                                </div>
                                <p className="text-sm text-gray-600">{new Date(selectedUser?.user?.joiningDate).toLocaleDateString()}</p>
                            </div>
                        </>}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        disabled={sender}
                        onClick={handleCancelSubmit}
                        className="text-[#AD1519] font-bold py-2 px-4 rounded-[10px] border-none bg-white hover:text-[#AD1519] hover:scale-[1.1]"
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        disabled={sender}
                        onClick={() => removeUser(selectedUser.user.id, selectedUser.isTeacher)}
                        className="bg-customBlue text-white font-semibold py-2 px-4 rounded-[10px] border-none"
                    >
                        {t('confirm')}
                    </Button>
                </Modal.Footer>
            </Modal>
            {showAddTeacherPanel ? <div className="fixed bg-black w-screen opacity-50 h-screen top-0 left-0 z-30"></div> : null}
            <Modal
                show={showAddTeacherPanel}
                onHide={handleCloseAddTeacherPanel}
                backdrop="true" // Use "true" for backdrop closing or "static" for preventing escape-key closing
                keyboard={false}
                size="lg"
                className="z-1000 overflow-hidden rounded-3xl"
                centered
                scrollable={false}
            >
                {showAnimation ? (
                    <div className="flex flex-col items-center justify-center h-[500px] w-9/12 gap-y-4 mx-auto">
                        <h2 className="text-md font-semibold text-black">{t('yay')}</h2>
                        <h2 className="text-lg font-semibold text-black">{t('iss')}</h2>
                        <img src={invitehappy} style={{ width: '400px', height: '400px' }} />
                    </div>
                ) : (
                    <Modal.Body>
                        <div className="flex flex-col h-[400px] items-center w-9/12 gap-y-4 mx-auto">
                            <div className="p-2">
                                <p className="text-center font-semibold" style={{ fontSize: '16px' }}>{t('htlgs')}</p>
                                <h1 className="text-center font-semibold mt-2" style={{ fontSize: '24px' }}>{t('itve&l')}</h1>
                            </div>
 
                            {sender ? <Loader type={1} text={t('loading...')} /> : (
                                <>
                                    <div>
                                        <div className="relative flex pb-0 gap-x-3 md:w-[500px]">
                                            <ReactMultiEmail
                                                className="w-full rounded-2xl border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black"
                                                placeholder={t('eea')}
                                                emails={emails}
                                                validateEmail={isEmail}
                                                onChange={(_emails) => setEmails(_emails)}
                                                autoFocus={true}
                                                getLabel={(email, index, removeEmail) => (
                                                    <div data-tag key={index} className="flex items-center">
                                                        <div className="flex" style={{ backgroundColor: '#DEE8F5' }}>
                                                            <div data-tag-item className="text-black py-1 px-2">{email}</div>
                                                            <div className="flex justify-center items-center">
                                                                <span
                                                                    data-tag-handle
                                                                    className="text-white text-sm w-6 h-6 bg-customBlue rounded-full flex justify-center items-center cursor-pointer"
                                                                    onClick={() => removeEmail(index)}
                                                                >
                                                                    ×
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="flex justify-center items-center mt-6">
                                            <Button
                                                onClick={sendTeacherInvite}
                                                disabled={sender}
                                                className={`${sender ? 'disabled' : ''} bg-customBlue py-2 px-6 text-white rounded-lg mt-6 text-md transition-colors`}
                                            >
                                                {t('sendinvite')}
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                )}
            </Modal>
 
            {showAddStudentPanel ? <div className="fixed bg-black w-screen opacity-50 h-screen top-0 left-0 z-30"></div> : null}
            <Modal
                show={showAddStudentPanel}
                onHide={handleCloseAddStudentPanel}
                backdrop="true" // Use "true" for backdrop closing or "static" for preventing escape-key closing
                keyboard={false}
                size="lg"
                className="z-1000 overflow-hidden rounded-3xl"
                centered
                scrollable={false}
            >
                <Modal.Body>
                    <div className="flex flex-col h-[400px] justify-center items-center w-9/12 gap-y-4 mx-auto">
                        <div className="p-2">
                            <p className="text-center font-semibold" style={{ fontSize: '16px' }}>{t('htlgs')}</p>
                            <h1 className="text-center font-semibold mt-2" style={{ fontSize: '24px' }}>{t('isve&w')}</h1>
                        </div>
 
                        {sender ? <Loader type={1} text={t('loading...')} /> : (
                            <>
                                <div>
                                    <div className="relative flex pb-0 gap-x-3 md:w-[500px]">
                                        <div className="relative w-full">
                                            <img
                                                src={Invite}
                                                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                                                onClick={handleAddUser}
                                            />
                                            <input
                                                className="w-full pl-14 pr-14 py-3 truncate rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black"
                                                type='text'
                                                disabled
                                                value={`${location.origin}/join/${iid}`}
                                            />
                                            <img
                                                src={copybtn}
                                                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                                                onClick={handleAddUser}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center mt-6">
                                        <Button
                                            onClick={handleAddUser}
                                            disabled={sender}
                                            className={`${sender ? 'disabled' : ''} bg-customBlue py-2 px-6 text-white rounded-lg mt-6 text-md transition-colors`}
                                        >
                                            {t('copylink')}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Modal.Body>
                {/* )} */}
            </Modal>
            <div className="min-h-screen mt-4 bg-white text-black flex flex-col items-center space-y-6 py-10">
                {/* Carousel */}
                <div className="relative flex items-center w-full h-[70vh]">
                    {/* Left Dropdown */}
                    {currentImage === 0 && (
                        <div
                            className="absolute left-10 flex flex-col items-center z-40"
                            style={{ top: "50%", transform: "translateY(-50%)" }}
                        >
                            <button
                                onClick={() => toggleDropdown("left")}
                                className="px-10 py-2 flex items-center gap-2 font-semibold bg-customBlue text-white rounded-[10px] shadow-lg relative"
                            >
                                <span className="flex items-center">
                                    {t('situ')}
                                    <RiArrowDropDownFill className="h-6 w-6 " />
                                </span>
                            </button>
                            {isDropdownOpen === "left" && (
                                <div className="mt-2 bg-customBlue rounded-[10px] shadow-lg w-80 p-2 absolute top-full left-0 z-40 transition-all  scrollbar-custom"
                                    style={{
                                        maxHeight: '210px', // Set a fixed height for the dropdown
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                        overflowY: 'auto', // Add vertical scrolling
                                    }}
                                >
                                    <div className="relative flex items-center mb-2">
                                        <input
                                            type="text"
                                            placeholder={t('searchstudent')}
                                            value={searchStudent}
                                            maxLength={50}
                                            onChange={(e) => setSearchStudent(e.target.value)}
                                            className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-300 rounded-[10px]"
                                        />
                                        <FaSearch className="absolute right-3 text-white" />
                                    </div>
                                    {loadStudent ? <div className='mx-auto my-3 spinner' /> : 
                                    studentList.length === 0 ? (
                                        <p className="text-sm text-white px-4 py-2">
                                            {t('noresultfound')}
                                        </p>
                                    ) :
                                    studentList.map((student, index) =>
                                    (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between px-4 py-2  rounded-[10px] "
                                        >
                                            <span className="flex items-center gap-2 text-white">
                                                <span>{student.name}</span>
                                                {/* <span className="text-sm text-white">{option.date}</span> */}
                                            </span>
                                            <div className="flex items-center ml-2 gap-2">
                                                <span className="text-sm text-white">
                                                    {new Date(student.joiningDate).toLocaleDateString()}
                                                </span>
                                                <img src={bin} className="h-4 w-4 cursor-pointer" alt="bin icon" onClick={() => handleModelOpen(student, false)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
 
                    {/* Highlighted Image */}
                    <div className="relative w-full flex items-center justify-center h-full">
                        {/* Image 1 */}
                        <div
                            className={`absolute transition-all duration-700 transform ${currentImage === 0
                                ? "translate-x-0 scale-110 z-10"
                                : "-translate-x-[400px] scale-90 opacity-50"
                                }`}
                            onMouseEnter={() => handleHover(0)}
                        >
                            <div className="relative w-80 bg-[#F3F5FD] rounded-[10px] shadow-xl p-3">
                                <div className="absolute inset-0 rounded-[10px] z-[-1]"></div>
                                <img
                                    src={learner}
                                    alt="learner"
                                    className="w-full h-72 object-cover rounded-[10px] z-10"
                                />
                                <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-center">
                                    {currentImage === 0 && (
                                        <button className="px-4 py-2 bg-white opacity-85 rounded-[10px] text-sm font-medium text-black shadow-md translate-y-[-40px]" onClick={() => setShowAddStudentPanel(true)}>
                                            {t('addlearner')}
                                        </button>
                                    )}
                                </div>
                                <div className="relative z-20 mt-4">
                                    {currentImage === 0 && (
                                        <p className="text-center text-sm mt-2 text-black">
                                            {t('alij2stiwbst')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
 
                        {/* Image 2 */}
                        <div
                            className={`absolute transition-all duration-700 transform ${currentImage === 1
                                ? "translate-x-0 scale-110 z-10"
                                : "translate-x-[400px] scale-90 opacity-50"
                                }`}
                            onMouseEnter={() => handleHover(1)}
                        >
                            <div className="relative w-80 bg-[#F3F5FD] rounded-[10px] shadow-xl p-3">
                                <div className="absolute inset-0 rounded-[10px] z-[-1]"></div>
                                <img
                                    src={teacher}
                                    alt="teacher"
                                    className="w-full h-72 object-cover rounded-[10px] z-10"
                                />
                                <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-center">
                                    {currentImage === 1 && (
                                        <button className="px-4 py-2 bg-white opacity-85 rounded-[10px] text-sm font-medium text-black shadow-md translate-y-[-40px]" onClick={() => setShowAddTeacherPanel(true)}>
                                            {t('addteacher')}
                                        </button>
                                    )}
                                </div>
                                <div className="relative z-20 mt-4">
                                    {currentImage === 1 && (
                                        <p className="text-center text-sm mt-2 text-black">
                                            {t('atij2stiwbs')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
 
                    {/* Right Dropdown */}
 
                    {currentImage === 1 && (
                        <div
                            className="absolute right-10 flex flex-col items-center z-40"
                            style={{ top: "50%", transform: "translateY(-50%)" }}
                        >
                            <button
                                onClick={() => toggleDropdown("right")}
                                className="px-10 py-2 flex items-center gap-2 font-semibold bg-customBlue text-white rounded-[10px] shadow-lg transition-all relative"
                            >
                                <span className="flex items-center">
                                    {t('titu')}
                                    <RiArrowDropDownFill className="h-6 w-6 " />
                                </span>
                            </button>
                            {isDropdownOpen === "right" && (
                                <div className="mt-2 bg-customBlue rounded-[10px] shadow-lg w-80 p-2 absolute top-full left-0 z-40 scrollbar-custom"
                                    style={{
                                        maxHeight: '210px', // Set a fixed height for the dropdown
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                        overflowY: 'auto', // Add vertical scrolling
                                    }}>
                                    <div className="relative flex items-center mb-2">
                                        <input
                                            type="text"
                                            placeholder={t('searchteacher')}
                                            value={searchTeacher}
                                            maxLength={50}
                                            onChange={(e) => setSearchTeacher(e.target.value)}
                                            className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-300 rounded-[10px]"
                                        />
                                        <FaSearch className="absolute right-3 text-white" />
 
                                    </div>
                                    {loadTeacher ? <div className='mx-auto my-3 spinner' /> : 
                                    teacherList.length === 0 ? (
                                        <p className="text-sm text-white px-4 py-2">
                                            {t('noresultfound')}
                                        </p>
                                    ) :
                                    teacherList.map((teacher, index) =>
                                    (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between px-4 py-2  rounded-[10px] "
                                        >
                                            <span className="flex items-center gap-2 text-white">
                                                <span>{teacher.name}</span>
                                                {/* <span className="text-sm text-white">{option.date}</span> */}
                                            </span>
                                            <div className="flex items-center ml-2 gap-2">
                                                <span className="text-sm text-white">
                                                    {new Date(teacher.joiningDate).toLocaleDateString()}
                                                </span>
                                                <img src={bin} className="h-4 w-4 cursor-pointer" alt="bin icon" onClick={() => handleModelOpen(teacher, true)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="relative w-full mt-3 mx-20 flex justify-between">
                    <div className="flex flex-col items-center justify-center w-36 h-36 ml-[5rem]">
                        <div className="text-3xl text-customBlue font-bold">
                            <AnimatedNumber
                                value={totalStudents}
                                formatValue={(value) => `${value.toFixed(0)}`}
                                duration={1000} // Animation duration
                                stepPrecision={2} // Precision of the animated number
                            />
                        </div>
                        <div className="mt-2 text-customBlue font-semibold text-center">{t('tsr')}</div>
                    </div>
 
                    <div className="flex flex-col items-center justify-center w-36 h-36 mr-[5rem]">
                        <div className="text-3xl text-customBlue font-bold">
                            <AnimatedNumber
                                value={totalTeachers}
                                formatValue={(value) => `${value.toFixed(0)}`}
                                duration={1000} // Animation duration
                                stepPrecision={2} // Precision of the animated number
                            />
                        </div>
                        <div className="mt-2 text-customBlue font-semibold text-center">{t('ttr')}</div>
                    </div>
                </div>
 
            </div>
        </>}
    </>
    )
}
 
export default Users;
