'use client';

import { Modal } from "react-bootstrap";

interface Props {
  show: boolean;
  onClose: () => void;
  image?: string;
  name: string;
}

export default function ProfileImageModal({
  show,
  onClose,
  image,
  name,
}: Props) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">

        {image ? (
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center"
            style={{
              width: 220,
              height: 220,
              fontSize: 90,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}

      </Modal.Body>
    </Modal>
  );
}