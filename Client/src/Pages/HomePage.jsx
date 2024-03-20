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
import SavingsGoals from '../Components/SavingsGoals';
import BalanceDisplay from '../Components/BalanceDisplay';


// dates
// const getDefaultDateRange = () => {
//   const today = new Date();
//   const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//   const format = (date) => date.toISOString().split('T')[0];

//   return {
//     startDate: format(firstDayOfMonth),
//     endDate: format(today)
//   };
// };


export default function HomePage() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moneyIn, setMoneyIn] = useState([]);
  const [moneyOut, setMoneyOut] = useState([]);
  const [error, setError] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const { updateBudgetCategory, filter, setFilter} = useContext(BudgetContext)
  const { user } = useContext(UserContext)


// const [filter, setFilter] = useState(getDefaultDateRange());


// fetching data
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
//  start of filtering transactions within a time period
        const notFilteredTransactions = response.data.feedItems;
  

        const filteredTransactions = notFilteredTransactions.filter(item => {
          const itemDate = new Date(item.transactionTime);
          const startDate = new Date(filter.startDate);

          const endDate = new Date(filter.endDate);
        
   
          return itemDate >= startDate && itemDate <= endDate;
        });
  
        const transactions = filteredTransactions;
//  end of filtering transactions within a time period 
     
        const positiveTransactions = filteredTransactions.filter(item => item.direction === 'IN');
        const negativeTransactions = transactions.filter(item => item.direction === 'OUT');
       
        
    
        setMoneyIn(positiveTransactions);
        setMoneyOut(negativeTransactions);
  
        // Calculate total income and spent
        const totalIn = positiveTransactions.reduce((acc, curr) => acc + curr.amount.minorUnits, 0);
        setTotalIncome(totalIn);
  
        const totalOut = negativeTransactions.reduce((acc, curr) => acc + curr.amount.minorUnits, 0);
        setTotalSpent(totalOut);
  
        const eatingOutTransactions = negativeTransactions.filter(item => item.spendingCategory === 'EATING_OUT');
    
        const groceriesTransactions = negativeTransactions.filter(item => item.spendingCategory === 'GROCERIES');
        const rentTransactions = negativeTransactions.filter(item => item.reference === 'RENT');
        const medicalTransactions = negativeTransactions.filter(item => item.reference === 'MEDICAL');
        const travelTransactions = negativeTransactions.filter(item => item.reference === 'TRAVEL');
        const subscriptionsTransactions = negativeTransactions.filter(item => item.reference === 'SUBCRIPTIONS')


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
  }, [user, filter]); //filter is changing whenever the date changes

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


  const handleDateChange = (event, type) => {
    setFilter({ ...filter, [type]: event.target.value });
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
      <div className="dateContainerDash">
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
         <BudgetGrid/>
      </div>
      <div className='rightGridDashboard'>
        <div style={{margin:'0px 0px 0px 80px', width: '440px'}}>
        <BalanceDisplay balance={balance} error={error} />
        </div>
      <div style={{ width: '500px', height: '300px', margin :'0px 0px 0px 28px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className='savingsContainer'>
        <SavingsGoals/>
      </div>
      </div>
    </div>
  );
}
