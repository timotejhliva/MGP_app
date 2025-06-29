// src/components/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import './Chat.css'; //CSS

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

    const [username, setUsername] = useState(localStorage.getItem("chat_username") || "Host");
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(username);

    const messagesEndRef = useRef(null);               // pre automatický scroll

    // const username = "Host"; // môžeš neskôr zmeniť na prihlasovacie meno


  //1. Načítanie histórie pri načítaní komponentu
  // useEffect(() => {
  //   fetch('/chat/history')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const messagesOnly = data.map(item => item.message); //.message/.text
  //       setMessages(messagesOnly);
  //       // console.log(messagesOnly)
  //     });
  //   }, []);

  useEffect(() => {
    fetch('/chat/history')
      .then((res) => res.json())
      .then((data) => setMessages(data));
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
      socket.send(JSON.stringify({ user: username, message: input.trim() }));
      setInput('');
    }
  };

    const saveName = () => {
        setUsername(nameInput.trim() || "Host");
        localStorage.setItem("chat_username", nameInput.trim() || "Host");
        setEditingName(false);
    };

//     const saveName = () => {
//       const trimmedName = nameInput.trim() || "Host";
//
//       fetch("/chat/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: trimmedName})
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Používateľ už existuje");
//           return res.json();
//         })
//         .then(() => {
//           setUsername(trimmedName);
//           localStorage.setItem("chat_username", trimmedName);
//           setEditingName(false);
//         })
//         .catch((err) => {
//           alert("Chyba pri registrácii používateľa: " + err.message);
//         });
// };

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
      {/*<div className="chat-header">💬 Chat</div>*/}
    <div className="chat-header">
      <div className="chat-title">💬 Chat</div>
      <div className="chat-username">
        {editingName ? (
          <>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <button onClick={saveName}>✅</button>
          </>
        ) : (
          <>
            <span>👤 {username}</span>
            <button onClick={() => setEditingName(true)}>✏️</button>
          </>
        )}
      </div>
    </div>



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