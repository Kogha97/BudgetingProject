import React, { createContext, useState, useContext} from "react";

export const BudgetContext = createContext();

export default function BudgetProvider ({ children })  {
    const [budgetData, setBudgetData] = useState([
        {name: 'House Expenses', current: 0, target: 0},
        {name: 'Subscriptions', current: 0, target: 0},
        {name: 'Groceries', current: 0, target: 0},
        {name: 'Eating Out', current: 0, target: 0},
        {name: 'Medical', current: 0, target: 0},
        {name: 'Travel', current: 0, target: 0},
        {name: 'Extras', current: 0, target: 0},
    ]);

    console.log(budgetData)
    const addBudgetTarget = (newTarget) => {
        setBudgetData([...budgetData, newTarget]);
    };

    return (
        <BudgetContext.Provider value = {{budgetData, addBudgetTarget}}>
            {children}
        </BudgetContext.Provider>
    );
};