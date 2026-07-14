import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Calendar as CalIcon } from 'lucide-react';
import { HABIT_CATEGORIES } from '../utils/constants';

const CalendarWidget = ({ habits, logs, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateDetails, setSelectedDateDetails] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days of week
  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get monthly info
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Month name helper
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to format date key "YYYY-MM-DD"
  const formatDateKey = (dayNum) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Build grid days
  const gridDays = [];

  // Padding days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    gridDays.push({
      day: prevMonthTotalDays - i,
      isCurrentMonth: false,
      dateStr: ''
    });
  }

  // Current month days
  const todayStr = new Date().toISOString().split('T')[0];

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = formatDateKey(d);
    const isFuture = new Date(dateStr) > new Date(todayStr);
    
    // Calculate completions on this date
    const dayLogs = logs.filter(log => log.date === dateStr && log.completed);
    const completedCount = dayLogs.length;
    const totalCount = habits.length;

    let status = 'none'; // none, partial, complete, missed, future
    if (isFuture) {
      status = 'future';
    } else if (totalCount > 0) {
      if (completedCount === 0) {
        status = 'missed';
      } else if (completedCount === totalCount) {
        status = 'complete';
      } else {
        status = 'partial';
      }
    }

    gridDays.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
      status,
      completedCount,
      totalCount
    });
  }

  // Padding days for next month to complete the 6-row grid (42 items)
  const remainingCells = 42 - gridDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridDays.push({
      day: i,
      isCurrentMonth: false,
      dateStr: ''
    });
  }

  const handleDayClick = (dayObj) => {
    if (!dayObj.isCurrentMonth || dayObj.status === 'future') return;

    // Compile summary of completed/missed habits for this specific date
    const dateLogs = logs.filter(log => log.date === dayObj.dateStr && log.completed);
    const completedHabitIds = new Set(dateLogs.map(l => l.habitId.toString()));

    const list = habits.map(h => ({
      ...h,
      completed: completedHabitIds.has(h._id.toString())
    }));

    setSelectedDateDetails({
      dateStr: dayObj.dateStr,
      habits: list,
      completedCount: dayObj.completedCount,
      totalCount: dayObj.totalCount
    });
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Month Navigator Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'between', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
          <CalIcon size={18} className="text-primary" style={{ color: 'var(--primary)' }} />
          {monthNames[month]} {year}
        </h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={handlePrevMonth} className="btn btn-secondary" style={{ padding: '6px 12px', borderRadius: '6px' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleNextMonth} className="btn btn-secondary" style={{ padding: '6px 12px', borderRadius: '6px' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginBottom: '12px'
      }}>
        {DAYS_OF_WEEK.map(d => <div key={d}>{d}</div>)}
      </div>

      {/* Calendar Days Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '6px'
      }}>
        {gridDays.map((cell, idx) => {
          let dayStyle = {
            height: '42px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'default',
            transition: 'all var(--transition-fast)'
          };

          if (!cell.isCurrentMonth) {
            dayStyle.color = 'var(--text-muted)';
            dayStyle.opacity = 0.25;
          } else {
            // Apply color coding based on completion status
            dayStyle.cursor = 'pointer';
            
            if (cell.status === 'complete') {
              dayStyle.background = 'rgba(16, 185, 129, 0.2)';
              dayStyle.border = '1px solid rgba(16, 185, 129, 0.4)';
              dayStyle.color = '#10b981';
            } else if (cell.status === 'partial') {
              dayStyle.background = 'rgba(99, 102, 241, 0.15)';
              dayStyle.border = '1px solid rgba(99, 102, 241, 0.3)';
              dayStyle.color = 'var(--primary)';
            } else if (cell.status === 'missed') {
              dayStyle.background = 'rgba(239, 68, 68, 0.1)';
              dayStyle.border = '1px solid rgba(239, 68, 68, 0.2)';
              dayStyle.color = 'var(--color-danger)';
            } else if (cell.status === 'future') {
              dayStyle.color = 'var(--text-muted)';
              dayStyle.background = 'rgba(0,0,0,0.1)';
              dayStyle.cursor = 'not-allowed';
            } else {
              dayStyle.background = 'var(--bg-hover)';
              dayStyle.border = '1px solid var(--border-color)';
            }
          }

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(cell)}
              style={dayStyle}
              onMouseEnter={(e) => {
                if (cell.isCurrentMonth && cell.status !== 'future') {
                  e.currentTarget.style.transform = 'scale(1.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (cell.isCurrentMonth && cell.status !== 'future') {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {cell.day}
            </div>
          );
        })}
      </div>

      {/* Color key guide */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)' }} />
          <span>Complete</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' }} />
          <span>Partial</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }} />
          <span>Missed</span>
        </div>
      </div>

      {/* Day Details Drawer/Overlay */}
      {selectedDateDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedDateDetails(null)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(3px)'
            }}
          />

          {/* Drawer Card */}
          <div className="glass-card animate-scale-in" style={{
            position: 'relative',
            zIndex: 201,
            width: '100%',
            maxWidth: '440px',
            background: 'var(--bg-secondary)',
            padding: '24px',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem' }}>Summary for {selectedDateDetails.dateStr}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Completed {selectedDateDetails.completedCount} of {selectedDateDetails.totalCount} habits
                </p>
              </div>
              <button 
                onClick={() => setSelectedDateDetails(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
              {selectedDateDetails.habits.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>No habits registered.</p>
              ) : (
                selectedDateDetails.habits.map(habit => (
                  <div 
                    key={habit._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${habit.color || 'var(--primary)'}`
                    }}
                  >
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{habit.title}</span>
                    <div style={{
                      color: habit.completed ? '#10b981' : 'var(--color-danger)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {habit.completed ? (
                        <><Check size={14} /> Completed</>
                      ) : (
                        <><X size={14} /> Missed</>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
