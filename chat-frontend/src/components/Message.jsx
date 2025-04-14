import React, { useState } from "react";
import axios from "axios";
import "./Message.css";

const Message = ({ message, isMine, onSendSmartSuggestion }) => {
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

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

  const handleShowSuggestions = async () => {
    if (suggestions.length > 0) {
      setShowSuggestions(!showSuggestions);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/ai/smart-suggestions", {
        message: message.text,
      });
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Smart Suggestions Error:", err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSuggestionClick = (e, suggestionText) => {
    e.preventDefault(); // 🛑 prevent link default
    if (onSendSmartSuggestion) {
      onSendSmartSuggestion(suggestionText);
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
          <>
            <button
              className="ask-ai-button"
              onClick={() => setShowPromptInput(!showPromptInput)}
            >
              Ask AI
            </button>

            <button className="suggestions-button" onClick={handleShowSuggestions}>
              {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
            </button>
          </>
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

        {showSuggestions && suggestions.length > 0 && (
          <div className="smart-suggestions">
            <strong>Suggestions:</strong>
            <ul>
              {suggestions.map((sug, idx) => {
                const cleanText = sug.replace(/^\d+\.\s*/, "");
                return (
                  <li key={idx}>
                    <a
                      href="#"
                      className="suggestion clickable"
                      onClick={(e) => handleSuggestionClick(e, cleanText)}
                    >
                      {cleanText}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {suggestionsLoading && <p className="loading">Fetching smart replies...</p>}
      </div>
    </div>
  );
};

export default Message;
