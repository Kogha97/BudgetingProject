import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'


export default function CashIn() {

  const [moneyIn, setMoneyIn] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage] = useState(10)


  useEffect(() => {
    const fetchBankFlow = async () => {
      try {
        const response = await axios.get("http://localhost:5001/banking/flowOut",{
          withCredentials: true
        });
        const incomingTransactions = response.data.feedItems.filter(item => item.direction === 'OUT')
        setMoneyIn(incomingTransactions)
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

  return (
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
            backgroundColor: 'rgba(0, 255, 149, 0.35)', 
          },
        },
        '& .Mui-selected': {
          color: 'black', 
          backgroundColor: 'rgba(0, 255, 149, 0.8)',
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
  );
}
