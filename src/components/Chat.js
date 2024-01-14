import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import "../styles/Chat.css";

export const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages);
      setMessages((prevMessages) => {
        // Using functional update to ensure correct state when messagesRef changes
        return [...prevMessages, ...messages];
      });
    });

    return () => unsubscribe();
  }, [room]);

  const addTypingStatus = async (isTyping) => {
    if (auth.currentUser) {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        text: "",
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room,
        isTyping,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!auth.currentUser) {
      return;
    }

    if (newMessage.trim() === "") return;

    const messagesRef = collection(db, "messages");
    const newMessageObj = {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    };

    try {
      setMessages((prevMessages) => [...prevMessages, newMessageObj]);
      await addDoc(messagesRef, newMessageObj);
      setNewMessage("");
      setIsTyping(false);
      addTypingStatus(false);
    } catch (error) {
      console.error("Error adding message:", error);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg !== newMessageObj)
      );
    }
  };

  return (
    <div className="chat-app">
      <div className="header">
        <h1>Welcome to: {room.toUpperCase()}</h1>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <span className="user">{message.user}:</span> {message.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          handleSubmit(event);
          setIsTyping(false);
          addTypingStatus(false);
        }}
        className="new-message-form"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(event) => {
            setNewMessage(event.target.value);
            setIsTyping(true);
            addTypingStatus(true);
          }}
          className="new-message-input"
          placeholder="Type your message here..."
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      {isTyping && <div className="typing-indicator">Someone is typing...</div>}
    </div>
  );
};
