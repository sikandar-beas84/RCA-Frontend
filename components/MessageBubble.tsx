'use client';

import { env } from "@/config/env";
import { useState } from "react";
import MediaViewer from "./MediaViewer";
import { downloadFile } from "@/utils/downloadFile";
import VoicePlayer from './VoicePlayer';
import { useChat } from "../context/ChatContext";

interface Props {
  id: number;
  text?: string;
  sender?: string;
  mine: boolean;
  status?: "SENT" | "DELIVERED" | "SEEN";
  createdAt?: string;

  fileUrl?: string;
  fileName?: string;
  fileType?: string;

  replyTo?: {
    id: number;
    text: string;
    sender: {
      id: number;
      name: string;
    };
    fileType?: string;
  };
}

export default function MessageBubble({
  id,
  text,
  sender,
  mine,
  status,
  createdAt,
  fileUrl,
  fileName,
  fileType,
  replyTo
}: Props) {

  const fileBaseUrl = env.API_URL.replace("/api", "");
  const [showViewer, setShowViewer] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL!.replace("/api", "");

  const { setReplyMessage } = useChat();

  return (
    <div
      className={`d-flex mb-3 ${
        mine ? 'justify-content-start' : 'justify-content-end'
      }`}
      onContextMenu={(e) => {
        e.preventDefault();

        setReplyMessage({
          id,
          text,
          sender,
          fileUrl,
          fileType,
        });
      }}
    >
      <div
        className={`p-3 rounded-4 shadow-sm ${
          mine ? 'bg-success text-white' : 'bg-white'
        }`}
        style={{
          maxWidth: '70%',
          minWidth: 120,
        }}
      >
        {!mine && (
          <div
            className="fw-bold mb-1"
            style={{
              fontSize: 13,
              color: '#0d6efd',
            }}
          >
            {sender}
          </div>
        )}

        <>
        {fileUrl && (
          <div className="mt-2">

            {/* IMAGE */}

            {fileType?.startsWith("image/") && (
              <>
                <img
                  src={`${API_URL}${fileUrl}`}
                  alt={fileName}
                  className="rounded"
                  style={{
                    maxWidth: 250,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowViewer(true)}
                />

                <MediaViewer
                  show={showViewer}
                  onClose={() => setShowViewer(false)}
                  image={`${API_URL}${fileUrl}`}
                  fileName={fileName}
                />
              </>
            )}

            {/* PDF */}

            {fileType === "application/pdf" && (
              <div className="border rounded p-3">

                <i
                  className="bi bi-file-earmark-pdf-fill text-danger"
                  style={{
                    fontSize: 35,
                  }}
                ></i>

                <div className="mt-2">
                  {fileName}
                </div>

                <div className="mt-3">

                  <a
                    href={`${API_URL}${fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-primary me-2"
                  >
                    Open
                  </a>

                  <button
                    className="btn btn-success"
                    onClick={() =>
                      downloadFile(
                        fileUrl!,
                        fileName,
                      )
                    }
                  >
                    <i className="bi bi-download me-2"></i>
                    Download
                  </button>

                </div>

              </div>
            )}

            {/* VIDEO */}

            {fileType?.startsWith("video/") && (
              <video
                controls
                style={{
                  maxWidth: 280,
                  borderRadius: 10,
                }}
              >
                <source
                  src={`${API_URL}${fileUrl}`}
                  type={fileType}
                />
              </video>
            )}

            {/* AUDIO */}

            {fileType?.startsWith("audio/") && (
              <div className="mt-2">
                <VoicePlayer
                  src={`${process.env.NEXT_PUBLIC_API_URL!.replace(
                    "/api",
                    "",
                  )}${fileUrl}`}
                />
                <button
                  className="btn btn-sm btn-success mt-2"
                  onClick={() => downloadFile(fileUrl!, fileName)}
                >
                  <i className="bi bi-download me-2"></i>
                  Download
                </button>
              </div>
            )}

            {/* OTHER */}

            {!fileType?.startsWith("image/") &&
              !fileType?.startsWith("video/") &&
              !fileType?.startsWith("audio/") &&
              fileType !== "application/pdf" && (
                <a
                  href={`${API_URL}${fileUrl}`}
                  download={fileName}
                  className="btn btn-outline-primary"
                >
                  📄 {fileName}
                </a>
              )}

          </div>
        )}
        {replyTo && (
          <div
            className="mb-2 px-2 py-1 rounded"
            style={{
              background: mine
                ? "rgba(255,255,255,.18)"
                : "#f1f3f5",
              borderLeft: "4px solid #25D366",
            }}
          >
            <div
              className="fw-bold"
              style={{
                fontSize: 13,
                color: mine ? "#fff" : "#25D366",
              }}
            >
              {replyTo.sender.name}
            </div>

            <div
              style={{
                fontSize: 13,
                opacity: .85,
              }}
            >
              {replyTo.text ||
                (replyTo.fileType
                  ? "📎 Attachment"
                  : "")}
            </div>
          </div>
        )}
        {text && <div>{text}</div>}
      </>

        <div
          className="d-flex justify-content-end align-items-center mt-2"
          style={{
            gap: 6,
            fontSize: 11,
            opacity: 0.8,
          }}
        >
          <span>
            {createdAt
              ? new Date(createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>

          {mine && (
            <>
              {status === 'SENT' && (
                <i className="bi bi-check"></i>
              )}

              {status === 'DELIVERED' && (
                <i className="bi bi-check2-all"></i>
              )}

              {status === 'SEEN' && (
                <i
                  className="bi bi-check2-all"
                  style={{
                    color: '#34B7F1',
                  }}
                ></i>
              )}
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}