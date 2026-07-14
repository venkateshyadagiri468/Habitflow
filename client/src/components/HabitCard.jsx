import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Flame, Edit3, Check } from 'lucide-react';
import { HABIT_CATEGORIES } from '../utils/constants';

const HabitCard = ({ habit, onToggleCheck, onEdit }) => {
  const [pop, setPop] = useState(false);

  // Helper to dynamically render Lucide Icons by name
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={size} /> : <LucideIcons.CheckSquare size={size} />;
  };

  const categoryInfo = HABIT_CATEGORIES[habit.category] || { name: habit.category, color: 'var(--primary)' };

  const handleToggle = () => {
    if (!habit.completedToday) {
      setPop(true);
      setTimeout(() => setPop(false), 400);
    }
    onToggleCheck(habit);
  };

  return (
    <div 
      className={`glass-card ${pop ? 'completed-pop' : ''}`}
      style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        borderLeft: `5px solid ${habit.color || categoryInfo.color}`,
        position: 'relative'
      }}
    >
      {/* Left: Check-in Circle and Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        {/* Toggle Circle */}
        <button
          onClick={handleToggle}
          style={{
            background: habit.completedToday ? (habit.color || categoryInfo.color) : 'transparent',
            border: `2px solid ${habit.completedToday ? 'transparent' : (habit.color || categoryInfo.color)}`,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0,
            boxShadow: habit.completedToday ? `0 0 12px ${habit.color || categoryInfo.color}` : 'none',
            transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          title={habit.completedToday ? 'Mark Incomplete' : 'Mark Completed'}
        >
          {habit.completedToday ? <Check size={20} style={{ strokeWidth: 3 }} /> : null}
        </button>

        {/* Text details */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h4 style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: habit.completedToday ? 'var(--text-secondary)' : 'var(--text-primary)',
              textDecoration: habit.completedToday ? 'line-through' : 'none',
              transition: 'color var(--transition-fast)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '220px'
            }}>
              {habit.title}
            </h4>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'var(--bg-hover)',
              color: habit.color || categoryInfo.color,
              border: `1px solid rgba(255,255,255,0.03)`
            }}>
              {categoryInfo.name}
            </span>
          </div>

          {habit.description && (
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textDecoration: habit.completedToday ? 'line-through' : 'none'
            }}>
              {habit.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Streaks and Edit Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        {/* Streak Counter */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: habit.currentStreak > 0 ? '#f97316' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '4px 10px',
            borderRadius: '6px',
            background: habit.currentStreak > 0 ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
            border: habit.currentStreak > 0 ? '1px solid rgba(249, 115, 22, 0.15)' : '1px solid transparent',
            transition: 'all var(--transition-normal)'
          }}
          title={`Current Streak: ${habit.currentStreak} days | Longest: ${habit.longestStreak} days`}
        >
          <Flame size={18} style={{ fill: habit.currentStreak > 0 ? '#f97316' : 'none' }} />
          <span>{habit.currentStreak}</span>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(habit)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color var(--transition-fast), background var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Edit3 size={16} />
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
