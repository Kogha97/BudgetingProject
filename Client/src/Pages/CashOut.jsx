import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

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
              <TableCell>Reference</TableCell>
              <TableCell align="right">Currency</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Transaction Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{transaction.reference}</TableCell>
                <TableCell align="right">{transaction.amount.currency}</TableCell>
                <TableCell align="right">-{formatMinorUnits(transaction.amount.minorUnits)}</TableCell>
                <TableCell align="right">{formatDate(transaction.transactionTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handleChangePage}
      sx={{
        '& .MuiPaginationItem-root': {
          color: 'black', // Sets text color to black for all items
          '&:hover': {
            backgroundColor: 'rgb(36, 151, 153)', 
          },
        },
        '& .Mui-selected': {
          color: 'black', 
          backgroundColor: 'rgb(36, 151, 153)',
          borderRadius: '50%',
        },
        '& .MuiPaginationItem-ellipsis': {
          color: 'black',
        },
      }}
      style={{ marginTop: '20px' }}
    />
      {error && <p>{error}</p>}
    </div>
    </>
  );
}
