import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import "../styles/Message.css";
// Global reducer for loading 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";



const Message = () => {
  // Dispatch for loading screen
  const { store, dispatch, fetchRunner } = useGlobalReducer();
  const { otherUserId } = useParams();
  const otherId = Number(otherUserId);
  const storedUserId = localStorage.getItem("user_id");
  // console.log("Stored user_id:", storedUserId);
  const currentUserId = Number(storedUserId);
  // console.log("Parsed user_id:", currentUserId);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  // Loading state
  const [loading, setLoading] = useState(true);
   
  
      // Loading useEffect
      useEffect(() => {
          const fetchData = async () => {
              await fetchRunner(dispatch);
              setLoading(false);
          };
  
          fetchData();
      }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOtherUser = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/${otherId}`
    );

    const data = await response.json();
    setOtherUser(data);
  };


  useEffect(() => {
    fetchConversation();
    fetchOtherUser();

    const interval = setInterval(() => {
      fetchConversation();
    }, 3000);

    return () => clearInterval(interval);
  }, [otherUserId, currentUserId]);



  const fetchConversation = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/messages/${currentUserId}/${otherId}` // Replace with actual sender and receiver IDs, e.g., currentUserId and otherId
    );
    const data = await response.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        receiver_id: otherId,
        content: messageInput,
      })
    });

    const data = await response.json();
    console.log("Message response:", data);

    fetchConversation();
    setMessageInput("");
  };

// Loading component
    if (loading) return <Spinner />;

  return (
    <div className="container mt-4">
      <div className="card mb-3 shadow-sm border-0">
        <div className="card-header bg-primary text-white text-center py-3 rounded-top">
          <h3 className="chat-header-text mb-0">
            Chatting with: <span className="chat-username">{otherUser?.username || "User"}</span>
          </h3>
        </div>
      </div>
      <div className="message-container border mb-3">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              className={`message-row ${isCurrentUser ? "my-message" : "their-message"}`}
            >
              <div className="message-bubble">
                <strong>{isCurrentUser ? "You" : otherUser?.username || "Them"}</strong>
                <div>{msg.content}</div>
              </div>
            </div>
          );
        })}

        {/* Scroll target div: inside container */}
        <div ref={messagesEndRef}></div>
      </div>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className="form-control chat-input mb-2"
      />

      <button onClick={sendMessage} className="btn btn-primary mb-3">
        Send
      </button>
    </div>
  );
}

export default Message;