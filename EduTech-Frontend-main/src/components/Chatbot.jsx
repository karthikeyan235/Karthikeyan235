import React, { useState, useEffect, useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { ThreeDots } from "react-loader-spinner";
import { postAPI } from "../caller/axiosUrls";
import toast from "react-hot-toast";
import SpeechRecognition from "./SpeechRecognition";
import { HiSpeakerWave } from "react-icons/hi2";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";
import { useTranslation } from "react-i18next";
import ToggleButton from "./ToggleButton";
import axios from "axios";
import { PlanContext } from "../contexts/PlanContext";
import { showError } from "./Utils/Premium";
import { RxSpeakerOff } from "react-icons/rx";
import chatbotimage from "../assets/Chatbot.gif"
import chatbotIcon from '../assets/ChatbotIcon.png';
import arrow from "../assets/Send.png"
import { IoMic } from "react-icons/io5";
import Markdown from "react-markdown";

let synthesizer;
let avatarSynthesizer;
let peerConnection;
 
const cogSvcRegion = import.meta.env.VITE_COGSERV_REGION;
const cogSvcSubKey = import.meta.env.VITE_COGSERV_SUBKEY;
const talkingAvatarCharacter = import.meta.env.VITE_AVATAR_CHAR;
const talkingAvatarStyle = import.meta.env.VITE_AVATAR_STYLE;

const API = import.meta.env.VITE_SPEECH_KEY;
const REGION = import.meta.env.VITE_SPEECH_REGION;
 
const ChatBot = ({ bid }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sender, setSender] = useState(false);
  const [start, setStart] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toggleAvatar, setToggleAvatar] = useState(false);
  const [isSpeaking, setSpeaking] = useState(false);
  const [isSessionActive, setSessionActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeListenButton, setActiveListenButton] = useState(null);
 
  const { plan } = useContext(PlanContext);
  const lang = i18n.language;
 
  const tts = {
    en: "en-GB-OliviaNeural",
    ar: "ar-AE-FatimaNeural",
    pl: "pl-PL-ZofiaNeural",
    hi: "hi-IN-AnanyaNeural",
  };
 
  const ttsVoice = tts[lang];
 
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setToggleAvatar(false);
  };
 
  const handleToggleAvatar = () => {
    setToggleAvatar(!toggleAvatar);
  };
 
  const startSession = async () => {
    if (cogSvcSubKey === "") {
      alert("Please fill in the API key of your speech resource.");
      return;
    }
 
    setSessionActive(false);
 
    const speechSynthesisConfig = speechsdk.SpeechConfig.fromSubscription(
      cogSvcSubKey,
      cogSvcRegion
    );
    const videoFormat = new speechsdk.AvatarVideoFormat();
    const avatarConfig = new speechsdk.AvatarConfig(
      talkingAvatarCharacter,
      talkingAvatarStyle,
      videoFormat
    );
    avatarSynthesizer = new speechsdk.AvatarSynthesizer(
      speechSynthesisConfig,
      avatarConfig
    );
 
    avatarSynthesizer.avatarEventReceived = (s, e) => {
      const offsetMessage =
        e.offset === 0
          ? ""
          : `, offset from session start: ${e.offset / 10000}ms.`;
      console.log(
        `[${new Date().toISOString()}] Event received: ${
          e.description
        }${offsetMessage}`
      );
    };
 
    try {
      const response = await axios.get(
        `https://${cogSvcRegion}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": cogSvcSubKey,
          },
        }
      );
 
      const { Urls, Username, Password } = response.data;
      const iceServerUrl = Urls[0];
      setupWebRTC(iceServerUrl, Username, Password);
    } catch (error) {
      console.error("Error fetching ICE server credentials:", error);
    }
  };
 
  const setupWebRTC = (
    iceServerUrl,
    iceServerUsername,
    iceServerCredential
  ) => {
    try {
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null; // Reset it before creating a new one
      }
 
      peerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: [iceServerUrl],
            username: iceServerUsername,
            credential: iceServerCredential,
          },
        ],
      });
 
      peerConnection.ontrack = (event) => {
        try {
          const remoteVideoDiv = document.getElementById("remoteVideo");
          for (let i = 0; i < remoteVideoDiv.childNodes.length; i++) {
            if (remoteVideoDiv.childNodes[i].localName === event.track.kind) {
              remoteVideoDiv.removeChild(remoteVideoDiv.childNodes[i]);
            }
          }
 
          const mediaPlayer = document.createElement(event.track.kind);
          mediaPlayer.id = event.track.kind;
          mediaPlayer.srcObject = event.streams[0];
          mediaPlayer.autoplay = true;
          remoteVideoDiv.appendChild(mediaPlayer);
          mediaPlayer.playsInline = true;
 
          const canvas = document.getElementById("canvas-avatar");
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          canvas.hidden = false;
        } catch (error) {
          console.error("Error processing track:", error);
        }
      };
 
      peerConnection.oniceconnectionstatechange = () => {
        try {
          console.log(`WebRTC status: ${peerConnection.iceConnectionState}`);
          if (peerConnection.iceConnectionState === "connected") {
            setSessionActive(true);
          } else if (
            peerConnection.iceConnectionState === "failed" ||
            peerConnection.iceConnectionState === "disconnected"
          ) {
            console.warn("ICE connection failed, restarting...");
            peerConnection.restartIce(); // Optionally restart ICE negotiation
          }
        } catch (error) {
          console.error("Error handling ICE connection state change:", error);
        }
      };
 
      peerConnection.addTransceiver("video", { direction: "sendrecv" });
      peerConnection.addTransceiver("audio", { direction: "sendrecv" });
 
      avatarSynthesizer
        .startAvatarAsync(peerConnection)
        .then((r) => {
          if (r.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
            console.log(
              `[${new Date().toISOString()}] Avatar started. Result ID: ${
                r.resultId
              }`
            );
          }
        })
        .catch((error) => {
          console.error("Error starting avatar:", error);
          setSessionActive(false); // Reset session if error occurs
        });
    } catch (error) {
      console.error("Error in setupWebRTC:", error);
      setSessionActive(false); // Reset session in case of failure
    }
  };
 
  const speakAvatar = (spokenText) => {
    if (isSpeaking) return;

    setSpeaking(true);

    const spokenSsml = `
        <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US' xmlns:emo='http://www.w3.org/2009/10/emotionml'>
            <voice name='${ttsVoice}'>
                <mstts:leadingsilence-exact value='0'/>
                ${htmlEncode(spokenText)}
            </voice>
        </speak>`;
 
    avatarSynthesizer
      .speakSsmlAsync(spokenSsml)
      .then((result) => {
        if (
          result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted
        ) {
          console.log(
            `[${new Date().toISOString()}] Speech synthesized for text: ${spokenText}`
          );
          setSpeaking(false);
          setActiveListenButton(null);
        }
      })
      .catch(console.error);
  };
 
  const stopSpeakAvatar = () => {
    avatarSynthesizer
      .stopSpeakingAsync()
      .then(() => {
        console.log(
          `[${new Date().toISOString()}] Stop speaking request sent.`
        );
        setSpeaking(false);
        setActiveListenButton(null);
      })
      .catch(console.error);
  };
 
  const toggleSpeechRecognition = () => {
    setIsListening((prevState) => {
      if (prevState) {
        console.log(t("stosr"));
      } else {
        console.log(t("stasr"));
      }
      return !prevState;
    });
  };
 
  const htmlEncode = (text) => {
    const entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
    };
    return String(text).replace(/[&<>"'/]/g, (match) => entityMap[match]);
  };
 
  function speakText(txt) {
    if (speak) return;

    setSpeak(true);
    // Create a player for the synthesized speech output
    let player = new speechsdk.SpeakerAudioDestination();
  
    // Debugging: Log audio events
    player.onAudioStart = () => {
        console.log("Audio playback started");
    };
      
    player.onAudioEnd = () => {
        console.log("Audio playback finished");
        setSpeak(false);
        setActiveListenButton(null);

        if (synthesizer) {
          synthesizer.close();
          synthesizer = undefined;
        }
    };  

    // Set up the audio configuration with the player
    var audioConfig = speechsdk.AudioConfig.fromSpeakerOutput(player);

    const speechConfig = speechsdk.SpeechConfig.fromSubscription(API, REGION);
    speechConfig.speechSynthesisVoiceName = ttsVoice; // Choose a different voice if needed
    
    // Create the synthesizer instance with the provided configuration
    synthesizer = new speechsdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.synthesisStarted = function () {
      console.log("Speech synthesis started");
    };

    const complete_cb = function (result) {
        if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
          console.log(t('ssttts'));
        } else {
          console.error(t('speechsc') + result.errorDetails);
        }
    };

    // Error callback function
    const err_cb = function (err) {
        console.log("Error occurred: " + err);
        if (synthesizer) {
          synthesizer.close();
          synthesizer = undefined;
        }
    };

    // Define event handler for when synthesis starts
    synthesizer.synthesisStarted = function (s, e) {
        console.log("Speech synthesis started");
    };

    // Start the synthesis process
    try {
      synthesizer.speakTextAsync(txt, complete_cb, err_cb);
    } catch (error) {
      console.error("Unhandled exception during speakText:", error);
      if (synthesizer) {
          synthesizer.close();
          synthesizer = undefined;
      }
    }
  }

  const stopSpeak = () => {    
    const audio = synthesizer?.privAdapter?.privSessionAudioDestination?.privDestination?.privAudio
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      synthesizer?.close()
      synthesizer = undefined
      setSpeak(false);
      setActiveListenButton(null);
      console.log(`[${new Date().toISOString()}] Stop speaking request sent.`);
    }
  };
 
  const botQuery = async (query) => {
    setSender(true);
    try {
      const response = await postAPI(
        `/chatbot/queryChatBot?bookId=${bid}&query=${query}`,
        { history: history.slice(-3) }
      );
      setHistory([
        ...history,
        {
          user_query: query,
          bot_answer: response.bot_answer,
        },
      ]);
      return response.bot_answer;
    } catch (error) {
      toast.error(error.message);
      throw new Error(t("scctc"));
    } finally {
      setSender(false);
    }
  };
 
  const handleSendMessage = async () => {
    if (sender) return;
    try {
      if (input.trim()) {
        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");
        const answer = await botQuery(input);
        if (answer) {
          setMessages([
            ...messages,
            { text: input, sender: "user" },
            { text: answer, sender: "bot", speaker: true },
          ]);
        }
        if (toggleAvatar && isSessionActive && !isSpeaking) speakAvatar(answer);
      }
    } catch (error) {
      setMessages([
        ...messages,
        { text: input, sender: "user" },
        { text: t("scctc"), sender: "bot", speaker: false },
      ]);
      console.log(error.message);
    }
  };
 
  const handleSpeak = (text, index) => {
    if (toggleAvatar && isSessionActive) {
        setActiveListenButton(index); // Track which button was clicked
        speakAvatar(text);
    } else {
        setActiveListenButton(index); // Track which button was clicked
        speakText(text);
    }
  };
 
  // Delay the session initialization on page load
  useEffect(() => {
    let sessionTimeout;
    if (!isSessionActive) {
      sessionTimeout = setTimeout(() => {
        startSession();
      }, 3000); // Introduce slight delay before starting session
    }
 
    return () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
      if (avatarSynthesizer) avatarSynthesizer.close();
      if (peerConnection) peerConnection.close();
    };
  }, []);
 
  useEffect(() => {
    setMessages([{ text: t("htamaftb"), sender: "bot", speaker: false }]);
  }, [lang]);
 
  useEffect(() => {
    if (isOpen) {
      const chatBody = document.querySelector(".chat-body");
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }
  }, [messages, isOpen]);
 
  return (
    <>
      <div className="fixed bottom-10 right-10 z-20">
        <div
          className={`bg-white absolute top-[-300px] right-0 rounded-[20px] shadow-lg overflow-hidden transform transition-transform duration-300  ${
            isOpen
              ? "scale-100 translate-y-0 translate-x-0"
              : "scale-0 translate-y-[200px] translate-x-[200px]"
          } w-80 h-96 flex flex-col`}
        >
          <div className=" bg-customBlue text-white px-3 py-2 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-x-4  ">
              <img src={chatbotIcon} className="text-white mb-1 text-2xl" /> {t("Edulearn Bot")}
            </h3>
            <div className='flex items-center hidden md:block' onClick={() => (plan === 'trial') ? showError() : null} data-tooltip={isSessionActive ? 'Show Avatar' : 'Initializing Avatar'}>
              {plan === "trial" ? (
                <div className="premium opacity-100 not-allowed">
                  <ToggleButton
                    defaultChecked={false}
                    color={2}
                    disabled={true}
                  />
                </div>
              ) : (
                isSessionActive ? (
                  <ToggleButton
                    defaultChecked={toggleAvatar}
                    onChange={handleToggleAvatar}
                    color={2}
                  />
                ) : <div className="spinner my-2"></div>
              )}
            </div>
            <IoIosArrowDown onClick={toggleChat} className="cursor-pointer text-2xl" />
          </div>
          <div className="chat-body flex flex-col flex-1 p-3 overflow-y-auto">
            {/* {plan === "trial" ? (
              <>
                <p className="text-[12px] text-gray-400 text-center">
                  {t("ycho1c")}
                </p>
                <p
                  onClick={() =>
                    (location.href = location.origin + "/home#contact")
                  }
                  className="cursor-pointer text-sm mb-3 text-gray-400 text-center underline"
                >
                  {t("trypremium")}
                </p>
              </>
            ) : null} */}
 
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 w-fit ${message.sender === 'user' ? 'self-end' : ''}`}>
                <div className={`px-3 flex flex-col py-2 rounded-[20px] break-words text-pretty text-sm ${message.sender === 'user' ? 'bg-customBlue text-white rounded-br-none' : 'bg-[#F4F4F4] text-black rounded-bl-none'}`}>
                    <Markdown>{message.text}</Markdown>
                    {message.speaker ? 
                        plan === 'trial' ? 
                        (<div onClick={showError} className={`flex mt-2 border bg-gray-100 premium-small not-allowed cursor-pointer gap-x-1 rounded p-2 text-sm items-center self-end`}>
                            <p className='font-semibold'>{t('listen')}</p>
                            <HiSpeakerWave />
                        </div>)
                        :
                        (activeListenButton === index) ? 
                        (<div 
                            onClick={() => {
                              stopSpeak();
                              stopSpeakAvatar();
                            }}
                            className={`flex border mt-2 bg-white cursor-pointer gap-x-1 rounded p-2 text-sm items-center self-end`}
                        >
                            <p className='font-semibold'>Stop</p>
                            <RxSpeakerOff />
                        </div>)
                        :
                        (<div 
                            onClick={() => {
                              if (!speak && !isSpeaking) handleSpeak(message.text, index)
                            }}
                            className={`flex border mt-2 bg-white cursor-pointer gap-x-1 rounded p-2 text-sm items-center self-end ${(activeListenButton !== index) && (speak || isSpeaking) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={(activeListenButton !== index) && speak && isSpeaking}
                        >
                            <p className='font-semibold'>{t('listen')}</p>
                            <HiSpeakerWave />
                        </div>) : null}
                  </div>
              </div>          
            ))}
 
            {sender ? (
              <ThreeDots
                visible={true}
                height="50"
                width="50"
                color="#366EC4"
                radius="9"
                ariaLabel="three-dots-loading"
              />
            ) : null}
          </div>
 
          {plan === "trial" ? (
            <div className="flex items-center bg-white border border-gray-300 rounded-[20px] px-2 py-2 shadow-sm w-full h-12">
              <button
                onClick={showError}
                className="not-allowed rounded p-1 premium-small"
              >
                <IoMic className="text-xl" />
              </button>
              <div className="border-l border-gray-300 h-8 mx-2 " />{" "}
              <SpeechRecognition sender={sender} input={input} setInput={setInput} handleSendMessage={handleSendMessage} />
              <button className="rounded p-1">
                <img src={arrow}
                  disabled={sender}
                  onClick={handleSendMessage}
                  className="text-blue-500 text-lg cursor-pointer"
                />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex items-center bg-white border border-gray-300 rounded-[20px] px-2 py-2 shadow-sm w-full h-12">
                <IoMic
                  onClick={toggleSpeechRecognition}
                  className={`${
                    isListening && start
                      ? "text-red-600"
                      : isListening
                      ? "text-gray-400"
                      : "text-blue-500"
                  } text-2xl cursor-pointer ml-1`}
                />
                {/* Vertical Line */}
                <div className="border-l border-gray-300 h-8 mx-2 " />{" "}
                {/* Vertical line with height matching the input box */}
                <SpeechRecognition sender={sender} input={input} setStart={setStart} setInput={setInput} isListening={isListening} setIsListening={setIsListening} handleSendMessage={handleSendMessage} />
                <button className="rounded p-1">
                  <img src={arrow}
                    disabled={sender}
                    onClick={handleSendMessage}
                    className="text-blue-500 text-lg cursor-pointer"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
 
        <div
          className="w-16 h-16  rounded-full flex items-center justify-center cursor-pointer"
          onClick={toggleChat}
        >
          <img
            className="w-[110px] h-[110px] object-cover"
            src={chatbotimage}
            alt="Bot Icon"
          />
        </div>
      </div>
      <div
        className={`${
          toggleAvatar ? "left-10" : "left-[-400px]"
        } justify-center hidden md:flex bottom-8 fixed w-[280px] h-[350px] z-30`}
      >
        {<button className='bg-white absolute z-10 top-[-50px] p-2 rounded-[15px] border text-md mute shadow font-semibold flex items-center gap-x-2' onClick={stopSpeakAvatar}><RxSpeakerOff className='text-xl' /> {t('mute')}</button>}
        <div id="videoContainer" className="w-full h-full">
          <div id="remoteVideo" className="w-full h-full"></div>
          <canvas id="canvas-avatar" hidden></canvas>
        </div>
      </div>
    </>
  );
};
 
export default ChatBot;