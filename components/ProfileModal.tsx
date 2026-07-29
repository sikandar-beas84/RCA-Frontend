'use client';

import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '@/services/api';
import { env } from '@/config/env';

interface Props {
  show: boolean;
  onClose: () => void;
  currentUser: any;
  onUpdated: (user: any) => void;
}

export default function ProfileModal({
  show,
  onClose,
  currentUser,
  onUpdated,
}: Props) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    setName(currentUser.name);

    if (currentUser.avatar) {
      setPreview(`${env.API_URL.replace('/api', '')}${currentUser.avatar}`);
    } else {
      setPreview('');
    }
  }, [currentUser]);

  const save = async () => {
    const formData = new FormData();

    formData.append('name', name);

    if (avatar) {
      formData.append('avatar', avatar);
    }

    const res = await api.patch('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    onUpdated(res.data);
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <div className="text-center mb-3">

          {preview ? (
            <img
              src={preview}
              alt=""
              className="rounded-circle"
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center"
              style={{
                width: 100,
                height: 100,
                fontSize: 38,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}

        </div>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>

          <Form.Control
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </Form.Group>

        <Form.Group>

          <Form.Label>Profile Photo</Form.Label>

          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (!e.target.files?.length) return;

              const file = e.target.files[0];

              setAvatar(file);

              setPreview(URL.createObjectURL(file));
            }}
          />

        </Form.Group>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button onClick={save}>
          Save
        </Button>

      </Modal.Footer>
    </Modal>
  );
}