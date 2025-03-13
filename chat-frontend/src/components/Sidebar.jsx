import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../api/api";
import "./Sidebar.css";

const Sidebar = ({ setActiveConversation }) => {
  const [individualChats, setIndividualChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" or "group"

  const [showPane, setShowPane] = useState(false);
  const [paneType, setPaneType] = useState(""); // "chat" or "group"
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantInput, setParticipantInput] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");

        const [individualRes, groupRes] = await Promise.all([
          axios.get("/conversations/individual", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/conversations/group", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setIndividualChats(individualRes.data);
        setGroupChats(groupRes.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  const addParticipant = () => {
    if (participantInput.trim() && !participants.includes(participantInput)) {
      setParticipants([...participants, participantInput]);
      setParticipantInput("");
    }
  };

  const removeParticipant = (number) => {
    setParticipants(participants.filter((p) => p !== number));
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");

      if (paneType === "chat") {
        if (!participantInput.trim()) return alert("Enter a valid number");

        await axios.post(
          "/conversations/individual",
          { phone_number: participantInput },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Chat created!");
      } else {
        if (!groupName.trim() || participants.length < 2) {
          return alert("Enter group name and at least 2 participants.");
        }

        await axios.post(
          "/conversations/group",
          {
            group_name: groupName,
            image: groupImage || null,
            participants,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Group created!");
      }

      // Refresh chat lists
      const [individualRes, groupRes] = await Promise.all([
        axios.get("/conversations/individual", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/conversations/group", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setIndividualChats(individualRes.data);
      setGroupChats(groupRes.data);

      // Reset form
      setShowPane(false);
      setGroupName("");
      setGroupImage("");
      setParticipants([]);
      setParticipantInput("");
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="sidebar">
      <h2>Conversations</h2>

      {/* Toggle Buttons */}
      <div className="tab-buttons flex space-x-2 mb-2">
        <button
          className={`px-2 py-1 rounded ${activeTab === "chat" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("chat")}
        >
          Chats
        </button>
        <button
          className={`px-2 py-1 rounded ${activeTab === "group" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("group")}
        >
          Groups
        </button>
      </div>

      {/* Chat or Group List */}
      <ul className="conversation-list">
        {activeTab === "chat" ? (
          individualChats.length > 0 ? (
            individualChats.map((conversation) => {
              const otherUser = conversation.OtherParticipant?.[0]?.User;
              const displayName = otherUser?.name || "Unknown";

              return (
                <li
                  key={conversation.id}
                  onClick={() =>
                    setActiveConversation({
                      ...conversation,
                      name: displayName,
                    })
                  }
                >
                  {displayName}
                </li>
              );
            })
          ) : (
            <li>No individual chats</li>
          )
        ) : groupChats.length > 0 ? (
          groupChats.map((conversation) => (
            <li
              key={conversation.id}
              onClick={() =>
                setActiveConversation({
                  ...conversation,
                  name: conversation.group_name || "Unnamed Group",
                })
              }
            >
              {conversation.group_name || "Unnamed Group"}
            </li>
          ))
        ) : (
          <li>No group chats</li>
        )}
      </ul>

      {/* Footer Buttons */}
      <div className="sidebar-footer mt-4">
        <button onClick={() => { setPaneType("chat"); setShowPane(true); }}>
          New Chat
        </button>
        <button onClick={() => { setPaneType("group"); setShowPane(true); }}>
          New Group
        </button>
      </div>

      {/* Popup for New Chat/Group */}
      {showPane && (
        <div className="popup-pane">
          <h3>{paneType === "chat" ? "Start New Chat" : "Create Group"}</h3>

          {paneType === "chat" ? (
            <>
              <input
                type="text"
                placeholder="Enter phone number"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Group image URL (optional)"
                value={groupImage}
                onChange={(e) => setGroupImage(e.target.value)}
              />
              <input
                type="text"
                placeholder="Participant phone number"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
              />
              <button onClick={addParticipant}>Add Participant</button>
              <ul>
                {participants.map((p, index) => (
                  <li key={index}>
                    {p} <button onClick={() => removeParticipant(p)}>❌</button>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="pane-buttons">
            <button onClick={handleCreate}>Create</button>
            <button onClick={() => setShowPane(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  setActiveConversation: PropTypes.func.isRequired,
};

export default Sidebar;
