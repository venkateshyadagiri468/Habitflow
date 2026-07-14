import React, { useState, useEffect } from 'react';
import { HABIT_CATEGORIES } from '../utils/constants';
import * as LucideIcons from 'lucide-react';
import { X, Check } from 'lucide-react';

const ICON_PRESETS = [
  'Activity', 'Brain', 'DollarSign', 'BookOpen', 'Briefcase', 'CheckSquare',
  'Flame', 'Heart', 'Smile', 'Compass', 'Dumbbell', 'Music', 'Coffee', 'Zap'
];

const COLOR_PRESETS = [
  'hsl(142, 70%, 45%)', // Neon Green
  'hsl(262, 80%, 60%)', // Neon Purple
  'hsl(47, 95%, 45%)',  // Vivid Amber
  'hsl(200, 95%, 45%)',  // Electric Blue
  'hsl(12, 90%, 55%)',   // Sunset Orange
  'hsl(330, 85%, 55%)',  // Deep Pink
  'hsl(170, 85%, 40%)',  // Turquoise
  'hsl(230, 85%, 60%)'   // Indigo
];

const HabitModal = ({ isOpen, onClose, onSubmit, habitToEdit, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('HEALTH');
  const [icon, setIcon] = useState('Activity');
  const [color, setColor] = useState(COLOR_PRESETS[0]);

  // Sync state if editing
  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title || '');
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category || 'HEALTH');
      setIcon(habitToEdit.icon || 'Activity');
      setColor(habitToEdit.color || COLOR_PRESETS[0]);
    } else {
      setTitle('');
      setDescription('');
      setCategory('HEALTH');
      setIcon('Activity');
      setColor(COLOR_PRESETS[0]);
    }
  }, [habitToEdit, isOpen]);

  // Automatically update default color and icon when category changes (only for new habits)
  useEffect(() => {
    if (!habitToEdit && HABIT_CATEGORIES[category]) {
      setColor(HABIT_CATEGORIES[category].color);
      setIcon(HABIT_CATEGORIES[category].icon);
    }
  }, [category, habitToEdit]);

  if (!isOpen) return null;

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      category,
      icon,
      color
    });
  };

  // Helper to dynamically render Lucide Icons by name
  const renderIcon = (iconName, size = 18) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={size} /> : <LucideIcons.CheckSquare size={size} />;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Modal Card */}
      <div className="glass-card animate-scale-in" style={{
        position: 'relative',
        zIndex: 1001,
        width: '100%',
        maxWidth: '520px',
        background: 'var(--bg-secondary)',
        padding: '32px',
        borderRadius: '16px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
            {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmitForm}>
          {/* Title */}
          <div className="form-group">
            <label>Habit Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Read 15 Pages"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description (Optional)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. In the morning after coffee"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select 
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', appearance: 'none', background: 'rgba(0,0,0,0.3)', cursor: 'pointer' }}
            >
              {Object.keys(HABIT_CATEGORIES).map(catKey => (
                <option key={catKey} value={catKey}>
                  {HABIT_CATEGORIES[catKey].name}
                </option>
              ))}
            </select>
          </div>

          {/* Icon Selector */}
          <div className="form-group">
            <label>Select Icon</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
              padding: '12px',
              background: 'rgba(0,0,0,0.15)',
              borderRadius: 'var(--radius-sm)'
            }}>
              {ICON_PRESETS.map(iconName => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => setIcon(iconName)}
                  style={{
                    background: icon === iconName ? 'var(--primary)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: icon === iconName ? 'white' : 'var(--text-secondary)',
                    width: '38px',
                    height: '38px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {renderIcon(iconName, 18)}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label>Pick Theme Color</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map(presetColor => (
                <button
                  type="button"
                  key={presetColor}
                  onClick={() => setColor(presetColor)}
                  style={{
                    background: presetColor,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderColor: color === presetColor ? 'var(--text-primary)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'transform var(--transition-fast)'
                  }}
                >
                  {color === presetColor && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', gap: '12px' }}>
            {habitToEdit && onDelete ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this habit and all its logged history?')) {
                    onDelete(habitToEdit._id);
                  }
                }}
                style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                Delete
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {habitToEdit ? 'Save Changes' : 'Create Habit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
