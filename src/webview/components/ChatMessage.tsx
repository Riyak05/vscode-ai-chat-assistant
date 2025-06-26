import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface Attachment {
  name: string;
  type: string;
}

interface ChatMessageProps {
  sender: 'user' | 'ai';
  content: string;
  attachments?: Attachment[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, content, attachments }) => {
  return (
    <div className={`msg msg-${sender}`}>
      <b>{sender === 'user' ? 'You' : 'AI'}:</b>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            return !inline ? (
              <pre className={className} {...props}><code>{children}</code></pre>
            ) : (
              <code className={className} {...props}>{children}</code>
            );
          },
        }}
      />
      {attachments && attachments.length > 0 && (
        <div className="attachments">
          {attachments.map((att) => (
            <div key={att.name} className="attachment">
              <span>{att.name} ({att.type})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 