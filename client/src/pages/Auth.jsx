import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

const Auth = ({ setUser, setPage, showToast }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('habitflow_token', data.token);
      setUser(data.user);
      showToast('Welcome back, ' + data.user.name + '!', 'success');
      setPage('dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await api.register(name, email, password);
      localStorage.setItem('habitflow_token', data.token);
      setUser(data.user);
      showToast('Registration successful! Welcome to HabitFlow.', 'success');
      setPage('dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <div className={`auth-card ${isRegistering ? 'flipped' : ''}`}>
          
          {/* LOGIN CARD */}
          <div className="auth-front glass-card" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px', fontSize: '0.9rem' }}>
              Sign in to continue tracking your daily habits.
            </p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="email@example.com" 
                    style={{ paddingLeft: '48px', width: '100%' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••" 
                    style={{ paddingLeft: '48px', width: '100%' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '10px' }} disabled={loading}>
                {loading ? 'Signing In...' : <><LogIn size={18} /> Sign In</>}
              </button>
            </form>

            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <span 
                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => {
                  setIsRegistering(true);
                  setEmail('');
                  setPassword('');
                }}
              >
                Create one
              </span>
            </p>
          </div>

          {/* REGISTER CARD */}
          <div className="auth-back glass-card" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px', fontSize: '0.9rem' }}>
              Join HabitFlow today and start building positive routines.
            </p>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="John Doe" 
                    style={{ paddingLeft: '48px', width: '100%' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="email@example.com" 
                    style={{ paddingLeft: '48px', width: '100%' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label>Password (Min. 6 chars)</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••" 
                    style={{ paddingLeft: '48px', width: '100%' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '10px' }} disabled={loading}>
                {loading ? 'Creating Account...' : <><UserPlus size={18} /> Sign Up</>}
              </button>
            </form>

            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <span 
                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => {
                  setIsRegistering(false);
                  setEmail('');
                  setPassword('');
                }}
              >
                Sign in
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
