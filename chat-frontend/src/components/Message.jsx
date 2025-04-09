import React, { useState } from "react";
import axios from "axios";
import "./Message.css";

const Message = ({ message }) => {
  const loggedInUserPhoneNumber = localStorage.getItem("userPhoneNumber");
  const isMine = message.sender_phone_number === loggedInUserPhoneNumber;

  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/ai/ask", {
        prompt: `${prompt}\n\nMessage: ${message.text}`,
      });
      setAiResponse(response.data.reply);
      setShowPromptInput(false);
    } catch (error) {
      console.error("AI request error:", error);
      alert("Failed to get response from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`message-container ${isMine ? "mine" : "other"}`}>
      <div className="message">
        {!isMine && (
          <p className="sender-name">
            {message.sender_name || message.sender_phone_number}
          </p>
        )}
        <p className="message-text">{message.text}</p>

        {!isMine && (
  <button
    className="ask-ai-button"
    onClick={() => setShowPromptInput(!showPromptInput)}
  >
    Ask AI
  </button>
)}


        {showPromptInput && (
          <div className="ai-prompt-box">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              className="ai-input"
            />
            <button onClick={handleAskAI} className="send-ai-btn">
              {loading ? "..." : "Send"}
            </button>
          </div>
        )}

        {aiResponse && (
          <div className="ai-response">
            <strong>AI:</strong> {aiResponse}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
