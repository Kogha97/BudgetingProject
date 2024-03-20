import React, { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
import { UserContext } from "./userContext";

export const BudgetContext = createContext();

export default function BudgetProvider({ children }) {
    const { user } = useContext(UserContext);

    const getDefaultDateRange = () => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const format = (date) => date.toISOString().split('T')[0];
        return {
            startDate: format(firstDayOfMonth),
            endDate: format(today)
        };
    };

    const [budgetData, setBudgetData] = useState([
        { name: 'House Expenses', current: '', target: '' },
        { name: 'Subscriptions', current: '', target: '' },
        { name: 'Groceries', current: '', target: '' },
        { name: 'Eating Out', current: '', target: '' },
        { name: 'Medical', current: '', target: '' },
        { name: 'Travel', current: '', target: '' },
        { name: 'Extras', current: '', target: '' },
    ]);
    const [filter, setFilter] = useState(getDefaultDateRange());

    const updateBudgetCategory = async (categoryName, newCurrent) => {
        try {
            if (!user._id) return;
            await axios.put(`http://localhost:5001/users/${user._id}/budgetCurrent`, {
                categoryName,
                currentAmount: newCurrent,
            }, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Error updating budget category:', error.message);
        }
    };

    const fetchBudgetData = async () => {
        if (!user || !user._id) return;

        try {
            const [targetResponse, currentResponse] = await Promise.all([
                axios.get(`http://localhost:5001/users/${user._id}/budgetTargets`, {
                    withCredentials: true
                }),
                axios.get(`http://localhost:5001/users/${user._id}/budgetCurrent`, {
                    withCredentials: true
                })
            ]);

            const targetData = targetResponse.data.budgetTargets;
            const currentData = currentResponse.data.budgetCurrent;

            const updatedBudgetData = budgetData.map(category => ({
                ...category,
                target: targetData.find(t => t.categoryName === category.name)?.targetAmount.toString() || category.target,
                current: currentData.find(c => c.categoryName === category.name)?.currentAmount.toString() || category.current,
            }));

            setBudgetData(updatedBudgetData);
        } catch (error) {
            console.error("Failed to fetch budget data:", error);
        }
    };

    useEffect(() => {
        fetchBudgetData();
    
    }, [user, JSON.stringify(filter)]); 

    return (
        <BudgetContext.Provider value={{ budgetData, fetchBudgetData, updateBudgetCategory, filter, setFilter }}>
            {children}
        </BudgetContext.Provider>
    );
}
