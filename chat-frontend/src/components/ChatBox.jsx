import React, { useState, useEffect } from "react";
import Message from "./Message";
import axios from "../api/api";
import "./ChatBox.css";
import socket from "../socket";

const ChatBox = ({ activeConversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const loggedInUserPhoneNumber = localStorage.getItem("userPhoneNumber");

  useEffect(() => {
    if (!activeConversation) return;

    setMessages([]);
    setLoading(true);

    socket.emit("join_conversation", activeConversation.id);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/messages/getMessages/${activeConversation.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data && response.data.messages) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeConversation]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    try {
      const response = await axios.post(
        "/messages/send",
        {
          convo_id: activeConversation.id,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const newMessageData = response.data.data;

        const finalMessage = {
          message_id: newMessageData.message_id,
          sender_phone_number: newMessageData.sender_number,
          text: newMessageData.text,
          timestamp: newMessageData.timestamp,
        };

        socket.emit("send_message", {
          convo_id: activeConversation.id,
          text: newMessageData.text,
          sender_phone_number: loggedInUserPhoneNumber,
          timestamp: newMessageData.timestamp,
        });

        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message.");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  return (
    <div className="chatbox">
      {activeConversation ? (
        <>
          <div className="chat-header">
            {/* Displaying the profile picture of the user being chatted with */}
            {activeConversation.profilePicture ? (
              <img
                src={activeConversation.profilePicture}
                alt={`${activeConversation.name}'s profile`}
                className="profile-picture"
              />
            ) : (
              <img
                src="/default-avatar.png"
                alt="Default profile"
                className="profile-picture"
              />
            )}
            <h3> {activeConversation.name}</h3>
          </div>
          <div className="messages">
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <Message
                  key={message.message_id}
                  message={message}
                  isMine={message.sender_phone_number === loggedInUserPhoneNumber}
                  onSendSmartSuggestion={sendMessage}
                />
              ))
            ) : (
              <p>No messages found.</p>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="message-input">
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </>
      ) : (
        <div className="no-conversation">Select a conversation to start chatting.</div>
      )}
    </div>
  );
};

export default ChatBox;
