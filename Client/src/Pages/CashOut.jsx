import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useTheme } from '../Context/ThemeContext'; 

const getDefaultDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const format = (date) => date.toISOString().split('T')[0];

  return {
    startDate: format(firstDayOfMonth),
    endDate: format(today)
  };
};

export default function CashIn() {

  const [moneyIn, setMoneyIn] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage] = useState(10)
  const { dark } = useTheme();
  const [filter, setFilter] = useState(getDefaultDateRange());

  useEffect(() => {
    const fetchBankFlow = async () => {
      try {
        const response = await axios.get("http://localhost:5001/banking/flowOut",{
          withCredentials: true
        });
        const notFilteredTransactions = response.data.feedItems;

        const filteredTransactions = notFilteredTransactions.filter(item => {
          const itemDate = new Date(item.transactionTime);
          const startDate = new Date(filter.startDate);
          const endDate = new Date(filter.endDate);
          return itemDate >= startDate && itemDate <= endDate;
        });


        const incomingTransactions = filteredTransactions.filter(item => item.direction === 'OUT')
        console.log("🚀 ~ fetchBankFlow ~ incomingTransactions:", incomingTransactions)
        setMoneyIn(incomingTransactions)


      } catch (error) {
       const message = error.response ? error.response.data.error: error.message;
       setError(`Failed to fetch bank data:${message}. Please try again later.`) 
       console.log('error fetching bank data', message)
      }
    }
    fetchBankFlow();

  }, [filter]);

  const formatMinorUnits = (minorUnits) =>{
    return(minorUnits / 100).toFixed(2)
  }

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = moneyIn.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(moneyIn.length / transactionsPerPage);

  const handleDateChange = (event, type) => {
    setFilter({ ...filter, [type]: event.target.value });
  };

  const cellStyles = {
    color: dark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)', // Dark mode text color
  };
  const paginationStyles = {
    '& .MuiPaginationItem-root': {
      color: dark ? 'white' : 'black', // Dynamically set text color based on dark mode
      '&:hover': {
        backgroundColor: dark ? 'rgba(255, 255, 255, 0.25)' : 'rgb(36, 151, 153)', 
      },
    },
    '& .Mui-selected': {
      color: 'black', 
      backgroundColor: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgb(36, 151, 153)',
      borderRadius: '50%',
    },
    '& .MuiPaginationItem-ellipsis': {
      color: dark ? 'white' : 'black',
    },
  };
  return (
    <>
     <div className="dateContainerFlowIn">
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
    <div className='displayGrid'>
      <TableContainer component={Paper} className='displayList'>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={cellStyles}>Reference</TableCell>
              <TableCell style={cellStyles} align="right">Currency</TableCell>
              <TableCell style={cellStyles} lign="right">Amount</TableCell>
              <TableCell style={cellStyles} align="right">Transaction Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell style={cellStyles} component="th" scope="row">{transaction.reference}</TableCell>
                <TableCell style={cellStyles} align="right">{transaction.amount.currency}</TableCell>
                <TableCell style={cellStyles} align="right">-{formatMinorUnits(transaction.amount.minorUnits)}</TableCell>
                <TableCell style={cellStyles} align="right">{formatDate(transaction.transactionTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChangePage}
        sx={paginationStyles} // Apply the dynamic styles here
        style={{ marginTop: '20px' }}
      />
      {error && <p>{error}</p>}
    </div>
    </>
  );
}
