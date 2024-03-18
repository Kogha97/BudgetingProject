import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const generateDateRange = (startDate, endDate) => {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let dateRange = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    dateRange.push(new Date(dt).toISOString().split('T')[0]);
  }
  return dateRange;
};

const getDefaultDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const format = (date) => date.toISOString().split('T')[0];

  return {
    startDate: format(firstDayOfMonth),
    endDate: format(today)
  };
};


// Component
export default function HouseExpenses() {
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(getDefaultDateRange());

  useEffect(() => {
    const fetchHouseExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5001/banking/flowIn", {
          withCredentials: true,
        });
        const transactions = response.data.feedItems;


        const filteredTransactions = transactions.filter(item => {
          const itemDate = new Date(item.transactionTime);
          const startDate = new Date(filter.startDate);
          const endDate = new Date(filter.endDate);
          return item.reference === 'RENT' && itemDate >= startDate && itemDate <= endDate;
        });

        setData(filteredTransactions);
        console.log('filtered transactions', filteredTransactions)
      } catch (error) {
        const message = error.response ? error.response.data.error : error.message;
        setError(`Failed to fetch bank data: ${message}. Please try again later.`);
      }
    };
    if (filter.startDate && filter.endDate) {
      fetchHouseExpenses();
    }
  }, [filter]);

  const handleDateChange = (event, type) => {
    setFilter({ ...filter, [type]: event.target.value });
  };

  // Prepare data for the chart
  const aggregatedData = data.reduce((acc, curr) => {
    const date = curr.transactionTime.split('T')[0];
    const amount = curr.sourceAmount.minorUnits / 100; // Convert minorUnits to major currency units
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {});

  const chartLabels = generateDateRange(filter.startDate, filter.endDate);
  const chartDataPoints = chartLabels.map(date => aggregatedData[date] || 0);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Daily Spending (£)',
        data: chartDataPoints,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
    ],
  };
  console.log("🚀 ~ Travel ~ chartData:", chartData)
 

  const chartOptions = {
    scales: {
      x: {
        grid: {
          drawBorder: false,
          display: false,
        },
      },
      y: {
        grid: {
          drawBorder: false,
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true, // Set to false if you also want to hide the legend
      },
    },
  };

  return (
    <div className='graphicContainer'>
      <div className="dateContainer">
        <label htmlFor="start-date">Start Date: </label>
        <input
          type="date"
          id="start-date"
          value={filter.startDate.substring(0, 10)}
          onChange={(e) => handleDateChange(e, 'startDate')}
        />
        <label htmlFor="end-date">End Date: </label>
        <input
          type="date"
          id="end-date"
          value={filter.endDate.substring(0, 10)}
          onChange={(e) => handleDateChange(e, 'endDate')}
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className='canvaContainer'>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
