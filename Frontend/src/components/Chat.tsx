// src/components/Chat.js
import React, { useEffect, useState } from 'react';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/chat');
    setSocket(ws);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(JSON.stringify({ text: input }));
      setInput('');
    }
  };

  return (
    <div className="chat">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className="message">{msg.text}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Napíš správu..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Odoslať</button>
    </div>
  );
};

export default Chat;
