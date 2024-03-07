import React, { createContext, useState, useEffect, useContext} from "react";
import axios from 'axios'
import { UserContext } from "./userContext";

export const BudgetContext = createContext();

export default function BudgetProvider ({ children })  {

    const { user } = useContext(UserContext);

  
    const [budgetData, setBudgetData] = useState([
        {name: 'House Expenses', current: '', target: ''},
        {name: 'Subscriptions', current: '', target: ''},
        {name: 'Groceries', current: '', target: ''},
        {name: 'Eating Out', current: '', target: ''},
        {name: 'Medical', current: '', target: ''},
        {name: 'Travel', current: '', target: ''},
        {name: 'Extras', current: '', target: ''},
    ]);

const updateBudgetCategory = async (categoryName, newCurrent) => {

    try {
        if (!user._id) return
      const response = await axios.put(`http://localhost:5001/users/${user._id}/budgetCurrent`, {
        categoryName,
        currentAmount: newCurrent,
      });
    } catch (error) {
      console.error('Error updating budget category:', error.message);
    }
  };

const fetchBudgetData = async () => {
    if (!user || !user._id) return;
    try {
        const response = await axios.get(`http://localhost:5001/users/${user._id}/budgetTargets`);
        const predefinedCategories = [...budgetData]; 
        const fetchedTargetsMap = new Map(
            response.data.budgetTargets.map(target => [
                target.categoryName,
                {
                    target: target.targetAmount.toString(),
                    current: '',
                    id: target._id,
                    createdAt: target.createdAt,
                    updatedAt: target.updatedAt,
                },
            ])
        );

        const mergedBudgetData = predefinedCategories.map(category => {
            const fetchedTarget = fetchedTargetsMap.get(category.name);
            return fetchedTarget ? { ...category, ...fetchedTarget } : category;
        });

        setBudgetData(mergedBudgetData);
    } catch (error) {
        console.error("Failed to fetch budget data:", error.message);
    }
};

const fetchBudgetDataCurrent = async () => {
    if (!user || !user._id) return;
    try {
        const response = await axios.get(`http://localhost:5001/users/${user._id}/budgetCurrent`);
        const predefinedCategories = [...budgetData]; 
        const fetchedCurrentMap = new Map(
            response.data.budgetCurrent.map(current => [
                current.categoryName,
                {
                    current: current.currentAmount.toString(),
                    current: '',
                    id: current._id,
                    createdAt: current.createdAt,
                    updatedAt: current.updatedAt,
                },
            ])
        );

        const mergedBudgetData = predefinedCategories.map(category => {
            const fetchedCurrent = fetchedCurrentMap.get(category.name);
            return fetchedCurrent ? { ...category, ...fetchedCurrent } : category;
        });

        setBudgetData(mergedBudgetData);
    } catch (error) {
        console.error("Failed to fetch budget data:", error.message);
    }
};

useEffect(() => {

    if (user) fetchBudgetData();
    if(user)fetchBudgetDataCurrent();
},[user])
      

    return (
        <BudgetContext.Provider value = {{budgetData, updateBudgetCategory, fetchBudgetData,}}>
            {children}
        </BudgetContext.Provider>
    );
};