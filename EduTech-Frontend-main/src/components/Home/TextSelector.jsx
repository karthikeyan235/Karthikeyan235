import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DialogBox from './DialogBox';

const TextSelector = ({ selectedText, dialogPosition }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef(null); // Reference to the dialog box

  useEffect(() => {
    if (selectedText) {
      fetchAiResponse(selectedText);
      setShowDialog(true);
    } else {
      setShowDialog(false);
      setAiResponse('');
    }
  }, [selectedText]);

  useEffect(() => {
    // Function to handle clicks outside of the dialog box
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
      }
    };

    // Add event listener when the dialog is open
    if (showDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener when dialog closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDialog]);

  const fetchAiResponse = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://meridianexplainer-bpf8cyf5b3febwfw.eastus2-01.azurewebsites.net/query?query=${encodeURIComponent(query)}`
      );
      setAiResponse(response.data.bot_answer);
    } catch (error) {
      setAiResponse('Sorry, something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showDialog && (
        <div ref={dialogRef}>
          <DialogBox
            position={dialogPosition}
            content={aiResponse || 'Fetching response...'}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default TextSelector;
