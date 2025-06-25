// src/components/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import './Chat.css'; //CSS

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);               // pre automatický scroll

    const username = "Host"; // môžeš neskôr zmeniť na prihlasovacie meno


  //1. Načítanie histórie pri načítaní komponentu
  useEffect(() => {
    fetch('/chat/history')
      .then((res) => res.json())
      .then((data) => {
        const messagesOnly = data.map(item => item.message); //.message/.text
        setMessages(messagesOnly);
        // console.log(messagesOnly)
      });
    }, []);



  // 2. Otvorenie WebSocket pripojenia
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/chat/live');
    setSocket(ws);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => ws.close();
  }, []);

  // 📩 Odoslanie správy
  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(JSON.stringify({ text: input }));
      setInput('');
    }

  };

  // 📜 Auto-scroll dolu
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

//   return (
//     <div className="chat">
//       <h2>Chat</h2>
//       <div className="messages">
//         {messages.map((msg, i) => (
//           // <div key={i} className="message">{msg}</div>
//             <div key={i} className="message">
//             {typeof msg === "string" ? msg : msg.text}
//             </div>
//         ))}
//           {/* Posledný neviditeľný element na scroll */}
//           <div ref={messagesEndRef} />
//       </div>
//       <input
//         type="text"
//         placeholder="Napíš správu..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//       />
//       <button onClick={sendMessage}>Odoslať</button>
//     </div>
//   );
// };
//
// export default Chat;


 return (
    <div className="chat-container">
      <div className="chat-header">💬 Firemný Chat</div>
      <div className="chat-messages">
        {messages.map((msg, i) => {
          const isMine = msg.user === username;
          return (
            <div key={i} className={`chat-message ${isMine ? 'mine' : 'theirs'}`}>
              <div className="chat-user">{msg.user}</div>
              <div className="chat-bubble">{msg.message || msg.text}</div>
              {msg.timestamp && (
                <div className="chat-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Napíš správu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Odoslať</button>
      </div>
    </div>
  );
};

export default Chat;