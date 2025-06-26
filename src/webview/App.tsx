import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";

interface Attachment {
  name: string;
  type: string;
  content?: string; // For text or base64 image
}

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  attachments?: Attachment[];
}

// TypeScript declaration for VS Code webview API
interface VSCodeApi {
  postMessage: (message: any) => void;
  // You can add more methods if needed
}

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : undefined;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>(
    []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for messages from extension
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "file-attachment-response") {
        // Add attachment to pending
        setPendingAttachments((prev) => [...prev, message.attachment]);
      } else if (message.type === "ai-response") {
        setMessages((msgs) => [
          ...msgs,
          {
            id: Date.now().toString() + "-ai",
            sender: "ai",
            content: message.content,
            attachments: message.attachments || [],
          },
        ]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Detect @filename in input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const value = e.target.value;
    // If user types @, trigger file picker
    if (value.endsWith("@")) {
      vscode?.postMessage({ type: "attach-file" });
    }
  };

  const handleSend = () => {
    if (!input.trim() && pendingAttachments.length === 0) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: input,
      attachments:
        pendingAttachments.length > 0 ? pendingAttachments : undefined,
    };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    setPendingAttachments([]);
    // Send message to extension backend for AI response
    vscode?.postMessage({
      type: "ai-request",
      content: input,
      attachments: pendingAttachments,
      history: messages,
    });
  };

  return (
    <div className="chat-container">
      <header>AI Chat Assistant</header>
      <div className="chat-history">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            sender={msg.sender}
            content={msg.content}
            attachments={msg.attachments}
          />
        ))}
        {/* Show pending attachments before send */}
        {pendingAttachments.length > 0 && (
          <div className="attachments pending">
            {pendingAttachments.map((att) => (
              <div key={att.name} className="attachment">
                {att.type.startsWith("image") && att.content ? (
                  <img
                    src={att.content}
                    alt={att.name}
                    style={{ maxWidth: 100, maxHeight: 100 }}
                  />
                ) : (
                  <span>
                    {att.name} ({att.type})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message... (@ to attach file)"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default App;
