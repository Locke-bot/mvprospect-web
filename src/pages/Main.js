import React from "react";
import "../App.scss";

import { useSelector } from "react-redux";

import Chat from "../components/chat";
import ChatComparison from "../components/chat/comparison";

function Main() {
  const { compareMode } = useSelector((state) => state.playerData);
  return (
    <>
      <div style={{height: "100%", maxHeight: "calc(100% - 70px)"}}>
        {compareMode ? <ChatComparison /> : <Chat />}
      </div>
    </>
  );
}

export default Main;
