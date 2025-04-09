import React, { useState, useEffect } from "react";
import Message from "./Message"; // For individual message display
import axios from "../api/api";
import "./ChatBox.css";
import socket from "../socket"; // Make sure the path is correct

const ChatBox = ({ activeConversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const loggedInUserPhoneNumber = localStorage.getItem("userPhoneNumber");

  useEffect(() => {
    if (!activeConversation) return;

    setMessages([]); // Clear previous messages when switching conversation
    setLoading(true);

    socket.emit("join_conversation", activeConversation.id); // JOIN SOCKET ROOM

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/messages/getMessages/${activeConversation.id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    // Listen for real-time messages
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive_message"); // Clean up when component unmounts
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        "/messages/send",
        {
          convo_id: activeConversation.id,
          text: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data && response.data.data) {
        const newMessageData = response.data.data;

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message_id: newMessageData.message_id,
            sender_phone_number: newMessageData.sender_number,
            text: newMessageData.text,
            timestamp: newMessageData.timestamp,
          },
        ]);
        setNewMessage(""); // Clear input field

        // Emit socket event for real-time update
        socket.emit("send_message", {
          convo_id: activeConversation.id,
          text: newMessageData.text,
          sender_phone_number: loggedInUserPhoneNumber,
          timestamp: newMessageData.timestamp,
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="chatbox">
      {activeConversation ? (
        <>
          <h3>Chat with {activeConversation.name}</h3>
          <div className="messages">
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <Message
                  key={message.message_id}
                  message={message}
                  isMine={message.sender_phone_number === loggedInUserPhoneNumber}
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
