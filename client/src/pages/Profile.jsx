import React, { useState } from 'react';
import { api } from '../services/api';
import { User, Lock, Trash2, Camera, LogOut } from 'lucide-react';

const Profile = ({ user, setUser, showToast, handleLogout }) => {
  const [name, setName] = useState(user.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setUpdatingProfile(true);
    try {
      const res = await api.updateProfile({ name, avatar: avatarUrl });
      setUser(res.user);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    
    setUpdatingPassword(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const doubleConfirm = confirm('WARNING: This will permanently delete your account and all associated habits and streak logs. This action CANNOT be undone. Are you sure you want to proceed?');
    if (!doubleConfirm) return;
    
    setDeletingAccount(true);
    try {
      await api.deleteAccount();
      showToast('Your account was deleted successfully.', 'info');
      handleLogout();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeletingAccount(false);
    }
  };

  // Avatar presets
  const AVATARS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Profile Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal details, avatar, and credentials.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }} className="grid-split">
        {/* Left Column: Personal details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Avatar and Info Card */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
              <User size={18} style={{ color: 'var(--primary)' }} />
              Personal Info
            </h3>

            <form onSubmit={handleUpdateProfile}>
              {/* Avatar Selector */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Choose Avatar</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Current Avatar */}
                  <img
                    src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt="Current Avatar"
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                  {/* Avatar Picker List */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {AVATARS.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Avatar Option ${idx + 1}`}
                        onClick={() => setAvatarUrl(url)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          objectFit: 'cover',
                          border: avatarUrl === url ? '2px solid var(--primary)' : '2px solid transparent',
                          transform: avatarUrl === url ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all var(--transition-fast)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Name field */}
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>

              {/* Email field (readonly) */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Email Address (Cannot be changed)</label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email}
                  disabled
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px' }} disabled={updatingProfile}>
                {updatingProfile ? 'Saving...' : 'Save Details'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="glass-card" style={{ padding: '28px', borderColor: 'rgba(239, 68, 68, 0.15)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '12px', color: 'var(--color-danger)', fontFamily: 'var(--font-display)' }}>
              <Trash2 size={18} />
              Danger Zone
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Deleting your account is permanent. It will instantly delete your profile details, habits configurations, and completion history from our servers.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="btn btn-secondary"
              style={{ padding: '10px 20px', borderRadius: '8px', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.05)' }}
              disabled={deletingAccount}
            >
              {deletingAccount ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </div>

        {/* Right Column: Change Password */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
            <Lock size={18} style={{ color: 'var(--primary)' }} />
            Update Password
          </h3>

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password (Min. 6 chars)</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px' }} disabled={updatingPassword}>
              {updatingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
