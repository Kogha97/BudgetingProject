import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios'


export default function EatingOut() {

  const [moneyEatingOut, setMoneyEatingOut] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
      const fetchBankFlow = async () => {
        try {
          const response = await axios.get("http://localhost:5001/banking/flowIn");
          const incomingTransactions = response.data.feedItems.filter(item => item.spendingCategory === 'EATING_OUT')
          setMoneyEatingOut(incomingTransactions)
          console.log(response.data)
          console.log(incomingTransactions)
        } catch (error) {
         const message = error.response ? error.response.data.error: error.message;
         setError(`Failed to fetch bank data:${message}. Please try again later.`) 
         console.log('error fetching bank data', message)
        }
      }
      fetchBankFlow();
  
    }, []);

  return (
    <div>EatingOut</div>
  )
}
