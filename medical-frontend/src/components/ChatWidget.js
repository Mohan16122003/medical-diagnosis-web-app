import { useState } from "react";
import styled from "styled-components";

// Styled Components
const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
`;

const ChatBody = styled.div`
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 8px;
  margin: 5px 0;
  align-self: ${(props) => (props.sender === "user" ? "flex-end" : "flex-start")};
  background: ${(props) => (props.sender === "user" ? "#DCF8C6" : "#E5E5EA")};
  color: black;
`;

const ChatFooter = styled.div`
  display: flex;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 10px;
  border-radius: 5px;
  outline: none;
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  margin-left: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

// Chat Widget Component
const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    const res = await fetch("/api/chat", {  // Use "/api" instead of "http://localhost:5000"
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    setInput("");
  };

  return (
    <ChatContainer>
      <ChatHeader>Medical Chatbot</ChatHeader>
      <ChatBody>
        {messages.map((msg, i) => (
          <Message key={i} sender={msg.sender}>
            {msg.text}
          </Message>
        ))}
      </ChatBody>
      <ChatFooter>
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

export default ChatWidget;
