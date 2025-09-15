import React, { useState, useEffect, useRef } from 'react';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { useTranslation } from 'react-i18next';

const SpeechRecognition = ({ setStart, isListening, handleSendMessage, setInput, input, setIsListening }) => {
  const { i18n, t } = useTranslation();
  const API = import.meta.env.VITE_SPEECH_KEY;
  const REGION = import.meta.env.VITE_SPEECH_REGION;
  const inputRef = useRef(null); // Ref to the input field

  const lang = i18n.language;

  const stt = {
    'en': 'en-US',
    'ar': 'ar-AE',
    'pl': 'pl-PL',
    'hi': 'hi-IN'
  };

  const sttVoice = stt[lang];

  // Helper function to count words
  const countWords = (text) => {
    if (text.length === 0) return 0;
    return text.trim().split(/\s+/).length;
  };

  const maxWords = 250; // Word limit

  useEffect(() => {
    let recognizer;
    let interimResult = ''; // Variable to hold the interim result

    if (isListening) {
      const speechConfig = speechsdk.SpeechConfig.fromSubscription(API, REGION);
      speechConfig.speechRecognitionLanguage = sttVoice;
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognized = (s, e) => {
        if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
          const currentWordCount = countWords(input);
          const recognizedWords = countWords(e.result.text);
          if (currentWordCount + recognizedWords <= maxWords) {
            setInput(prevInput => prevInput + ' ' + e.result.text);
          } else {
            const wordsToAdd = maxWords - currentWordCount;
            if (wordsToAdd > 0) {
              const limitedText = e.result.text.split(/\s+/).slice(0, wordsToAdd).join(' ');
              setInput(prevInput => prevInput + ' ' + limitedText);
            }
          }
          interimResult = ''; // Reset interim results after final recognition
          scrollToEnd(); // Scroll input caret to end after new text is appended
        }
      };

      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log(t('srsta'));
          setStart(true);
        },
        (error) => {
          console.error(error);
          setIsListening(false);
        }
      );
    }

    return () => {
      if (recognizer) {
        recognizer.stopContinuousRecognitionAsync(
          () => {
            console.log(t('srsoc'));
            setIsListening(false);
            setStart(false);
          },
          (error) => console.error(error)
        );
      }
    };
  }, [isListening, setInput, setIsListening, setStart, sttVoice, input]);

  // Function to scroll caret to the end of the input
  const scrollToEnd = () => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.focus();
      // Move caret to the end of the input field
      inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
    }
  };

  return (
    <div className='relative'>
      <input
        type="text"
        ref={inputRef} // Attach ref to input element
        placeholder={t('typeamessage')}
        className="text-md w-full px-2 py-1 outline-0"
        value={input}
        onChange={(e) => {
          if (countWords(e.target.value) <= maxWords) {
            setInput(e.target.value);
            scrollToEnd();  // Ensure the caret scrolls to the end when typing
          }
        }}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <div className={`${countWords(input) === 250 ? "text-red-500" : ''} ${countWords(input) > 200 ? "block" : 'hidden'} text-xs absolute top-[-30px] right-[-20px] text-gray-500`}>
        {countWords(input)}/{maxWords}
      </div>
    </div>
  );
};
export default SpeechRecognition;