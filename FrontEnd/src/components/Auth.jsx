import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function Auth({ initialMode = 'login', onLoginSuccess, onModeChange }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = () => {
    setIsLogin((current) => {
      const next = !current;
      onModeChange?.(next ? 'login' : 'register');
      return next;
    });
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong. Please try again.');
      }

      if (isLogin) {
        if (!data.token || !data.user) {
          throw new Error('The server returned an incomplete sign-in response.');
        }
        onLoginSuccess?.(data.token, data.user);
      } else {
        setMessage('You’re on the list! Sign in to get started.');
        setIsLogin(true);
        onModeChange?.('login');
        setPassword('');
      }
    } catch (error) {
      setMessage(error.message || 'We couldn’t connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-content">
      <div className="auth-eyebrow">GOOD FOOD STARTS HERE</div>
      <h2>{isLogin ? 'Welcome back.' : 'Come on in.'}</h2>
      <p className="auth-subtitle">{isLogin ? 'Your next favorite meal is just a sign-in away.' : 'Create an account and make every craving count.'}</p>
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <label>
            Your name
            <input
              type="text"
              autoComplete="name"
              placeholder="Alex Morgan"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        )}
        <label>
          Email address
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder={isLogin ? 'Your password' : 'Create a password'}
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {message && <p className="auth-message" role="status">{message}</p>}
        <button className="primary-button auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'One moment...' : isLogin ? 'Sign in to Crave Club' : 'Create my account'}
          {!isSubmitting && <span>↗</span>}
        </button>
      </form>
      <p className="auth-switch">
        {isLogin ? 'New around here? ' : 'Already part of the club? '}
        <button type="button" onClick={switchMode}>{isLogin ? 'Create an account' : 'Sign in'}</button>
      </p>
      <p className="auth-footnote">By continuing, you agree to our Terms &amp; Privacy Policy.</p>
    </div>
  );
}
