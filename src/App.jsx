import { useState, useEffect, useRef } from "react";
import "./index.css";

function App() {
  const [prompt, set_prompt] = useState("");
  const [messages, set_messages] = useState([]);
  const [dark_mode, set_dark_mode] = useState(false);
  const messages_end = useRef(null);

  const sample_questions = [
    "Who are you?",
    "What are your skills?",
    "Tell me about your projects",
    "Where do you work?",
    "What are your hobbies?",
  ];

  //auto-scroll
  useEffect(() => {
    messages_end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send_prompt = async (question_text = null) => {
    const text_to_send = question_text || prompt;
    if (!text_to_send.trim()) return;

    const user_message = { sender: "user", text: text_to_send };
    set_messages((messages) => [...messages, user_message]);

    try {
      const res = await fetch("http://devtestingsus.ovh:25577/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text_to_send }),
      });

      const data = await res.json();
      const response = { sender: "bot", text: data.response };
      set_messages((messages) => [...messages, response]);
    } catch (error) {
      set_messages((messages) => [
        ...messages,
        { sender: "bot", text: "Failed to connect to the server." },
      ]);
    }

    set_prompt("");
  };

  const handle_enter_key = (e) => {
    if (e.key === "Enter") send_prompt();
  };

  const toggle_dark_mode = () => {
    set_dark_mode((prev) => !prev);
  };

  const handle_sample_question = (question) => {
    send_prompt(question);
  };

  const clear_chat = () => {
    set_messages([]);
  };

  return (
    <div className={dark_mode ? "dark" : ""}>
      <div className="chat_container">
        <div className="chat">
          <div className="header">
            <h1 className="title">Resume Chatbot</h1>
            <div className="header_buttons">
              <button onClick={clear_chat} className="clear_button">
                Clear
              </button>
              <button onClick={toggle_dark_mode} className="dark_mode_button">
                {dark_mode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>

          <div className="sample_questions">
            <h3 className="sample_title">Ask:</h3>
            <div className="questions_grid">
              {sample_questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handle_sample_question(question)}
                  className="sample_question"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="messages">
            <div className="welcome_message">
              <span className="welcome_text">
                Hi! I'm Teo's AI chatbot. Ask me about his background, skills, or experience.
              </span>
            </div>
            {messages.map((msg, index) => (
              <div key={index} className={`wrapper ${msg.sender}`}>
                <span className={`bubble ${msg.sender}`}>{msg.text}</span>
              </div>
            ))}
            <div ref={messages_end} />
          </div>

          <div className="input">
            <input
              type="text"
              value={prompt}
              onChange={(e) => set_prompt(e.target.value)}
              onKeyDown={handle_enter_key}
              placeholder="Ask me anything..."
              className="chat_input"
            />
            <button onClick={() => send_prompt()} className="send_button">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;