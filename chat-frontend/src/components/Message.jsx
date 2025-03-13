// import React from "react";
// import "./Message.css";

// const Message = ({ message, isMine }) => {
//   const loggedInUserPhoneNumber = localStorage.getItem("userPhoneNumber"); // Get logged-in user's phone number from localStorage

//   return (
//     <div
//       className={`message-container ${
//         message.sender_phone_number === loggedInUserPhoneNumber ? "mine" : "other"
//       }`}
//     >
//       <div className="message">
//         {/* Only show sender's name if the message is not from the logged-in user */}
//         {message.sender_phone_number !== loggedInUserPhoneNumber && (
//           <p className="sender-name">{message.sender_name}</p>
//         )}
//         <p className="message-text">{message.text}</p>
//       </div>
//     </div>
//   );
// };

// export default Message;


import React from "react";
import "./Message.css";

const Message = ({ message, isMine }) => {
  const loggedInUserPhoneNumber = localStorage.getItem("userPhoneNumber");

  return (
    <div
      className={`message-container ${
        message.sender_phone_number === loggedInUserPhoneNumber ? "mine" : "other"
      }`}
    >
      <div className="message">
        {message.sender_phone_number !== loggedInUserPhoneNumber && (
          <p className="sender-name">
            {message.sender_name || message.sender_phone_number}
          </p>
        )}
        <p className="message-text">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
