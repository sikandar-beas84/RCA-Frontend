'use client';

import { useEffect, useState } from 'react';
import {
  getUsers,
  createConversation,
} from '../services/user.service';

interface Props {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewChatModal({
  show,
  onClose,
  onCreated,
}: Props) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (show) {
      loadUsers();
    }
  }, [show]);

  async function loadUsers() {
    const data = await getUsers();
    setUsers(data);
  }

  async function startChat(userId: number) {
    await createConversation(userId);

    onCreated();
    onClose();
  }

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{ background: 'rgba(0,0,0,.5)' }}
      >
        <div className="modal-dialog">
          <div
  className="modal-content border-0 shadow-lg"
  style={{
    borderRadius: 20,
  }}
>

            <div
  className="modal-header border-0"
  style={{
    background: '#25D366',
    color: 'white',
  }}
>
              <h5 className="mb-0 text-white">
  Start New Conversation
</h5>

              <button
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">

              {users.map((user) => (
                <button
  key={user.id}
  onClick={() => startChat(user.id)}
  className="list-group-item list-group-item-action border-0 rounded-3 mb-2"
>
  <div className="d-flex align-items-center">

    <div
      className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
      style={{
        width: 45,
        height: 45,
        fontWeight: 'bold',
      }}
    >
      {user.name.charAt(0)}
    </div>

    <div className="ms-3">

      <div className="fw-bold">
        {user.name}
      </div>

      <small className="text-muted">
        {user.email}
      </small>

    </div>

  </div>
</button>
              ))}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}