import React from 'react';
import { ArrowRight, Flame, BarChart3, Calendar, Sparkles } from 'lucide-react';

const Landing = ({ setPage, user }) => {
  return (
    <div className="landing-page animate-fade-in" style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <Sparkles size={16} className="text-primary" style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>BUILD BETTER HABITS</span>
        </div>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '20px', lineHeight: 1.1, background: 'linear-gradient(to right, var(--text-primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master Your Habits,<br />Flow with Progress.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Track daily routines, build streaks, inspect monthly calendars, and visualize your progress with premium metrics and analytics.
        </p>
        <button 
          onClick={() => setPage(user ? 'dashboard' : 'auth')}
          className="btn btn-primary" 
          style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '12px' }}
        >
          {user ? 'Go to Dashboard' : 'Start for Free'} <ArrowRight size={20} />
        </button>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', margin: '80px 0 40px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--color-danger)', marginBottom: '24px' }}>
            <Flame size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Streak Engine</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Calculate current and longest streaks. Receive visual badges and watch your progress heat up day by day.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--primary)', marginBottom: '24px' }}>
            <BarChart3 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Stunning Analytics</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Visualize completion trends by categories and weeks using custom responsive SVG charts and completion grids.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--color-success)', marginBottom: '24px' }}>
            <Calendar size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Visual Calendars</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Inspect complete monthly grids with green and red indicators. Easily review history and logs for past dates.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
