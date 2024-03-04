import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router'
import UserProvider from './Context/userContext'
import BudgetProvider  from './Context/budgetContext'
import './index.css'



ReactDOM.createRoot(document.getElementById('root')).render(
<UserProvider>
    <BudgetProvider>
        <Router/>
    </BudgetProvider>
</UserProvider>
)
