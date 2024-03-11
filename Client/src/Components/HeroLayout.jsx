import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function HeroLayout() {
    const navigate = useNavigate(); // Hook for navigation

    return (
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Gain Control of Your Finances</h1>
          <p className="hero-subtitle">
            Start your journey towards financial freedom with budgetingApp - your personal finance tracker.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Get Started</button>

          </div>
        </div>
      </section>
    );
  }