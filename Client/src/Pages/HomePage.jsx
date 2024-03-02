import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function HomePage() {
  const [balance, setBalance] = useState(null);
  const [moneyIn, setMoneyIn] = useState([]);
  const [moneyOut, setMoneyOut] = useState([]);
  const [error, setError] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchBankBalance = async () => {
      try {
        const response = await axios.get("http://localhost:5001/banking/balance");
        setBalance(response.data);
      } catch (error) {
        const message = error.response ? error.response.data.error : error.message;
        setError(`Failed to fetch bank data: ${message}. Please try again later.`);
        console.error("Error fetching bank data", message);
      }
    };

    const fetchBankFlow = async () => {
      try {
        const response = await axios.get("http://localhost:5001/banking/flowIn");
        const positiveTransactions = response.data.feedItems.filter(item => item.direction === 'IN');
        const negativeTransactions = response.data.feedItems.filter(item => item.direction === 'OUT');

        setMoneyIn(positiveTransactions);
        setMoneyOut(negativeTransactions);

        const totalIn = positiveTransactions.reduce((acc, curr) => acc + curr.amount.minorUnits, 0);
        setTotalIncome(totalIn);

        const totalOut = negativeTransactions.reduce((acc, curr) => acc + curr.amount.minorUnits, 0);
        setTotalSpent(totalOut);

      } catch (error) {
        const message = error.response ? error.response.data.error: error.message;
        setError(`Failed to fetch bank data: ${message}. Please try again later.`);
        console.log('error fetching bank data', message);
      }
    };

    fetchBankFlow();
    fetchBankBalance();
  }, []);

  const formatMinorUnits = (minorUnits) => {
    return (minorUnits / 100).toFixed(2);
  };

  const chartData = {
    labels: ['Income', 'Spent'],
    datasets: [
      {
        data: [totalIncome / 100, totalSpent / 100], 
        backgroundColor: [
          'rgba(0, 255, 149, 0.8)', 
          'rgba(255, 99, 132, 0.8)', 
        ],
        borderColor: [
          'rgba(0, 255, 149, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y', // This will make the chart horizontal
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
      title: {
        display: true,
        text: 'Money Flow', // Chart title
        font: {
          size: 18,
        },
      },
      tooltip: {
        bodyFont: { size: 16 },
        titleFont: { size: 18 },
        padding: 16,
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // Optionally hides the x-axis labels (ticks) for cleaner appearance
        },
        grid: {
          display: false, // Hides the grid lines
          drawBorder: true, // This ensures the axis itself is drawn
          borderColor: 'black', // Sets the color of the x-axis line
          borderWidth: 4, // Sets the thickness of the x-axis line
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Hides the grid lines
          drawBorder: true, // This ensures the axis itself is drawn
          borderColor: 'black', // Sets the color of the y-axis line
          borderWidth: 4, // Sets the thickness of the y-axis line
        },
      },
    },
  };
  

  return (
    <div className='mainGridDashboard'>
      <div className='leftGridDashboard'>
        <div className='budgetGrid'>
          <h3>Budget Target</h3>
          
        </div>
      </div>
      <div className='rightGridDashboard'>
      <div>
      {error ? 
      <p>
        Error: {error}</p> : 
        balance ? <p>Balance: {formatMinorUnits(balance.amount.minorUnits)} {balance.amount.currency}</p> : 
      <p>Loading balance...</p>}
      </div>
      <div style={{ width: '500px', height: '400px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      </div>



    </div>
  );
}
