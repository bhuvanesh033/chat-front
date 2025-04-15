import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../api/api";
import "./Sidebar.css";

const Sidebar = ({ setActiveConversation }) => {
  const [individualChats, setIndividualChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");

  const [showPane, setShowPane] = useState(false);
  const [paneType, setPaneType] = useState("");
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
    <div className="sidebar p-4">
      <h2 className="text-xl font-semibold mb-4">Conversations</h2>

      {/* Toggle Tabs */}
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

      {/* Chat List */}
      <ul className="conversation-list">
        {activeTab === "chat" ? (
          individualChats.length > 0 ? (
            individualChats.map((conversation) => {
              const otherUser = conversation.OtherParticipant?.[0]?.User;
              const displayName = otherUser?.name || "Unknown User";
              const profilePicture = otherUser?.profile || "/default-avatar.png";


              const lastMessage =
                conversation.Messages?.[conversation.Messages.length - 1]?.text || "No messages yet";

              return (
                <li
                  key={conversation.id}
                  onClick={() =>
                    setActiveConversation({
                      ...conversation,
                      name: displayName,
                    })
                  }
                  className="individual-chat-item flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={profilePicture}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{displayName}</div>
                    {/* <div className="text-sm">{lastMessage}</div> */}
                  </div>
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
              className="group-chat-item p-2 cursor-pointer hover:bg-gray-100"
            >
              <div>
                <div className="font-semibold">{conversation.group_name || "Unnamed Group"}</div>
                <div className="text-sm">{conversation.participants?.length || 0} participants</div>
              </div>
            </li>
          ))
        ) : (
          <li>No group chats</li>
        )}
      </ul>

      {/* Footer Buttons */}
      <div className="sidebar-footer mt-4 flex space-x-2">
        <button
          onClick={() => {
            setPaneType("chat");
            setShowPane(true);
          }}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          New Chat
        </button>
        <button
          onClick={() => {
            setPaneType("group");
            setShowPane(true);
          }}
          className="px-2 py-1 bg-purple-500 text-white rounded"
        >
          New Group
        </button>
      </div>

      {/* Create Chat/Group Pane */}
      {showPane && (
        <div className="popup-pane mt-4 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">
            {paneType === "chat" ? "Start New Chat" : "Create Group"}
          </h3>

          {paneType === "chat" ? (
            <input
              type="text"
              placeholder="Enter phone number"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              className="w-full border p-1 mb-2"
            />
          ) : (
            <>
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border p-1 mb-2"
              />
              <input
                type="text"
                placeholder="Participant phone number"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                className="w-full border p-1 mb-2"
              />
              <button
                onClick={addParticipant}
                className="bg-blue-500 text-white px-2 py-1 rounded mb-2"
              >
                Add Participant
              </button>
              <ul className="mb-2">
                {participants.map((p, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {p}
                    <button
                      onClick={() => removeParticipant(p)}
                      className="text-red-500"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="pane-buttons flex space-x-2">
            <button
              onClick={handleCreate}
              className="bg-green-600 text-white px-2 py-1 rounded"
            >
              Create
            </button>
            <button
              onClick={() => setShowPane(false)}
              className="bg-gray-400 text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
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
