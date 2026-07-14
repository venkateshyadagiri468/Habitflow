import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import HabitCard from '../components/HabitCard';
import HabitModal from '../components/HabitModal';
import ProgressRing from '../components/ProgressRing';
import CalendarWidget from '../components/CalendarWidget';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { Plus, Flame, Award, Calendar as CalIcon, TrendingUp, ChevronLeft, ChevronRight, Activity, Smile } from 'lucide-react';

const Dashboard = ({ user, showToast }) => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dashboardData, setDashboardData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [allLogs, setAllLogs] = useState([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);

  const fetchAllData = async (date = selectedDate) => {
    try {
      setLoading(true);
      const dash = await api.getDashboard(date);
      setDashboardData(dash.data);

      const stats = await api.getStatistics(date);
      setStatistics(stats.data);

      const logsRes = await api.getLogs();
      setAllLogs(logsRes.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedDate]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const todayStr = new Date().toISOString().split('T')[0];
    if (d.toISOString().split('T')[0] > todayStr) return; // Can't select future
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToggleCheck = async (habit) => {
    try {
      if (habit.completedToday) {
        await api.undoCheckIn(habit.logId);
        showToast(`Habit "${habit.title}" incomplete.`, 'info');
      } else {
        await api.checkIn(habit._id, selectedDate);
        showToast(`Checked in "${habit.title}"! 🔥`, 'success');
      }
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleHabitSubmit = async (habitData) => {
    try {
      if (habitToEdit) {
        await api.updateHabit(habitToEdit._id, habitData);
        showToast('Habit updated successfully.', 'success');
      } else {
        await api.createHabit(habitData);
        showToast('New habit created!', 'success');
      }
      setIsModalOpen(false);
      setHabitToEdit(null);
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleHabitDelete = async (id) => {
    try {
      await api.deleteHabit(id);
      showToast('Habit deleted.', 'info');
      setIsModalOpen(false);
      setHabitToEdit(null);
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openEditModal = (habit) => {
    setHabitToEdit(habit);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setHabitToEdit(null);
    setIsModalOpen(true);
  };

  if (loading && !dashboardData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'rotate 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Dashboard...</p>
      </div>
    );
  }

  const { habits = [], progressPercent = 0, maxCurrentStreak = 0, maxLongestStreak = 0, completedToday = 0, totalHabits = 0 } = dashboardData || {};

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
            Welcome, {user.name} <span role="img" aria-label="wave">👋</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isToday ? "Here's your schedule for today." : `Viewing performance for ${selectedDate}.`}
          </p>
        </div>

        {/* Date Selector */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '6px 12px', borderRadius: '10px' }}>
          <button onClick={handlePrevDay} className="btn btn-secondary" style={{ padding: '6px 12px', border: 'none', borderRadius: '6px' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', minWidth: '110px', textAlign: 'center' }}>
            {isToday ? 'Today' : selectedDate}
          </span>
          <button 
            onClick={handleNextDay} 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', opacity: isToday ? 0.3 : 1, cursor: isToday ? 'not-allowed' : 'pointer' }}
            disabled={isToday}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        {/* Progress Ring Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <ProgressRing progress={progressPercent} radius={50} stroke={6} />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Daily Completion</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {completedToday}/{totalHabits}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Habits Completed</div>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', display: 'flex', alignItems: 'center', justify: 'center' }}>
            <Flame size={26} style={{ fill: '#f97316' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Streak</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{maxCurrentStreak} days</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Keep it going!</div>
          </div>
        </div>

        {/* Longest Streak Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justify: 'center' }}>
            <Award size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Best Streak</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{maxLongestStreak} days</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>All-time record</div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }} className="grid-split">
        {/* Left Column: Habits List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} className="text-primary" style={{ color: 'var(--primary)' }} />
              Habits Checklist
            </h3>
            <button 
              onClick={openCreateModal}
              className="btn btn-primary" 
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add Habit
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="glass-card animate-scale-in" style={{ padding: '60px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--text-muted)' }}>
                <Smile size={32} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>No habits for today</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto' }}>
                  Establish goals and build positive routines by creating your first daily habit.
                </p>
              </div>
              <button onClick={openCreateModal} className="btn btn-secondary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem' }}>
                Create First Habit
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {habits.map(habit => (
                <HabitCard 
                  key={habit._id} 
                  habit={habit} 
                  onToggleCheck={handleToggleCheck}
                  onEdit={openEditModal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Calendar Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <CalendarWidget 
            habits={habits}
            logs={allLogs}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>

      {/* Analytics SVG Charts section */}
      {statistics && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <TrendingUp size={20} className="text-primary" style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)' }}>Historical Statistics</h3>
          </div>
          <AnalyticsCharts statistics={statistics} />
        </div>
      )}

      {/* Modal Editor Form */}
      <HabitModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setHabitToEdit(null);
        }}
        onSubmit={handleHabitSubmit}
        habitToEdit={habitToEdit}
        onDelete={handleHabitDelete}
      />

      {/* Custom responsive CSS */}
      <style>{`
        @media (max-width: 992px) {
          .grid-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
