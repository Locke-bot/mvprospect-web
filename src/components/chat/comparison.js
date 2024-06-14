import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import CloudDownloadIcon from "@mui/icons-material/CloudDownloadOutlined";
import ShareIcon from "@mui/icons-material/Share";

import SendIcon from "@mui/icons-material/Send";

import CloseIcon from "@mui/icons-material/HighlightOff";

import {
  fetchPlayerHistoryPreview,
  setCurrentChat,
  setCurrentHistoryId,
} from "../../redux/features/playerSlice";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertOutlined } from "@mui/icons-material";

import useWebSocket, { ReadyState } from "react-use-websocket";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { COMPARISON_WS_API as API, refreshToken } from "../api";
import { marked } from "marked";
import { toast } from "react-toastify";

let Mic;
if ("webkitSpeechRecognition" in window) {
  Mic = require("./mic").default;
}

let responseTimeout = null;
const TIMEOUT = 20000;

function Chat() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [socketUrl, setSocketUrl] = useState(
    `${API}?token=${JSON.parse(localStorage.getItem("authTokens")).access}`
  );

  const [controlsText, setControlsText] = React.useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => true,
    reconnectAttempts: 4,
  });

  const [visibleMenu, setVisibleMenu] = React.useState(false);
  const [answer, setAnswer] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const { currentChat, currentHistoryId, playerIdMap, selectedPlayers } =
    useSelector((state) => state.playerData);

  const [answers, setAnswers] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [recording, setRecording] = React.useState(null);
  const [triggerSend, setTriggerSend] = useState(false);

  const defaultPrompts = ["Compare their mindsets.", 
    "What are their dominant traits.",
    "Who has a better mindset for baseball."];

  // const defaultPrompts = ["Compare and contrast both players.", 
  //   "What are their dominant traits.",
  //   "Who is a better pick?"];

  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    if (authTokens) {
      const user = jwt_decode(authTokens.access);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (isExpired) {
        refreshToken(authTokens).then((newAccess) => {
          const newSocketUrl = `${API}?token=${newAccess}`;
          setSocketUrl(newSocketUrl);
        });
      } else {
        const newSocketUrl = `${API}?token=${authTokens.access}`;
        setSocketUrl(newSocketUrl);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(setCurrentChat([]));
  }, [selectedPlayers]);

  useEffect(() => {
    if (triggerSend) {
      send();
      setTriggerSend(false);
    }
  }, [triggerSend]);

  useEffect(() => {
    if (lastMessage !== null) {
      if (
        ["APIError", "Error", "TimeoutError"].includes(
          JSON.parse(lastMessage?.data)?.message
        )
      ) {
        if (responseTimeout) {
          clearTimeout(responseTimeout);
          responseTimeout = null;
        }
        setControlsText("Regenerate response");
        toast.error(
          JSON.parse(lastMessage.data).message === "APIError"
            ? "OpenAI Error"
            : JSON.parse(lastMessage.data).message === "TimeoutError"
            ? "Response timed out, please run again."
            : "An error occurred"
        );
      }
      if (JSON.parse(lastMessage?.data)?.message === "DONE") {
        if (responseTimeout) {
          clearTimeout(responseTimeout);
          responseTimeout = null;
        }

        dispatch(
          setCurrentHistoryId(JSON.parse(lastMessage.data).history_uuid)
        );
        dispatch(fetchPlayerHistoryPreview({ reset: false, multiple: true }));
        setControlsText("");
      }
      if (JSON.parse(lastMessage?.data)?.message === "token") {
        // reset timer
        if (responseTimeout) {
          clearTimeout(responseTimeout);
        }
        // start count down again
        responseTimeout = setTimeout(() => {
          toast.error("Response timed out, please run again.");
        }, TIMEOUT);
        setAnswer((answer) => answer + JSON.parse(lastMessage?.data)?.token);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (!answer && controlsText !== "Stop generating") {
      return;
    }
    let curr = [...currentChat];
    if (curr.length) {
      const innerArrayCopy = [...curr[curr.length - 1]];
      innerArrayCopy[1] = answer;
      curr[curr.length - 1] = innerArrayCopy;
      dispatch(setCurrentChat(curr));
    }
  }, [answer]);

  useEffect(() => {
    setQuestions(currentChat.map((item) => item[0]));
    setAnswers(currentChat.map((item) => item[1]));
  }, [currentChat]);

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [answers, questions]);

  useEffect(() => {
    [...window.document.getElementsByTagName("textarea")].map((el) => {
      el.style.minHeight = el.scrollHeight + "px";
    });
  }, [answers]);

  useEffect(() => {
    if (
      !(!selectedPlayers.length || controlsText === "Stop generating") &&
      inputRef.current
    ) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 500);
    }
  }, [selectedPlayers, controlsText]);

  const send = () => {
    setRecording(false);
    if (
      question.trim() &&
      selectedPlayers.length &&
      controlsText !== "Stop generating"
    ) {
      if (controlsText === "Regenerate response") {
        dispatch(
          setCurrentChat(currentChat.slice(0, -1).concat([[question.trim()]]))
        );
      } else {
        dispatch(setCurrentChat(currentChat.concat([[question.trim()]])));
      }

      setAnswer("");
      setQuestion("");
      setControlsText("Stop generating");
      sendMessage(
        JSON.stringify({
          action: "doc",
          question: question.trim(),
          chat_history_id: currentHistoryId,
          player_ids: selectedPlayers.map((item) => playerIdMap[item]),
        })
      );
    }
  };

  return (
    <Box className={classes.mainBox}>
      <Box className={classes.innerBox}>
        <Box className={classes.questionAnswer} ref={chatRef}>
          {questions?.length ? (
            questions.map((question, index) => {
              return (
                <>
                  <Box className={classes.question}>
                    <Typography style={{ lineHeight: "29px" }}>
                      {question}
                    </Typography>
                    <Box
                      className={classes.menu}
                      onMouseEnter={() => setVisibleMenu(index)}
                      onMouseLeave={() => setVisibleMenu(null)}
                    >
                      <Box
                        className={classes.submenu}
                        style={{
                          display: visibleMenu === index ? undefined : "none",
                        }}
                      >
                        <CloudDownloadIcon
                          className={classes.menuIcon}
                          onClick={() => {
                            const url = window.URL.createObjectURL(
                              new Blob([answers[index]], { type: "text/plain" })
                            );
                            const link = window.document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", `${question}`);
                            window.document.body.appendChild(link);
                            link.click();
                          }}
                        />
                        <a
                          href={`mailto:?subject=MVP Chat Text&body=${answers[index]}`}
                          target="_blank"
                          style={{ textDecoration: "none", display: "flex" }}
                        >
                          <ShareIcon className={classes.menuIcon} />
                        </a>
                      </Box>
                      <MoreVertOutlined />
                    </Box>
                  </Box>
                  {answers[index] ? (
                    <Box className={classes.answer}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: marked(answers[index]),
                        }}
                        className={`${classes.chatAnswer} text-area`}
                        style={{ width: "100%" }}
                      />
                    </Box>
                  ) : (
                    <></>
                  )}
                </>
              );
            })
          ) : selectedPlayers?.length ? (
            <Box className={classes.promptContainer}>
              {defaultPrompts.map((prompt) => {
                return (
                  <Box
                    onClick={() => {
                      setQuestion(prompt);
                      setTriggerSend(true);
                    }}
                    className={classes.promptBox}
                  >
                    {prompt}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <></>
          )}
        </Box>
        <Box
          className={classes.typedQuestionBox}
          style={{
            opacity:
              !selectedPlayers.length || controlsText === "Stop generating"
                ? 0.5
                : 1,
          }}
        >
          <TextField
            inputRef={inputRef}
            autoComplete="off"
            multiline
            // maxRows={1 ? !question.trim() : 3}
            className={classes.typedQuestion}
            sx={{ lineHeight: "27px" }}
            InputProps={{
              classes: { input: classes.typedQuestionInput },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    className={classes.closeIcon}
                    style={{
                      display: !question ? "none" : undefined,
                    }}
                    onClick={() => setQuestion("")}
                  >
                    <CloseIcon />
                  </IconButton>
                  {Mic ? (
                    <IconButton
                      style={{
                        backgroundColor: "transparent",
                        border: "2px solid #FFFFFF",
                        borderRadius: "50%",
                        color: "rgba(0, 0, 0, 0.26)",
                        zIndex: 1,
                      }}
                      disabled={!selectedPlayers.length}
                      onClick={() => setRecording(!recording)}
                    >
                      <Mic
                        question={question}
                        recording={recording}
                        setQuestion={setQuestion}
                        setRecording={setRecording}
                        style={{ color: !recording ? undefined : "blue" }}
                      />
                    </IconButton>
                  ) : (
                    <></>
                  )}
                </InputAdornment>
              ),
            }}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setQuestion(e.target.value);
                send();
              }
            }}
            disabled={
              !selectedPlayers.length || controlsText === "Stop generating"
            }
            placeholder={
              !selectedPlayers.length
                ? "Comparison: Select two player to make a chat"
                : question.trim()
                ? ""
                : "Enter your question or prompt here."
            }
            value={question}
          />
          <IconButton
            disabled={!question?.trim()}
            style={{
              backgroundColor: "transparent",
              color: !question?.trim() ? "rgba(0, 0, 0, 0.26)" : "darkgreen",
              zIndex: 1,
            }}
            onClick={send}
          >
            <SendIcon
              style={{
                zIndex: 1,
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export const useStyles = makeStyles({
  mainBox: {
    // height: "100vh",
    height: "100%",
    // paddingBottom: "20px",
    // paddingTop: "20px",
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "auto",
    // border: "1px solid transparent",
    backgroundColor: "#F9FAFC",
  },
  innerBox: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  questionAnswer: {
    paddingLeft: "75px",
    paddingRight: "75px",
    flexGrow: "1",
    overflow: "auto",
  },
  question: {
    marginTop: "17px",
    background: "#F4F5F8",
    borderRadius: "10px 10px 10px 10px",
    padding: "15px 20px 15px 20px",
    font: "normal normal normal 16px/16px Roboto !important",
    letterSpacing: 0,
    color: "#000",
    display: "flex",
    justifyContent: "space-between",
  },
  answer: {
    borderRadius: "10px 10px 10px 0px",
    marginTop: "29px",
    marginBottom: "29px",
    font: "normal normal normal 16px/25px Roboto !important",
    letterSpacing: 0,
    color: "#7B8793",
    display: "flex",
    alignItems: "end",
    backgroundColor: "#FFFFFF",
  },
  chatAnswer: {
    border: "none",
    backgroundColor: "#FFFFFF",
    padding: "15px 20px 15px 20px",
    font: "normal normal normal 16px/25px Roboto",
    borderRadius: "10px",
    letterSpacing: 0,
    color: "#36454F",
    resize: "none",
    outline: "none",
  },
  typedQuestion: {
    width: "100%",
    [`& fieldset`]: {
      backgroundColor: "#FFFFFF",
      borderRadius: "30px",
      border: "1px solid #DBE5ED !important",
    },
  },
  typedQuestionBox: {
    padding: "20px !important",
    position: "relative",
    display: "flex",
  },
  typedQuestionInput: {
    // height: "27px !important",
    zIndex: 2,
    minHeight: "unset !important",
  },
  controls: {
    position: "absolute",
    top: "-50px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    border: "thin solid rgba(86,88,105)",
    padding: "",
    fontSize: ".875rem",
    lineHeight: "1.25rem",
    color: "rgb(38, 38, 28)",
    padding: "0.5rem 0.75rem",
    cursor: "pointer",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
    "&:hover": {
      backgroundColor: "#FAF9F6",
    },
  },
  closeIcon: {
    backgroundColor: "transparent",
    border: "2px solid #FFFFFF",
    borderRadius: "50%",
    color: "rgba(0, 0, 0, 0.26) !important",
    zIndex: 1,
    "&:hover": {
      color: "#000 !important",
    },
  },
  menu: {
    display: "flex",
    gap: "8px",
    color: "#B6BFC8",
    alignItems: "center",
    "&:hover": {
      color: "#6E6E6E",
    },
  },
  submenu: {
    alignItems: "center",
    display: "flex",
    gap: "8px",
    color: "#B6BFC8",
  },
  menuIcon: {
    cursor: "pointer",
    "&:hover": {
      color: "#6E6E6E",
    },
  },
  promptContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    height: "100%",
    width: "100%",
  },
  promptBox: {
    flex: "0 0 25%",
    height: "101px",
    padding: "10px",
    boxSizing: "border-box",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "0 solid #e3e3e3",
    boxSizing: "border-box",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderColor: "rgba(0,0,0,.1)",
    color: "#646464",
    fontSize: "15px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#d0d0d0",
    }
  },  
});

export default Chat;
