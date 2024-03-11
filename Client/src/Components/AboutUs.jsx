import React, { useState } from 'react';

const questionsAnswers = [
  {
    question: "What is BudgetingApp?",
    answer: "BudgetingApp is a tool designed to help individuals manage their finances more effectively, providing real-time tracking, insightful analytics, and personalized budgeting advice."
  },
  {
    question: "How can BudgetingApp help me?",
    answer: "By using BudgetingApp, you can gain better control over your spending, save for future goals, and understand your financial habits through detailed analytics."
  },
  {
    question: "Is BudgetingApp free to use?",
    answer: "We offer a basic version of BudgetingApp for free, with the option to subscribe to our Premium plan for additional features and personalized financial advice."
  },
];

export default function AboutUs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="about-us">
      <div className="container">
        <h1 className="title">About Us</h1>
        <p className="description">
          At BudgetingApp, we're dedicated to empowering you to achieve financial independence. Discover how we can transform your financial journey with our innovative tools and insights.
        </p>
        <div className="accordion">
          {questionsAnswers.map((qa, index) => (
            <div key={index} className="accordion-item">
              <div className="accordion-title" onClick={() => toggleAccordion(index)}>
                <h2>{qa.question}</h2>
                <span>{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && (
                <div className="accordion-content">
                  <p>{qa.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
