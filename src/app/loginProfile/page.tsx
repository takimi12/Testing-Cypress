'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import './LoginForm.css'; 

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) {
      router.push('/profile');
    }
  };
// added saas
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Zaloguj się</h2>
        <input
          type="email"
          className="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="password"
          placeholder="Hasło"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        <div className="login-remember">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Zapamiętaj mnie</label>
        </div>
        <button type="submit" className="login-button">
          Zaloguj
        </button>
      </form>
    </div>
  );
}