import React, { useEffect, useState } from "react";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

var speechRecognition = new window.webkitSpeechRecognition();

function Mic({ question, recording, setQuestion, setRecording }) {
  const [ongoing, setOngoing] = useState(false);
  const [actualQuestion, setActualQuestion] = useState("")
  
  useEffect(() => {
    if (!question) {
      setActualQuestion("")
    }
  }, [question])


  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      if (!recording && ongoing) {
        // Stop the Speech Recognition
        speechRecognition.stop();
        setOngoing(false);
        setRecording(false);
        return
      }      
      // Initialize webkitSpeechRecognition

      // String for the Final Transcript
      let final_transcript = "";

      // Set the properties for the Speech Recognition object
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US";

      // Callback Function for the onStart Event
      speechRecognition.onstart = () => {
        // Show the Status Element
      };
      speechRecognition.onerror = () => {
        // Hide the Status Element
      };
      speechRecognition.onend = () => {
        // Hide the Status Element
      };

      speechRecognition.onresult = (event) => {
        // Create the interim transcript string locally because we don't want it to persist like final transcript
        let interim_transcript = "";

        // Loop through the results from the speech recognition object.
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }

        // Set the Final transcript and Interim transcript.
        if (interim_transcript) {
          setQuestion(actualQuestion.trim() ? actualQuestion.trim()+interim_transcript : interim_transcript);
        }
        if (!interim_transcript && final_transcript) {
          setActualQuestion(question.trim() ? question.trim()+final_transcript : final_transcript)
          setQuestion(question.trim() ? question.trim()+final_transcript : final_transcript);
        }
      };

      // Set the onClick property of the start button
      if (recording && !ongoing) {
        // Start the Speech Recognition
        setOngoing(true);
        speechRecognition.start();
      }
    } else {
      console.log("Speech Recognition Not Available");
    }
  }, [actualQuestion, recording]);

  return (
    <>
      {recording ? <div className="pulse-ring"></div> : <></>}
      <KeyboardVoiceIcon style={{color: !recording ? undefined : "blue", zIndex: 999}} />
    </>
  )
}

export default Mic;
