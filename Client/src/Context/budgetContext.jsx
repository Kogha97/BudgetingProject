import React, { createContext, useState, useContext} from "react";

export const BudgetContext = createContext();

export default function BudgetProvider ({ children })  {
    const [budgetData, setBudgetData] = useState([
        {name: 'House Expenses', current: '', target: ''},
        {name: 'Subscriptions', current: '', target: ''},
        {name: 'Groceries', current: '', target: ''},
        {name: 'Eating Out', current: '', target: ''},
        {name: 'Medical', current: '', target: ''},
        {name: 'Travel', current: '', target: ''},
        {name: 'Extras', current: '', target: ''},
    ]);

    console.log(budgetData)
    const addBudgetTarget = (newTarget) => {
        setBudgetData([...budgetData, newTarget]);
    };


const updateBudgetCategory = (categoryName, newAmount) => {
    setBudgetData(currentData => 
      currentData.map(category => {
        if (category.name === categoryName) {
          return { ...category, current: newAmount }; 
        }
        return category;
      })
    );
};

      

    return (
        <BudgetContext.Provider value = {{budgetData, addBudgetTarget, updateBudgetCategory}}>
            {children}
        </BudgetContext.Provider>
    );
};