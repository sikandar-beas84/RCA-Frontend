'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
  try {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    localStorage.setItem('token', res.data.access_token);

    localStorage.setItem(
      'user',
      JSON.stringify(res.data.user),
    );

    router.push('/chat');
  } catch (err) {
    console.error(err);
    alert('Invalid Login');
  }
};

  return (
    <div className="container mt-5" style={{ maxWidth: 450 }}>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center mb-4">Realtime Chat</h3>

          <input
            className="form-control mb-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary w-100"
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}