import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import { Sparkles, Sun, Moon } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('landing');
  const [theme, setTheme] = useState(localStorage.getItem('habitflow_theme') || 'dark');
  const [toast, setToast] = useState(null);

  // Apply theme class
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('habitflow_theme', theme);
  }, [theme]);

  // Fetch current user if token is present
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('habitflow_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getProfile();
        setUser(data.user);
        setPage('dashboard');
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('habitflow_token');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Show Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Protected route check
  const navigateTo = (targetPage) => {
    if (!user && ['dashboard', 'profile', 'settings'].includes(targetPage)) {
      setPage('auth');
    } else {
      setPage(targetPage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('habitflow_token');
    setUser(null);
    setPage('landing');
    showToast('Logged out successfully', 'info');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'rotate 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Initializing HabitFlow...</p>
      </div>
    );
  }

  // Page switcher
  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <Landing setPage={navigateTo} user={user} />;
      case 'auth':
        return <Auth setUser={setUser} setPage={navigateTo} showToast={showToast} />;
      case 'dashboard':
        return <Dashboard user={user} showToast={showToast} key={user ? user._id : 'guest'} />;
      case 'profile':
        return <Profile user={user} setUser={setUser} showToast={showToast} handleLogout={handleLogout} />;
      case 'settings':
        return <Settings user={user} showToast={showToast} theme={theme} setTheme={setTheme} />;
      default:
        return <Landing setPage={navigateTo} user={user} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Toast notification */}
      {toast && (
        <div 
          className="glass-card animate-scale-in"
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 1000,
            padding: '16px 24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderLeft: `4px solid ${
              toast.type === 'success' ? 'var(--color-success)' :
              toast.type === 'error' ? 'var(--color-danger)' : 'var(--primary)'
            }`,
            animation: 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}

      {/* Navigation */}
      {page !== 'auth' && (
        <Navbar 
          user={user} 
          page={page} 
          setPage={navigateTo} 
          handleLogout={handleLogout} 
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {/* Main Page Area */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
