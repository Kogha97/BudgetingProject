import React from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@material-ui/core';

const BalanceDisplay = ({ balance, error, loading }) => {
  const formatMinorUnits = (minorUnits, currency) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(minorUnits / 100);
  };

  return (
    <Card  className='balanceDisplay' style={{ maxWidth: 500, margin: '0 auto', marginTop: 20 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Current Balance
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Typography variant="h6">
            {balance ? formatMinorUnits(balance.amount.minorUnits, balance.amount.currency) : 'Unavailable'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceDisplay;
