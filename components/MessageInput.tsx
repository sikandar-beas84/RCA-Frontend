'use client';

import { useRef, useState, useEffect  } from 'react';
import socket from '../services/socket';
import { useChat } from '../context/ChatContext';
import EmojiPicker from 'emoji-picker-react';
import {
  uploadFile,
  uploadAudio,
} from "../services/chat.service";

export default function MessageInput() {
  const [text, setText] = useState('');

  const [showEmoji, setShowEmoji] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojiRef = useRef<HTMLDivElement>(null);

  const {
    conversationId,
    selectedUser,
    replyMessage,
    setReplyMessage,
    editingMessage,
    setEditingMessage,
  } = useChat();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // for audio
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // for audio

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

    if (editingMessage) {

      socket.emit("edit_message", {
        messageId: editingMessage.id,
        senderId: user.id,
        text,
      });

      setEditingMessage(null);

      setText("");

      return;
    }

    socket.emit("send_message", {
      conversationId,
      senderId: user.id,
      text,
      replyToId: replyMessage?.id,
    });

    setReplyMessage(null);

    setText("");

    socket.emit("stop_typing", {
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

  const MAX_SIZE = 10 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    alert("Maximum file size is 10 MB.");
    return;
  }

  try {
    setUploading(true);

    const uploaded = await uploadFile(
      file,
      (progress) => {
        setUploadProgress(progress);
      },
    );

    console.log("Sending reply:", {
  conversationId,
  senderId: user.id,
  text,
  replyToId: replyMessage?.id,
});

    socket.emit("send_message", {
      conversationId,
      senderId: user.id,

      text: "",

      fileUrl: uploaded.fileUrl,
      fileName: uploaded.fileName,
      fileType: uploaded.fileType,
      fileSize: uploaded.fileSize,

      replyToId: replyMessage?.id,
    });
  } catch (err) {
    console.error(err);
  } finally {
    setUploading(false);
    setUploadProgress(0);
    setReplyMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};
  //recording start
  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstart = () => {
        setRecording(true);
        setRecordingTime(0);

        timerRef.current = setInterval(() => {
          setRecordingTime((t) => t + 1);
        }, 1000);
      };

      recorder.onstop = async () => {
        setRecording(false);

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: "audio/webm",
          },
        );

        const audioFile = new File(
          [audioBlob],
          "voice-message.webm",
          {
            type: "audio/webm",
          },
        );

        const uploaded =
          await uploadAudio(audioFile);

              console.log("Sending reply:", {
              conversationId,
              senderId: user.id,
              text,
              replyToId: replyMessage?.id,
            });

        socket.emit("send_message", {
          conversationId,
          senderId: user.id,

          text: "",

          fileUrl: uploaded.fileUrl,
          fileName: uploaded.fileName,
          fileType: uploaded.fileType,
          fileSize: uploaded.fileSize,

          replyToId: replyMessage?.id,
        });

        stream
          .getTracks()
          .forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;

      recorder.start();

    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setReplyMessage(null);
  };
  //recording end


  //edit message start
    useEffect(() => {
      if (editingMessage) {
        setText(editingMessage.text);
      }
    }, [editingMessage]);
  //edit message end


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

        {replyMessage && (
          <div
            className="border rounded p-2 mb-2 bg-light"
          >
            <div className="fw-bold text-success">
              Replying to {replyMessage.sender}
            </div>

            <div
              style={{
                fontSize: 14,
              }}
            >
              {replyMessage.text || "Attachment"}
            </div>

            <button
              className="btn btn-sm btn-link text-danger p-0"
              onClick={() => setReplyMessage(null)}
            >
              ✕
            </button>
          </div>
        )}

      <input
        ref={fileInputRef}
        type="file"
        className="d-none"
        onChange={handleFileUpload}
      />
      
      {uploading ? (
        <div
          className="me-2 d-flex flex-column align-items-center"
          style={{
            width: 50,
          }}
        >
          <div
            className="spinner-border spinner-border-sm text-success"
            role="status"
          />

          <small
            className="mt-1"
            style={{
              fontSize: 10,
            }}
          >
            {uploadProgress}%
          </small>
        </div>
      ) : (
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => fileInputRef.current?.click()}
        >
          📎
        </button>
      )}

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

      {recording && (
        <div
          className="text-danger fw-bold me-2"
        >
          🔴 {recordingTime}s
        </div>
      )}
      {text.trim() ? (
        <button
          className="btn btn-primary ms-2"
          onClick={sendMessage}
        >
          Send
        </button>
      ) : recording ? (
        <button
          className="btn btn-danger ms-2"
          onClick={stopRecording}
        >
          ⏹
        </button>
      ) : (
        <button
          className="btn btn-success ms-2"
          onClick={startRecording}
        >
          🎤
        </button>
      )}

    </div>
  );
}