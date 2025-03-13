import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    console.log("Active conversation:", activeConversation);
  }, [activeConversation]);

  return (
    <div className="chat-container">
      <Sidebar setActiveConversation={setActiveConversation} />
      <ChatBox activeConversation={activeConversation} />
    </div>
  );
};

export default ChatPage;
