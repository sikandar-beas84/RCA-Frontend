'use client';

import { useRef, useState, useEffect  } from 'react';
import socket from '../services/socket';
import { useChat } from '../context/ChatContext';
import EmojiPicker from 'emoji-picker-react';
import { uploadFile } from "../services/chat.service";

export default function MessageInput() {
  const [text, setText] = useState('');

  const [showEmoji, setShowEmoji] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojiRef = useRef<HTMLDivElement>(null);

  const { conversationId, selectedUser } = useChat();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (value: string) => {
    
    setText(value);

    if (!conversationId) return;

    console.log('Socket Connected:', socket.connected);
    console.log('Conversation:', conversationId);
    console.log('User:', user);
    console.log('Typing Event Fired');

    socket.emit('typing', {
      conversationId,
      userId: user.id,
      userName: user.name,
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', {
        conversationId,
        userId: user.id,
      });
    }, 1000);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    if (!conversationId) return;

    socket.emit('send_message', {
      conversationId,
      senderId: user.id,
      text,
    });

    setText('');
    socket.emit('stop_typing', {
      conversationId,
      userId: user.id,
    });
  };

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      emojiRef.current &&
      !emojiRef.current.contains(event.target as Node)
    ) {
      setShowEmoji(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside,
    );
  };
}, []);

const onEmojiClick = (emojiData: any) => {
  setText((prev) => prev + emojiData.emoji);
  setShowEmoji(false);
};

const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const file = e.target.files?.[0];

  if (!file || !conversationId) return;

  try {
    setUploading(true);

    const uploaded = await uploadFile(file);

    socket.emit("send_message", {
      conversationId,
      senderId: user.id,

      text: "",

      fileUrl: uploaded.fileUrl,
      fileName: uploaded.fileName,
      fileType: uploaded.fileType,
      fileSize: uploaded.fileSize,
    });
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};

  return (
    <div
        className="border-top p-3 d-flex align-items-center position-relative"
      >

        <button
          type="button"
          className="btn btn-light me-2"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          😀
        </button>

        {showEmoji && (
          <div
            ref={emojiRef}
            style={{
              position: "absolute",
              bottom: 70,
              left: 10,
              zIndex: 1000,
            }}
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
            />
          </div>
        )}
      <input
        ref={fileInputRef}
        type="file"
        className="d-none"
        onChange={handleFileUpload}
      />
      <button
        className="btn btn-outline-secondary me-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        📎
      </button>
      <input
        className="form-control"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />

      <button
        className="btn btn-primary ms-2"
        onClick={sendMessage}
      >
        Send
      </button>

    </div>
  );
}