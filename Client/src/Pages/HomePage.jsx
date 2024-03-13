import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { BudgetContext } from '../Context/budgetContext';
import Decimal from 'decimal.js';
import BudgetGrid from '../Components/budgetGrid';
import { UserContext } from '../Context/userContext'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeroLayout from '../Components/HeroLayout';
import Features from '../Components/Features';
import AboutUs from '../Components/AboutUs'
import Footer from '../Components/Footer'
import SectionSeparator from '../Components/SectionSeparator';



export default function HomePage() {
  const [balance, setBalance] = useState(null);
  const [moneyIn, setMoneyIn] = useState([]);
  const [moneyOut, setMoneyOut] = useState([]);
  const [error, setError] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const { updateBudgetCategory } = useContext(BudgetContext)
  const { user } = useContext(UserContext)


  useEffect(() => {
    const fetchBankBalance = async () => {
      try {
        const response = await axios.get("http://localhost:5001/banking/balance",{
          withCredentials: true
        });
        setBalance(response.data);
        
      } catch (error) {
        const message = error.response ? error.response.data.error : error.message;
        setError(`Failed to fetch bank data: ${message}. Please try again later.`);
        console.error("Error fetching bank data", message);
      }
    };

    const fetchBankFlow = async () => {
      try {
        const response = await axios.get("http://localhost:5001/banking/flowIn",{
          withCredentials: true
        });
        const transactions = response.data.feedItems; 
  
        // Filter transactions by direction
        const positiveTransactions = transactions.filter(item => item.direction === 'IN');
        const negativeTransactions = transactions.filter(item => item.direction === 'OUT');
        
        // Set positive and negative transactions
        setMoneyIn(positiveTransactions);
        setMoneyOut(negativeTransactions);
  
        // Calculate total income and spent
        const totalIn = positiveTransactions.reduce((acc, curr) => acc + curr.amount.minorUnits, 0);
        setTotalIncome(totalIn);
  
        const totalOut = negativeTransactions.reduce((acc, curr) => acc + curr.amount.minorUnits, 0);
        setTotalSpent(totalOut);
  
        const eatingOutTransactions = transactions.filter(item => item.spendingCategory === 'EATING_OUT');
        const groceriesTransactions = transactions.filter(item => item.spendingCategory === 'GROCERIES');
        const rentTransactions = transactions.filter(item => item.reference === 'RENT');
        const medicalTransactions = transactions.filter(item => item.reference === 'MEDICAL');
        const travelTransactions = transactions.filter(item => item.reference === 'TRAVEL');
        const subscriptionsTransactions = transactions.filter(item => item.reference === 'SUBCRIPTIONS')


        const categorizedTransactions = [
          ...eatingOutTransactions,
          ...groceriesTransactions,
          ...rentTransactions,
          ...medicalTransactions,
          ...travelTransactions,
          ...subscriptionsTransactions
        ];

        const extrasTransactions = negativeTransactions.filter(transaction => 
          !categorizedTransactions.includes(transaction)
        );
      


        const totalEatingOut = calculateTotal(eatingOutTransactions);
        const totalGroceries = calculateTotal(groceriesTransactions);
        const totalRent = calculateTotal(rentTransactions);
        const totalMedical = calculateTotal(medicalTransactions);
        const totalTravel = calculateTotal(travelTransactions);
        const totalSubscripions = calculateTotal(subscriptionsTransactions)
        const totalExtras = calculateTotal(extrasTransactions);


          
      updateBudgetCategory('Eating Out', totalEatingOut);
      updateBudgetCategory('Groceries', totalGroceries);
      updateBudgetCategory('House Expenses', totalRent);
      updateBudgetCategory('Medical', totalMedical);
      updateBudgetCategory('Travel', totalTravel);
      updateBudgetCategory('Subscriptions', totalSubscripions);
      updateBudgetCategory('Extras', totalExtras);


      } catch (error) {
        const message = error.response ? error.response.data.error : error.message;
        setError(`Failed to fetch bank data: ${message}. Please try again later.`);
        console.log('error fetching bank data', message);
      }
    };
  
    fetchBankFlow();
    fetchBankBalance();
  }, [user]);


  const formatMinorUnits = (minorUnits) => {
    return (minorUnits / 100).toFixed(2);
  };
  function calculateTotal(transactions) {
 
    const total = transactions.reduce((acc, curr) => acc.plus(new Decimal(curr.amount.minorUnits)), new Decimal(0)).dividedBy(100); 

    return Number(total.toFixed(2));
}

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
  
  library.add(faUser, faAngleRight);
if(!user.isLoggedIn){
  return(
    <>
    <HeroLayout/>
    <Features/>
    <SectionSeparator/>
    <AboutUs/>
    <Footer/>
    </>
  );
}
  return (
    <div className='mainGridDashboard'>

      <div className='leftGridDashboard'>
         <BudgetGrid/>
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
