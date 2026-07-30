'use client';

import { Modal, Button } from "react-bootstrap";
import { downloadFile } from "@/utils/downloadFile";

interface Props {
  show: boolean;
  onClose: () => void;
  image: string;
  fileName?: string;
}

export default function MediaViewer({
  show,
  onClose,
  image,
  fileName,
}: Props) {

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="xl"
    >
      <Modal.Header closeButton>

        <Modal.Title>
          {fileName}
        </Modal.Title>

      </Modal.Header>

      <Modal.Body
        className="text-center"
        style={{
          background: "#111",
        }}
      >
        <img
          src={image}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "75vh",
            objectFit: "contain",
          }}
        />
      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={onClose}
        >
          Close
        </Button>

        <button
            className="btn btn-success"
            onClick={() => downloadFile(image, fileName)}
            >
            <i className="bi bi-download me-2"></i>
            Download
            </button>

      </Modal.Footer>
    </Modal>
  );
}