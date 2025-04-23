// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://chat-backend-3-bbzi.onrender.com", {
  withCredentials: true,
});

export default socket;
