import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWallet, faBullseye, faChartLine, faFileShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Features() {


    const featuresList = [
        {
          title: "Track Your Spending",
          description: "Easily log your expenses and monitor spending categories to stay on budget.",
          icon: <FontAwesomeIcon icon={faWallet} />, 
        },
        {
          title: "Set Savings Goals",
          description: "Set and achieve your financial goals by planning with our user-friendly goal tracker.",
          icon: <FontAwesomeIcon icon={faBullseye} />,
        },
        {
          title: "Get Smart Insights",
          description: "Receive personalized insights and tips based on your spending habits.",
          icon: <FontAwesomeIcon icon={faChartLine} />,
        },
        {
          title: "Secure Your Data",
          description: "Your financial data is encrypted and protected with top-tier security measures.",
          icon: <FontAwesomeIcon icon={faFileShield} />,
        },

      ];

      library.add(faWallet, faFileShield, faBullseye, faChartLine);
  return (
    <div className="features-container">
      {featuresList.map((feature, index) => (
        <div key={index} className="feature-card">
            {feature.icon}
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
