'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import socket from "../services/socket";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const login = async () => {
  console.log("Login clicked");

  try {
    console.log("Calling API...");

    const res = await api.post('/auth/login', {
      email,
      password,
    });

    console.log("Response:", res.data);

    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    socket.connect();

    socket.emit("user_connected", {
      userId: res.data.user.id,
    });

    router.push('/chat');
  } catch (err: any) {
    console.log("Full Error:", err);

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Data:", err.response.data);
    } else if (err.request) {
      console.log("Request Error:", err.request);
    } else {
      console.log("Message:", err.message);
    }

    alert("Login Failed");
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