import { useEffect, useContext, useState } from "react";
import { SignInButton } from "../components/SignInButton";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { GraphDataContext } from '../contexts/graphDataContext';
import { callMsGraph } from '../graph';
import { useMsal } from '@azure/msal-react';
import { useNavigate, useParams } from 'react-router-dom';
import { postAPI } from '../caller/axiosUrls';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Loader from "../components/Loader";
import lock from '../assets/Lock.png';
import mail from '../assets/MailBlue.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Spinner } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { isEmail } from 'react-multi-email';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Password from '../assets/Password.png';

const StudentLogin = () => {
  const { i18n, t } = useTranslation();
  const [email, setEmail] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [name, setName] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [password, setPassword] = useState('');
  const { graphData, setGraphData } = useContext(GraphDataContext);
  const { token, setToken } = useContext(AuthContext);
  const { instance, accounts } = useMsal();
  const { iid, key, bid, qid } = useParams();
  const [sender, setSender] = useState(false);
  const [panel, setPanel] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReg, setShowPasswordReg] = useState(false);
  const [verifyEmailPanel, setVerifyEmailPanel] = useState(false);
  const [otp, setOtp] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Added state for forget password
  const [forgetPassWindow, setForgetPassWindow] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
      const [changeToken, setChangeToken] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [OTP, setOTP] = useState('');
  let forgetPassEmail = location.state?.username || email;


  const navigate = useNavigate();

  console.log(email);

  function maskEmail(email) {
    const [name, domain] = email.split('@');
    const visibleStart = name.slice(0, 3);
    const maskedPart = '*'.repeat(Math.max(2, name.length - 6));
    const visibleEnd = name.slice(-2);
    return `${visibleStart}${maskedPart}${visibleEnd}@${domain}`;
  }

  const register = async () => {
    if (!executeRecaptcha) {
      toast("Recaptcha not yet available. Try again later.", {
        icon: "⚠️",
      });
      return;
    }

    if (!emailReg || !name || !passwordReg) {
      toast(t('arfanf'), {
        icon: "⚠️",
      });
      return;
    }

    if (!isEmail(emailReg)) {
      toast(t('efi'), {
        icon: "⚠️",
      });
      return;
    }

    if (sender) return;
    else setSender(true);

    try {
      const captoken = await executeRecaptcha("login");

      const response = await postAPI('/users/signup', {
        email: emailReg,
        captchaToken: captoken,
        name: name,
        password: passwordReg,
        loginType: "JWT"
      });
      await sendOTP(emailReg);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  }

  const jwtLogin = async () => {
    if (!executeRecaptcha) {
      toast("Recaptcha not yet available. Try again later.", {
        icon: "⚠️",
      });
      return;
    }

    if (!email || !password) {
      toast(t('arfanf'), {
        icon: "⚠️",
      });
      return;
    }

    if (!isEmail(email)) {
      toast(t('efi'), {
        icon: "⚠️",
      });
      return;
    }

    if (sender) return;
    else setSender(true);

    try {
      const captoken = await executeRecaptcha("login");

      const response = await postAPI('/users/login', {
        email: email,
        captchaToken: captoken,
        password: password,
        loginType: "JWT"
      });
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('userMail', email);
      sessionStorage.setItem('user-id', response.uid);
      sessionStorage.setItem('role', response.role);
      sessionStorage.setItem('jwtLogin', 1);
      setToken(response.token);
      toast.success(t('lis'));
      if (key && iid) navigate(`/join/${iid}/${key}`);
      else if (iid) navigate(`/join/${iid}`);
      else navigate(`/${response.role}`);
    } catch (error) {
      if (error.statusCode === 403) await sendOTP(email);
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  }

  const serverLogin = async (data) => {
    if (sender) return;
    else setSender(true);

    try {
      const bodyData = {
        name: data.displayName,
        email: data.mail,
        loginType: "Microsoft"
      }
      const response = await postAPI('/users/login', bodyData);
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user-id', response.uid);
      sessionStorage.setItem('role', response.role);
      sessionStorage.setItem('jwtLogin', 0);
      setToken(response.token);
      toast.success(t('lis'));
      if (bid || qid) {
        if (bid) {
          navigate(`/${response.role}/book/${bid}`);
        } else if (qid) {
          navigate(`/${response.role}/quiz/${qid}`);
        }
      } else if (key && iid) {
        navigate(`/join/${iid}/${key}`);
      } else if (iid) {
        navigate(`/join/${iid}`);
      } else navigate(`/${response.role}`);
    } catch (error) {
      if (error.statusCode === 403) {
        sessionStorage.clear();
        location.reload();
      }
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  }

  const RequestProfileData = () => {
    if (instance.getAllAccounts().length > 0) {
      // If there's an active account, acquire a token silently
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          callMsGraph(response.accessToken)
            .then(async (data) => {
              setGraphData(data);
              await serverLogin(data);
              sessionStorage.setItem('graphData', JSON.stringify(data));
            })
        })
        .catch((error) => {
          console.error(t('ftats'), error);
        });
    } else {
      console.error(t('naatats'));
    }
  };

  const sendOTP = async (email) => {
    if (sender) return;
    else setSender(true);

    try {
      const response = await postAPI('/users/sendOtpToMail', {
        email
      });
      setVerifyEmailPanel(true);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  }

  const verifyEmail = async () => {
    if (sender) return;
    else setSender(true);

    try {
      const response = await postAPI('/users/verifyWebMailOtp', {
        email: (panel === 'login') ? email : emailReg,
        otp
      });
      setPanel("login");
      setVerifyEmailPanel(false);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      jwtLogin();
    }
  };

  const handleKeyDownReg = (e) => {
    if (e.key === 'Enter') {
      register();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibilityReg = () => {
    setShowPasswordReg(!showPasswordReg);
  };

  useEffect(() => {
    if (token) navigate(`/${sessionStorage.getItem('role')}`);
    else {
      if (graphData) {
        serverLogin(graphData);
      }
    }
  }, [token])

  useEffect(() => {
    const studentLogin = document.getElementById("studentLogin");
    const timer = setTimeout(() => {
      studentLogin.classList.remove("opacity-0");
      studentLogin.classList.remove("scale-50");
      studentLogin.classList.add("fadeinround");
    }, 100)

    return () => {
      studentLogin.classList.remove("fadeinround")
      clearTimeout(timer);
    }
  }, [])


  // Forget Password Functionality
  // 1
  const handleForgotPassword = async () => {
    if (!email) {
      // Edit the error message
      toast(t('peye'), {
        icon: '⚠️'
      });
      return;
    }

    setForgetPassWindow(true);

    await sendOTPForgot();
  }

  // 2
  const sendOTPForgot = async () => {
    if (!email) {
      toast(t('peye'), {
        icon: '⚠️'
      });
      return;
    }

    setSendingOTP(true);

    try {
      const response = await postAPI(`/users/forgot-password`,
        { email: forgetPassEmail }
      );
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      setForgetPassWindow(false);
    } finally {
      setSendingOTP(false);
    }
  }

  const verifyOtp = async () => {
    if (!OTP) {
      toast(t('peyo'), {
        icon: '⚠️'
      });
      return;
    }

    setVerifying(true);
    // Change this
    try {
      const response = await postAPI(`/users/verify-otp`, {
        email: forgetPassEmail,
        otp: OTP
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


  const handleKeyDownCP = (e) => {
    if (e.key === 'Enter') {
      updatePass();
    }
  };


  const handleKeyDownOTP = (e) => {
    if (e.key === 'Enter') {
      verifyOtp();
    }
  };

  const handleNotYou = () => {
    setForgetPassWindow(false);
    forgetPassEmail = '';
    setOTP('');
    setChangeToken('');
  }



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
      const response = await postAPI(`/users/reset-password`, {
        email: forgetPassEmail,
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


  




  return (
    <div id="studentLogin" className="opacity-0 scale-50 studentLogin bg-cover bg-center flex flex-col items-center justify-center bg-no-repeat w-screen h-screen overflow-hidden">
      {/* Forget Password code added */}
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
                        <input type="number" pattern="[0-9]*" onKeyDown={handleKeyDownOTP} className="w-full pl-14 pr-5 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black" onChange={(e) =>  setOTP(e.target.value)} value={OTP} placeholder={t('cyefo')} style={{ backgroundColor: '#F3F5FD' }} />
                      </div>
                      <div className="flex justify-end mr-2">
                        <button className="text-blue-600 underline cursor-pointer text-left" disabled={sender || sendingOTP} onClick={handleNotYou}>{t('notyou')}</button>
                      </div>

                    </div>
                    {/* Addded */}
                    <div className="flex justify-center items-center text-customBlue">
                      OTP is sent to {maskEmail(email)}
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
          // Uptill this part the code is changed and conditionally rendered

          :
          <div className={`duration-500 animate__animated animate__fadeInUpBig animate__slow h-screen w-screen flex flex-col items-center justify-center ${panel === "register" || i18n.language !== "en" ? '' : 'mt-[140px]'
            }`}>
            <AuthenticatedTemplate>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              {i18n.language === "en" ? (
                <div style={{ bottom: panel === 'register' ? '' : 'calc(50% + 200px)' }} className={`duration-500 text-center absolute ${panel === 'register' ? 'top-[-10px] left-[-80px] scale-50' : 'left-1/2 transform -translate-x-1/2'}`}>
                  <p className="font-bold text-white text-[40px] leading-none">Edulearn for</p>
                  <p className="font-bold text-white mb-1 leading-none text-[100px]">Learners</p>
                </div>
              ) : (
                <div className={panel === 'register' ? 'hidden' : 'block'}>
                  <p className="font-bold text-white text-[40px] leading-none">
                    {t('edulearnforlearners')}
                  </p>
                </div>
              )}


              <div className="mt-5 flex flex-col justify-center items-center">
                <div className="relative text-[24px] border-b-[2px] border-white w-11/12 flex items-center justify-between">
                  <div style={{ left: panel === 'login' ? '0' : 'calc(100% - 200px)' }} className={`font-bold absolute duration-500 bg-white rounded-t-[30px] w-[200px] h-full`} />
                  <p onClick={() => { if (!sender) setPanel("login") }} className={`${panel === 'login' ? 'text-black' : 'text-white'} cursor-pointer my-2 w-[200px] z-10 text-center`}>
                    {t('login')}
                  </p>
                  <p onClick={() => { if (!sender) setPanel("register") }} className={`${panel === 'register' ? 'text-black' : 'text-white'} cursor-pointer my-2 w-[200px] z-10 text-center`}>
                    {t('register')}
                  </p>
                </div>
                {panel === "login" ?
                  <>
                    <div className="flex flex-col justify-center items-center h-full">
                      <div className="flex flex-col justify-center items-center gap-y-2 mt-3 w-11/12 md:w-[500px]">
                        {verifyEmailPanel ?
                          <>
                            <div className="relative w-11/12 md:w-[500px]">
                              <div className="relative w-11/12 md:w-[500px] mt-1">
                                <img
                                  src={lock}
                                  alt="Password Icon"
                                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                />
                                <input
                                  type="number"
                                  id="otp"
                                  disabled={sender}
                                  className="w-full pl-14 pr-14 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  placeholder="Enter OTP"
                                  onKeyDown={async (e) => {
                                    if (e.key === "Enter") await verifyEmail();
                                  }}
                                />
                              </div>
                            </div>
                            <button onClick={verifyEmail} className="flex items-center justify-center custom-button mt-2 py-3 px-6 w-full text-center text-lg" disabled={sender}>{sender ? <Spinner className="w-[20px] h-[20px] border-2" /> : 'Verfiy Email'}</button>
                            <button onClick={() => setVerifyEmailPanel(false)} className="flex items-center justify-center mt-2 py-3 px-6 w-full text-center text-lg" disabled={sender}>Cancel</button>
                          </> :
                          <>
                            <div className="relative w-11/12 md:w-[500px]">
                              <img
                                src={mail}
                                alt="Current Password Icon"
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-4"
                              />
                              <input disabled={sender} type="email" id="email" onKeyDown={handleKeyDown} className="w-full pl-14 pr-5 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('enteremail')} />
                            </div>
                            <div className="relative w-11/12 md:w-[500px]">
                              <div className="relative w-11/12 md:w-[500px] mt-1">
                                <img
                                  src={lock}
                                  alt="Password Icon"
                                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                />
                                <input
                                  disabled={sender}
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
                            </div>

                            {/* Added Forgot Password Button */}
                            <div className="w-11/12 flex justify-between md:w-[500px] mt-1">
                              <button className="mt-2 font-semibold cursor-pointer bg-white p-2 rounded border border-black" onClick={() => navigate(-1) }>Go Back</button>
                              <button className="mt-2 font-semibold cursor-pointer bg-white p-2 rounded border border-black" disabled={sender} onClick={handleForgotPassword} >{t('forgotpassword')}</button>
                            </div>


                            <button onClick={jwtLogin} className="flex items-center justify-center custom-button mt-2 py-3 px-6 w-full text-center text-lg" disabled={sender}>{sender ? <Spinner className="w-[20px] h-[20px] border-2" /> : t('login')}</button>
                          </>}
                        <p className="text-white my-2 font-semibold text-[32px]">Or</p>
                      </div>
                    </div>
                  </> :
                  <>
                    <div className="flex flex-col justify-center items-center h-full">
                      <div className="flex flex-col justify-center items-center gap-y-2 mt-3 w-11/12 md:w-[500px]">
                        {verifyEmailPanel ?
                          <>
                            <div className="relative w-11/12 md:w-[500px]">
                              <div className="relative w-11/12 md:w-[500px] mt-1">
                                <img
                                  src={lock}
                                  alt="Password Icon"
                                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                />
                                <input
                                  type="number"
                                  id="otp"
                                  disabled={sender}
                                  className="w-full pl-14 pr-14 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  placeholder="Enter OTP"
                                  onKeyDown={async (e) => {
                                    if (e.key === "Enter") await verifyEmail();
                                  }}
                                />
                              </div>
                            </div>
                            <button onClick={verifyEmail} className="flex items-center justify-center custom-button mt-2 py-3 px-6 w-full text-center text-lg" disabled={sender}>{sender ? <Spinner className="w-[20px] h-[20px] border-2" /> : 'Verfiy Email'}</button>
                            <button onClick={() => setVerifyEmailPanel(false)} className="flex items-center justify-center mt-2 py-3 px-6 w-full text-center text-lg" disabled={sender}>Cancel</button>
                          </> :
                          <>
                            <div className="relative w-11/12 md:w-[500px]">
                              <FaUser className="text-customBlue absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                              <input disabled={sender} type="text" id="name" onKeyDown={handleKeyDownReg} className="w-full pl-14 pr-5 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('entername')} />
                            </div>
                            <div className="relative w-11/12 md:w-[500px]">
                              <img
                                src={mail}
                                alt="Current Password Icon"
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-4"
                              />
                              <input disabled={sender} type="email" id="emailReg" onKeyDown={handleKeyDownReg} className="w-full pl-14 pr-5 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black" value={emailReg} onChange={(e) => setEmailReg(e.target.value)} placeholder={t('enteremail')} />
                            </div>
                            <div className="relative w-11/12 md:w-[500px]">
                              <div className="relative w-11/12 md:w-[500px] mt-1">
                                <img
                                  src={lock}
                                  alt="Password Icon"
                                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                />
                                <input
                                  type={showPasswordReg ? "text" : "password"}
                                  id="passwordReg"
                                  disabled={sender}
                                  className="w-full pl-14 pr-14 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 text-md font-sm text-black"
                                  value={passwordReg}
                                  onChange={(e) => setPasswordReg(e.target.value)}
                                  placeholder={t('enterpassword')}
                                  onKeyDown={handleKeyDownReg}
                                />
                                <button
                                  type="button"
                                  className="absolute right-5 top-1/2 transform -translate-y-1/2"
                                  onClick={togglePasswordVisibilityReg}
                                >
                                  {showPasswordReg ? (
                                    <FaEyeSlash className="w-5 h-5 mr-2 text-gray-500" />
                                  ) : (
                                    <FaEye className="w-5 h-5 mr-2 text-gray-500" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <button onClick={register} className="flex items-center justify-center custom-button mt-2 py-3 px-6 w-full text-center text-lg" disabled={sender}>{sender ? <Spinner className="w-[20px] h-[20px] border-2" /> : 'Register'}</button>
                          </>}
                        <p className="text-white my-2 font-semibold text-[32px]">{t('or')}</p>
                      </div>
                    </div>
                  </>}
              </div>

              <SignInButton dataCaller={RequestProfileData} />
            </UnauthenticatedTemplate>
          </div>
      }
    </div>
  )
}

export default StudentLogin; 