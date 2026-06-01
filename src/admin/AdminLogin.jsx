import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, User, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  useEffect(() => {
    // Check if user is currently locked out locally (for instant UI feedback)
    const lockoutUntil = localStorage.getItem('admin_lockout_until');
    if (lockoutUntil) {
      const timeLeft = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000);
      if (timeLeft > 0) {
        setLockoutTimeLeft(timeLeft);
      } else {
        localStorage.removeItem('admin_lockout_until');
        localStorage.removeItem('admin_login_attempts');
      }
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setLockoutTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('admin_lockout_until');
          localStorage.removeItem('admin_login_attempts');
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutTimeLeft]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Check local lockout again
    const lockoutUntil = localStorage.getItem('admin_lockout_until');
    if (lockoutUntil && parseInt(lockoutUntil) > Date.now()) {
      return;
    }

    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Clear local lockout attempts on success
        localStorage.removeItem('admin_login_attempts');
        localStorage.removeItem('admin_lockout_until');
        
        // Save JWT session token in sessionStorage (cleared when browser closes)
        sessionStorage.setItem('admin_token', data.token);

        onLoginSuccess();
      } else {
        // Handle failed attempts locally to prevent spamming
        let attempts = parseInt(localStorage.getItem('admin_login_attempts') || '0') + 1;
        localStorage.setItem('admin_login_attempts', attempts.toString());

        if (attempts >= 5 || response.status === 429) {
          const lockoutExpiration = Date.now() + 15 * 60 * 1000; // 15 mins
          localStorage.setItem('admin_lockout_until', lockoutExpiration.toString());
          setLockoutTimeLeft(15 * 60);
          setError('Muitas tentativas malsucedidas. Acesso bloqueado por 15 minutos.');
        } else {
          setError(data.error || 'Credenciais incorretas.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <Logo height={50} />
          <p className="login-subtitle">Painel de Administração</p>
        </div>

        {/* Lockout Notification */}
        {lockoutTimeLeft > 0 && (
          <div className="login-lockout">
            <ShieldAlert size={18} style={{ float: 'left', marginRight: '8px' }} />
            <span>
              Painel bloqueado por segurança devido a múltiplos erros. Tente novamente em: <strong>{formatTime(lockoutTimeLeft)}</strong>
            </span>
          </div>
        )}

        {/* Standard Error Notification */}
        {error && lockoutTimeLeft === 0 && (
          <div className="login-error">
            <ShieldAlert size={18} style={{ float: 'left', marginRight: '8px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                id="username" 
                className="form-control" 
                style={{ paddingLeft: '44px' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite o usuário de acesso"
                disabled={lockoutTimeLeft > 0 || loading}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Senha Administrativa</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="form-control" 
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha do painel"
                disabled={lockoutTimeLeft > 0 || loading}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', padding: '14px 20px' }}
            disabled={lockoutTimeLeft > 0 || loading}
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
}
