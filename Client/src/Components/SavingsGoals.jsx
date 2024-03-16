import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SavingsGoals() {
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await axios.get("http://localhost:5001/banking/savings", {
          withCredentials: true
        });
        const filteredSavings = response.data.savingsGoalList.filter(saving => !saving.name.includes("Load test"));

        // Map the data to fit the recharts format
        const chartData = filteredSavings.map(saving => ({
          name: saving.name,
          Goal: saving.target.minorUnits / 100, // Convert to major units if necessary
          Saved: saving.totalSaved.minorUnits / 100, // Convert to major units if necessary
        }));

        setSavings(chartData);
      } catch (error) {
        const message = error.response ? error.response.data.error : error.message;
        console.error(`Failed to fetch savings data: ${message}. Please try again later.`);
      }
    };
    fetchSavings();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={savings}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Saved" fill="##002930" />
        <Bar dataKey="Goal" fill="#07b3b6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
