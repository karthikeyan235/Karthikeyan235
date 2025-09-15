import { useContext, useEffect, useState } from "react";
import { SuperUserContext } from "../../contexts/SuperUserContext"
import { postAPI } from "../../caller/axiosUrls";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Loader from "../../components/Loader";
import Password from '../../assets/Password.png';
import lock from '../../assets/Lock.png';
import mail from '../../assets/MailBlue.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const SuperUserLogin = () => {
    const { i18n, t } = useTranslation();
    const { setSupertoken, setSuperUser } = useContext(SuperUserContext);
    const [showPassword, setShowPassword] = useState(false);
    const [sender, setSender] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOTP] = useState('');
    const [changeToken, setChangeToken] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // Add this to get the navigation state
    const [forgetPassWindow, setForgetPassWindow] = useState(location.state?.forgetPass || false); // Use the state from navigate
    const [verified, setVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [sendingOTP, setSendingOTP] = useState(false);
    const [changingPass, setChangingPass] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    let forgetPassUsername = location.state?.username || username;
    // const userEmail = sessionStorage.getItem('userMail') || null;
    const[userEmail, setUserEmail] = useState(null);


    // To mask the user email to be shown after sending the otp
    function maskEmail(email) {
        const [name, domain] = email.split('@');
        const visibleStart = name.slice(0, 3);
        const maskedPart = '*'.repeat(Math.max(2, name.length - 6));
        const visibleEnd = name.slice(-2);
        return `${visibleStart}${maskedPart}${visibleEnd}@${domain}`;
    }

    const login = async () => {
        if (!username || !password) {
            toast(t('arfanf'), {
                icon: '⚠️'
            });
            return;
        }

        if (sender) return;
        else setSender(true);

        try {
            const response = await postAPI('/superuser/superlogin', {
                username,
                password
            });
            sessionStorage.setItem('supertoken', response.token);
            sessionStorage.setItem('sup-id', response.superuserid);
            sessionStorage.setItem('username', response.username);
            sessionStorage.setItem('superUserEmail', response.superUserEmail)
            setUserEmail(response.superUserEmail);
            setSuperUser(response.superuserid);
            setSupertoken(response.token);
            toast.success(t('lis'));
            navigate('/superuser');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSender(false);
        }
    }

    const handleNotYou = () => {
        setForgetPassWindow(false);
        forgetPassUsername = '';
        setOTP('');
        setChangeToken('');
    }

    const handleForgotPassword = async () => {
        if (!username) {
            toast(t('peyu'), {
                icon: '⚠️'
            });
            return;
        }

        forgetPassUsername = username;
        setForgetPassWindow(true);

        await sendOTP();
    }

    useEffect(() => {
        if (location.state?.username) {
            sendOTP();
        }
    }, [])

    const sendOTP = async () => {
        if (!forgetPassUsername) {
            toast(t('peyu'), {
                icon: '⚠️'
            });
            return;
        }

        setSendingOTP(true);

        try {
            const response = await postAPI(`/superuser/forgot-password`,
                { username: forgetPassUsername }
            );
            setUserEmail(response.superUserEmail);
            toast.success(response.message);
        } catch (error) {
            toast.error(error.message);
            setForgetPassWindow(false);
        } finally {
            setSendingOTP(false);
        }
    }

    const verifyOtp = async () => {
        if (!otp) {
            toast(t('peyo'), {
                icon: '⚠️'
            });
            return;
        }

        setVerifying(true);

        try {
            const response = await postAPI(`/superuser/verify-otp`, {
                username: forgetPassUsername,
                otp
            })
            setChangeToken(response.resetToken);
            setVerified(true);
            toast.success(response.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setVerifying(false);
            setOTP('');
        }
    }

    const Success = () => {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <dotlottie-player
                    src="https://lottie.host/a1606d8b-b850-446f-9ad9-d08174768b7a/KVRKFreWgm.json"
                    background="transparent"
                    speed="1"
                    style={{ width: "300px", height: "300px" }}
                    loop
                    autoplay
                ></dotlottie-player>
                <p className="text-blue-500 text-2xl font-semibold mt-4">{t('pcs')}</p>
            </div>
        );
    };


    const updatePass = async () => {
        if (!newPassword || !confirmNewPassword) {
            toast(t('pprf'), {
                icon: '⚠️'
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast(t('pdnm'), {
                icon: '⚠️'
            });
            return;
        }

        setChangingPass(true);

        try {
            const response = await postAPI(`/superuser/reset-password`, {
                username: forgetPassUsername,
                newPassword,
                confirmPassword: confirmNewPassword,
                resetToken: changeToken
            });
            setForgetPassWindow(false);
            setVerified(false);
            setSendingOTP(true);
            setShowSuccess(true)
            setChangeToken('');
            toast.success(response.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setChangingPass(false);
        }
    }

    const handleKeyDownOTP = (e) => {

        if (e.key === 'Enter') {
            verifyOtp();
        }
    };

    const handleKeyDownCP = (e) => {

        if (e.key === 'Enter') {
            updatePass();
        }
    };

    const handleKeyDown = (e) => {

        if (e.key === 'Enter') {
            login();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // if (showSuccess) {

    //     return (
    //         <div className="flex flex-col items-center justify-center h-screen bg-white">
    //             {/* Success UI */}<Success />;
    //         </div>
    //     );
    // }

    useEffect(() => {
        const adminLogin = document.getElementById("AdminLogin");
        const timer = setTimeout(() => {
            adminLogin.classList.remove("opacity-0");
            adminLogin.classList.remove("scale-50");
            adminLogin.classList.add("fadeinround");
        }, 100)

        return () => {
            adminLogin.classList.remove("fadeinround")
            clearTimeout(timer);
        }
    }, [])

    useEffect(() => {
        sessionStorage.removeItem('supertoken');
        sessionStorage.removeItem('sup-id');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('iid');
        sessionStorage.removeItem('instituteName');
        setSupertoken(null);
        setSuperUser(null);
    }, []);

    return (
        <div id="AdminLogin" className="adminLogin opacity-0 scale-50 bg-cover flex flex-col items-center justify-center bg-no-repeat w-screen h-screen overflow-hidden">
            {/* <img src={AdminLogin} className=" bg-center" alt="Admin Background" style={{
                backgroundImage: `url(${AdminLogin})`,
                backgroundPosition: "center 40%",
                backgroundSize: "cover",
                transform: "translateY(10%)"
 
            }} /> */}

            <div className="absolute flex justify-center items-center md:px-5 overflow-hidden">
                {/* <img className="w-1/2 hidden md:block" src={LeftLogin} alt="Login Doodle" /> */}
                <div className=" flex w-full flex-col px-4 md:px-5 justify-center items-center">
                    {
                        forgetPassWindow ?
                            verifying ? <Loader type={1} text={t('verifyingotp')} /> :
                                verified ?
                                    changingPass ? <Loader type={1} text={t('updatingpassword')} /> :
                                        <div className="bg-white w-screen h-screen flex flex-col justify-center items-center">
                                            <div className="flex flex-col justify-center items-center gap-y-3">
                                                <p className="font-semibold text-center" style={{ fontSize: '40px', lineHeight: '60px' }}>{t('newpassword')}</p>
                                                <div className="gap-y-1 relative w-11/12 md:w-[400px] ">
                                                    {/* <label htmlFor="changePassword" className="ml-1 font-semibold">New Password:</label> */}
                                                    <img
                                                        src={lock}
                                                        alt="Current Password Icon"
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6"
                                                    />
                                                    <input type="password" onKeyDown={handleKeyDownCP} id="changePassword" className="w-full pl-14 pr-5 py-4 rounded-3xl border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t('enternewpassword')} />
                                                </div>
                                                <div className="gap-y-1 relative w-11/12 md:w-[400px]">
                                                    {/* <label htmlFor="confirmChangePassword" className="ml-1 font-semibold">Confirm New Password:</label> */}
                                                    <img
                                                        src={lock}
                                                        alt="Current Password Icon"
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6"
                                                    />
                                                    <input type="password" onKeyDown={handleKeyDownCP} id="confirmChangePassword" className="w-full pl-14 pr-5 py-4 rounded-3xl border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder={t('cnp')} />
                                                </div>
                                                <div className="flex justify-center items-center">
                                                    <button className="bg-customBlue w-40 py-2 text-white rounded-lg mt-6 text-md transition-colors" disabled={sender || sendingOTP || verifying || changingPass} onClick={updatePass}>{t('submit')}</button>
                                                </div>
                                            </div>
                                            <div className="text-center mt-10">
                                                <p className="italic text-lg font-semibold text-gray-800">
                                                    "{t('tfiyt')} <span className="custom-gradienttext">{t('create')}.</span>"
                                                </p>
                                                <p className="text-gray-500 mt-2 px-4 md:px-0">
                                                    {t('wwvydgrtdiawwelmy')}
                                                </p>
                                            </div>
                                        </div>
                                    :
                                    sendingOTP ? <Loader type={1} text={t('sendingotp')} /> :
                                        <div className="bg-white w-screen h-screen flex flex-col justify-center items-center">
                                            <div className="flex justify-center items-center flex-col gap-y-2">
                                                <div className="text-center mt-2">
                                                    <p className="text-4xl font-bold">{t('changepassword')}</p>
                                                    <p className="text-black mt-2"><i>{t('wgy')}</i></p>
                                                </div>
                                                <div className="relative w-11/12 md:w-[400px] mt-10">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={Password}
                                                            alt="Current Password Icon"
                                                            className="absolute transform ml-5 w-5 h-5"
                                                        />
                                                        <input type="number" onKeyDown={handleKeyDownOTP} className="w-full pl-14 pr-5 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black" onChange={(e) => setOTP(e.target.value)} value={otp} placeholder={t('cyefo')} style={{ backgroundColor: '#F3F5FD' }} />

                                                    </div>
                                                    <div className="flex justify-end mr-2">
                                                        <button className="text-blue-600 underline cursor-pointer text-left" disabled={sender || sendingOTP} onClick={handleNotYou}>{t('notyou')}</button>
                                                    </div>

                                                </div>
                                                {/* Addded */}
                                                <div className="flex justify-center items-center text-customBlue">
                                                    OTP is sent to {maskEmail(userEmail)}
                                                </div>

                                                <div className="flex justify-center items-center">
                                                    <button className="bg-customBlue w-40 py-2 text-white rounded-lg mt-6 text-md transition-colors" disabled={sender || sendingOTP} onClick={verifyOtp}>{t('verify')}</button>
                                                </div>
                                            </div>
                                            <div className="text-center mt-10">
                                                <p className="italic text-lg font-semibold text-gray-800">
                                                    "{t('tfiyt')} <span className="custom-gradienttext">{t('create')}.</span>"
                                                </p>
                                                <p className="text-gray-500 mt-2 px-4 md:px-0">
                                                    {t('wwvydgrtdiawwelmy')}
                                                </p>
                                            </div>
                                        </div>
                            :
                            <div className="overflow-hidden w-screen h-screen">
                                <div className="animate__animated animate__fadeInUpBig animate__slow flex flex-col justify-center items-center h-full">
                                    <div className="flex flex-col justify-center items-center">


                                        {i18n.language === "en" ? (
                                            <div className="text-center">
                                                <h3 className="font-bold text-white text-[40px]">Edulearn for</h3>
                                                <h2 className="font-bold mb-2 leading-none text-white text-[100px]">Universities</h2>
                                            </div>
                                        ) : (

                                            <div>
                                                <h3 className="font-bold mb-2 leading-none text-white text-[100px]">
                                                    {t('edulearnforuniversities')}
                                                </h3>
                                            </div>
                                        )}
                                        <div className="flex flex-col justify-center items-center gap-y-2 mt-6 w-11/12 md:w-[500px]">
                                            <div className="relative w-11/12 md:w-[500px]">
                                                <img
                                                    src={mail}
                                                    alt="Current Password Icon"
                                                    className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-4"
                                                />
                                                <input type="text" id="username" onKeyDown={handleKeyDown} className="w-full pl-14 pr-5 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('enterusername')} />
                                            </div>
                                            <div className="relative w-11/12 md:w-[500px]">
                                                <div className="relative w-11/12 md:w-[500px] mt-4">
                                                    <img
                                                        src={lock}
                                                        alt="Password Icon"
                                                        className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                                    />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        className="w-full pl-14 pr-14 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder={t('enterpassword')}
                                                        onKeyDown={handleKeyDown}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-5 top-1/2 transform -translate-y-1/2"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        {showPassword ? (
                                                            <FaEyeSlash className="w-5 h-5 mr-2 text-gray-500" />
                                                        ) : (
                                                            <FaEye className="w-5 h-5 mr-2 text-gray-500" />
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="w-11/12 flex justify-between md:w-[500px] mt-1">
                                                    <button className="mt-2 font-semibold cursor-pointer bg-white p-2 rounded border border-black" onClick={() => navigate(-1) }>Go Back</button>
                                                    <button className="mt-2 font-semibold cursor-pointer bg-white p-2 rounded border border-black" disabled={sender} onClick={handleForgotPassword}>{t('forgotpassword')}</button>
                                                </div>
                                            </div>
                                            <div className="flex justify-center items-center ">
                                                <button className="bg-customBlue py-2 px-6 text-white rounded-lg mt-6 text-md transition-colors w-11/12 md:w-[500px]" disabled={sender} onClick={login}>{sender ? <Spinner className="w-[20px] h-[20px] border-2" /> : t('login')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default SuperUserLogin;