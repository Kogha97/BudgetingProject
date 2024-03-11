import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About BudgetingApp</h3>
          <p>Empowering individuals to master their finances with intuitive tools and insights.</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@budgetingapp.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <a href="https://twitter.com/budgetingapp">Twitter</a>
          <a href="https://facebook.com/budgetingapp">Facebook</a>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <a href="/terms">Terms of Use</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
