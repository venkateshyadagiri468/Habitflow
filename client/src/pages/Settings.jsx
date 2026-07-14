import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Bell, Calendar, Sparkles } from 'lucide-react';

const Settings = ({ showToast, theme, setTheme }) => {
  const [startOfWeek, setStartOfWeek] = useState(localStorage.getItem('habitflow_start_of_week') || 'Monday');
  const [notifications, setNotifications] = useState(localStorage.getItem('habitflow_notifications') === 'true');
  const [extraAnimations, setExtraAnimations] = useState(localStorage.getItem('habitflow_animations') !== 'false');

  const handleStartOfWeekChange = (e) => {
    const val = e.target.value;
    setStartOfWeek(val);
    localStorage.setItem('habitflow_start_of_week', val);
    showToast(`Week start day changed to ${val}.`, 'success');
  };

  const handleNotificationsToggle = () => {
    const val = !notifications;
    setNotifications(val);
    localStorage.setItem('habitflow_notifications', String(val));
    if (val) {
      showToast('Daily reminders enabled! (Local storage config updated)', 'success');
    } else {
      showToast('Daily reminders disabled.', 'info');
    }
  };

  const handleAnimationsToggle = () => {
    const val = !extraAnimations;
    setExtraAnimations(val);
    localStorage.setItem('habitflow_animations', String(val));
    showToast(val ? 'UI micro-animations enabled!' : 'Animations disabled for accessibility.', 'info');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Preferences</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Customize HabitFlow's interface and notifications.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Appearance Configuration */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
            <Sun size={18} style={{ color: 'var(--primary)' }} />
            Appearance
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Visual Theme</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toggle between Dark and Light color palettes</div>
            </div>
            {/* Toggle buttons */}
            <div style={{ display: 'flex', background: 'var(--bg-hover)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setTheme('dark')}
                style={{
                  background: theme === 'dark' ? 'var(--primary)' : 'transparent',
                  color: theme === 'dark' ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Moon size={14} /> Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                style={{
                  background: theme === 'light' ? 'var(--primary)' : 'transparent',
                  color: theme === 'light' ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Sun size={14} /> Light
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', padding: '16px 0 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Micro-Animations</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enable popup animations for habit checklists</div>
            </div>
            {/* Toggle Checkbox */}
            <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={extraAnimations}
                onChange={handleAnimationsToggle}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span className="slider" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: extraAnimations ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                borderRadius: '24px',
                transition: '0.3s'
              }}>
                <span className="slider-button" style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: extraAnimations ? '26px' : '4px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s'
                }} />
              </span>
            </label>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
            <Bell size={18} style={{ color: 'var(--primary)' }} />
            Reminders
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', padding: '12px 0 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Daily Notifications</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get reminders in the evening to complete habits</div>
            </div>
            {/* Toggle Checkbox */}
            <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={handleNotificationsToggle}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span className="slider" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: notifications ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                borderRadius: '24px',
                transition: '0.3s'
              }}>
                <span className="slider-button" style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: notifications ? '26px' : '4px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s'
                }} />
              </span>
            </label>
          </div>
        </div>

        {/* Calendar Configuration */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
            <Calendar size={18} style={{ color: 'var(--primary)' }} />
            Calendar Setup
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', padding: '12px 0 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Start Week On</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure default layout for calendars</div>
            </div>
            <select
              className="form-control"
              value={startOfWeek}
              onChange={handleStartOfWeekChange}
              style={{ width: '120px', padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
