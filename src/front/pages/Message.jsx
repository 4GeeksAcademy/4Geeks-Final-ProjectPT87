import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Message = () => {
  const { otherUserId } = useParams();
  const otherId = parseInt(otherUserId);
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  
  useEffect(() => {
    fetchConversation();

  const interval = setInterval(() => {
    fetchConversation();
  }, 1000);

  return () => clearInterval(interval);
  }, [otherUserId]);   



const fetchConversation = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/messages/${4}/${3}` // Replace with actual sender and receiver IDs, e.g., currentUserId and otherId
  );
  const data = await response.json();
  setMessages(data);
};

const sendMessage = async () => {
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender_id: 4, // Replace with actual sender ID (current user)
      receiver_id: 3, // Replace with actual receiver ID (other user) 
      content: messageInput,
    })
  });

  fetchConversation();
  }



return (
  <div className="container mt-4">
    <h3>Conversation</h3>

    <div className="border p-3 mb-3" style={{ height: "300px", overflowY: "scroll" }}>
      {messages.map((msg) => (
        <div key={msg.id}>
          {/* OtherUserId is at the momment replaced by 3 */}
          <strong>{msg.sender_id === 3 ? "Them" : "You"}:</strong> 
          <span> {msg.content}</span>
        </div>
      ))}
    </div>

    <input
      type="text"
      value={messageInput}
      onChange={(e) => setMessageInput(e.target.value)}
      className="form-control mb-2"
    />

    <button onClick={sendMessage} className="btn btn-primary">
      Send
    </button>
  </div>
);
};
export default Message;